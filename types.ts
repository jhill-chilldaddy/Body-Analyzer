export interface Coordinates {
  x: number;
  y: number;
}

export interface BodyLandmarks {
  top_skull: Coordinates;
  chin: Coordinates;
  l_shoulder: Coordinates;
  r_shoulder: Coordinates;
  l_elbow: Coordinates;
  r_elbow: Coordinates;
  l_wrist: Coordinates;
  r_wrist: Coordinates;
  l_fingertip: Coordinates;
  r_fingertip: Coordinates;
  chest_l: Coordinates;
  chest_r: Coordinates;
  waist_l: Coordinates;
  waist_r: Coordinates;
  hip_l: Coordinates;
  hip_r: Coordinates;
  l_knee: Coordinates;
  r_knee: Coordinates;
  l_ankle: Coordinates;
  r_ankle: Coordinates;
  l_foot: Coordinates;
  r_foot: Coordinates;
}

export interface BodyMeasurements {
  head_size: string;
  neck_width: string;
  shoulder_width: string;
  arm_length_total: string;
  upper_arm_length: string;
  lower_arm_length: string;
  upper_lower_arm_ratio: string;
  wingspan: string;
  hand_length: string;
  chest_width: string;
  torso_length: string;
  hip_width: string;
  chest_waist_ratio: string;
  chest_hip_ratio: string;
  leg_length_total: string;
  upper_leg_length: string;
  lower_leg_length: string;
  upper_lower_leg_ratio: string;
}

export interface AnalysisSections {
  population_comparison: string;
  aesthetic_beauty: string;
  artistic_comparison: string;
  athletic_analysis: string;
  sport_specific_analysis?: string;
  recommended_activities: string;
}

export interface AnalysisResult {
  landmarks: BodyLandmarks;
  measurements: BodyMeasurements;
  analysis: AnalysisSections;
}

export interface UserInput {
  sex: 'Male' | 'Female' | 'Other';
  age: string;
  height: string;
  weight: string;
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lbs';
  image: File | null;
  sport?: string;
}