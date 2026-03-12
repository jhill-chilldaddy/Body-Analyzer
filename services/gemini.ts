import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const SYSTEM_PROMPT = `
You are an expert biomechanist, anthropologist, and art historian. 
Your task is to analyze a human body from a photograph to determine proportions, anatomical landmarks, and provide comparative analysis.

You must output strict JSON.

Tasks:
1. Identify the 2D coordinates (0-100 percentage of image width/height) for key anatomical landmarks. 
   CRITICAL: Be extremely precise. Locate the CENTER of rotation for joints (knees, elbows, shoulders, hips) and the exact tips for extremities.
2. Estimate body measurements based on the user's provided height.
   CRITICAL FORMATTING: All measurements MUST be in Imperial units. 
   - Use Feet and Inches (e.g., "6' 2\\"") for large dimensions like Height, Wingspan, Total Arm Length, Total Leg Length.
   - Use Inches (e.g., "18.5\\"") for smaller segments or widths like Head Size, Neck, Upper Arm, Chest Width.
3. Provide deep textual analysis. 
   CRITICAL STYLING:
   - Use Markdown headers "### Advantages" and "### Disadvantages" for athletic sections.
   - Highlight ANY statistical anomalies or significant deviations (e.g. exceptionally long arms, very wide shoulders) using **bold text**.
   - In "population_comparison", explicitly state the deviation from the mean (e.g. "+2.5 inches above average", "Top 5 percentile").

Content Requirements:
    - Population comparison: Compare to age/sex specific averages. Include % deviation.
    - Aesthetic analysis: Ideals, symmetry, golden ratio comparisons.
    - Artistic comparison: Vitruvian Man, Statue of David.
    - Athletic advantage: Biomechanics, levers, torque.
    - Sport-specific analysis: Best positions/roles.
    - Recommended activities: Exercises and sports suited for this biomechanics.
`;

export const analyzeImage = async (
  imageFile: File,
  height: string,
  weight: string,
  heightUnit: string,
  weightUnit: string,
  sex: string,
  age: string,
  sport?: string
): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Convert file to base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const sportPrompt = sport 
    ? `
      DETAILED SPORT ANALYSIS REQUIRED for: "${sport}".
      
      You must provide a breakdown of how this body type fits into specific positions or movements within this sport.
      
      Examples:
      - If "American Football": Analyze suitability for Lineman vs Running Back vs Receiver vs Quarterback based on limb length, torso size, and center of mass.
      - If "Powerlifting": Analyze mechanical advantages/disadvantages for the Squat, Bench Press, and Deadlift separately (e.g., "Long femurs may make squatting harder but short arms help bench press").
      - If "Swimming": Analyze drag and propulsion potential based on torso shape and wingspan.
      
      Be specific about the BIOMECHANICAL reasons (leverage, torque, range of motion) why they fit or do not fit specific roles.
      Separate into "### Advantages" and "### Disadvantages" sections.
      `
    : "";

  const prompt = `
    Analyze this person.
    Sex: ${sex}
    Age: ${age}
    Height: ${height} ${heightUnit}
    Weight: ${weight} ${weightUnit}
    ${sportPrompt}
    
    Identify key landmarks exactly.
    Calculate dimensions in Imperial units (Feet/Inches).
    
    Return JSON matching this structure:
    {
      "landmarks": {
        "top_skull": {"x": 50, "y": 10},
        "chin": {"x": 50, "y": 15},
        ... (include: l_shoulder, r_shoulder, l_elbow, r_elbow, l_wrist, r_wrist, l_fingertip, r_fingertip, chest_l, chest_r, waist_l, waist_r, hip_l, hip_r, l_knee, r_knee, l_ankle, r_ankle, l_foot, r_foot)
      },
      "measurements": {
        "head_size": "Value string",
        "neck_width": "Value string",
        "shoulder_width": "Value string",
        "arm_length_total": "Value string",
        "upper_arm_length": "Value string",
        "lower_arm_length": "Value string",
        "upper_lower_arm_ratio": "Ratio string",
        "wingspan": "Value string",
        "hand_length": "Value string",
        "chest_width": "Value string",
        "torso_length": "Value string",
        "hip_width": "Value string",
        "chest_waist_ratio": "Ratio string",
        "chest_hip_ratio": "Ratio string",
        "leg_length_total": "Value string",
        "upper_leg_length": "Value string",
        "lower_leg_length": "Value string",
        "upper_lower_leg_ratio": "Ratio string"
      },
      "analysis": {
        "population_comparison": "Markdown string (include mean deviation)...",
        "aesthetic_beauty": "Markdown string...",
        "artistic_comparison": "Markdown string...",
        "athletic_analysis": "Markdown string (Use ### Advantages and ### Disadvantages headers)...",
        "sport_specific_analysis": "Markdown string (Required if sport provided, use ### Advantages and ### Disadvantages headers)...",
        "recommended_activities": "Markdown string identifying specific exercises or sports this body type has a mechanical advantage for."
      }
    }
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: imageFile.type,
            data: base64Data
          }
        },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      systemInstruction: SYSTEM_PROMPT
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse JSON", text);
    throw new Error("Failed to parse analysis results");
  }
};