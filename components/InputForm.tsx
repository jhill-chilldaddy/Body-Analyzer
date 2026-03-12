import React, { useRef, useState } from 'react';
import { Upload, Scale, Ruler, User, Trophy, CheckCircle2, Circle, Users, Calendar, Camera } from 'lucide-react';
import { UserInput } from '../types';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const SPORTS = [
  "American Football", "Archery", "Auto Racing", "Badminton", "Baseball", 
  "Basketball", "Billiards/Pool", "Bodybuilding", "Bowling", "Boxing", 
  "Cheerleading", "Cricket", "CrossFit", "Cycling", "Dance", 
  "Equestrian/Horse Racing", "Fencing", "Field Hockey", "Fishing", "Golf", 
  "Gymnastics", "Handball", "Hiking/Mountaineering", "Hunting", "Ice Hockey", 
  "Lacrosse", "MMA", "Pickleball", "Powerlifting", "Racquetball", 
  "Rock Climbing", "Rodeo", "Rowing", "Rugby", "Running (Distance)", 
  "Running (Sprinting)", "Shooting", "Skateboarding", "Skiing", "Snowboarding", 
  "Soccer", "Softball", "Surfing", "Swimming", "Table Tennis", 
  "Tennis", "Track & Field (Field Events)", "Triathlon", "Ultimate Frisbee", 
  "Volleyball", "Water Polo", "Wrestling", "Yoga"
];

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('ft');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('lbs');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [enableSport, setEnableSport] = useState(false);
  const [sport, setSport] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isSexValid = sex !== '';
  const isAgeValid = age !== '';
  const isHeightValid = heightUnit === 'ft' ? (heightFt !== '' && heightIn !== '') : (heightCm !== '');
  const isWeightValid = weight !== '';
  const isImageValid = image !== null;
  const isFormValid = isSexValid && isAgeValid && isHeightValid && isWeightValid && isImageValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || sex === '') return;

    let finalHeight = heightCm;
    if (heightUnit === 'ft') {
      finalHeight = `${heightFt}'${heightIn}`;
    }

    onSubmit({ 
      sex: sex as 'Male' | 'Female' | 'Other',
      age,
      height: finalHeight, 
      weight, 
      heightUnit, 
      weightUnit, 
      image,
      sport: enableSport ? sport : undefined
    });
  };

  const StepIndicator = ({ label, valid }: { label: string, valid: boolean }) => (
    <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${valid ? 'text-brand-400' : 'text-zinc-600'}`}>
      {valid ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
      {label}
    </div>
  );

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500 mb-2">
          New Analysis
        </h2>
        <p className="text-zinc-400 mb-6">
          Provide your biometrics and a full-body photo for AI analysis.
        </p>

        {/* Visual Progress/Validation */}
        <div className="flex justify-center gap-4 md:gap-6 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800/50 flex-wrap">
          <StepIndicator label="Sex" valid={isSexValid} />
          <StepIndicator label="Age" valid={isAgeValid} />
          <StepIndicator label="Height" valid={isHeightValid} />
          <StepIndicator label="Weight" valid={isWeightValid} />
          <StepIndicator label="Photo" valid={isImageValid} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sex Selection */}
        <div className="grid grid-cols-3 gap-3">
          {(['Male', 'Female', 'Other'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSex(option)}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                ${sex === option 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 border-transparent' 
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}`}
            >
              <Users className="w-4 h-4" />
              {option}
            </button>
          ))}
        </div>

        {/* Measurements Inputs (Age, Weight, Height) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Age Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-zinc-300 gap-2">
              <Calendar className="w-4 h-4 text-brand-400" /> Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-center"
              required
              min="1"
              max="120"
            />
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-zinc-300 gap-2">
              <Scale className="w-4 h-4 text-brand-400" /> Weight
            </label>
            <div className="relative flex gap-2">
              <div className="relative w-full">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={weightUnit === 'lbs' ? "160" : "75"}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-center"
                  required
                />
              </div>
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-2 cursor-pointer hover:bg-zinc-700 focus:outline-none"
              >
                <option value="lbs">lbs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          {/* Height Input (Full Width) */}
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center text-sm font-medium text-zinc-300 gap-2">
              <Ruler className="w-4 h-4 text-brand-400" /> Height
            </label>
            <div className="flex gap-2">
              {heightUnit === 'ft' ? (
                <>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-center"
                      required
                    />
                    <span className="absolute right-3 top-3 text-zinc-500 text-sm">ft</span>
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="10"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-center"
                      required
                    />
                    <span className="absolute right-3 top-3 text-zinc-500 text-sm">in</span>
                  </div>
                </>
              ) : (
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="178"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                    required
                  />
                  <span className="absolute right-10 top-3 text-zinc-500 text-sm">cm</span>
                </div>
              )}
              
              <select
                value={heightUnit}
                onChange={(e) => {
                   setHeightUnit(e.target.value as 'cm' | 'ft');
                   setHeightFt('');
                   setHeightIn('');
                   setHeightCm('');
                }}
                className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-2 cursor-pointer hover:bg-zinc-700 focus:outline-none"
              >
                <option value="ft">ft</option>
                <option value="cm">cm</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sport Selection (Optional) */}
        <div className="border-t border-zinc-800 pt-4">
           <div className="flex items-center gap-3 mb-4">
             <input 
               type="checkbox" 
               id="sportToggle"
               checked={enableSport} 
               onChange={(e) => setEnableSport(e.target.checked)}
               className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-brand-500 focus:ring-brand-500 focus:ring-offset-zinc-900"
             />
             <label htmlFor="sportToggle" className="text-zinc-300 text-sm cursor-pointer select-none">
               I want feedback for a specific sport
             </label>
           </div>

           {enableSport && (
             <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="flex items-center text-sm font-medium text-zinc-300 gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-brand-400" /> Select Sport
                </label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 px-4 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled>Choose a sport...</option>
                  {SPORTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
             </div>
           )}
        </div>

        {/* Image Upload Area - Moved to bottom */}
        <div 
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group
            ${preview ? 'border-brand-500/50 bg-zinc-900' : 'border-zinc-700 hover:border-brand-400 hover:bg-zinc-800/50'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          {preview ? (
            <div className="relative w-full aspect-[3/4] max-h-64 flex justify-center">
              <img src={preview} alt="Preview" className="h-full object-contain rounded-lg shadow-lg" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <span className="text-white font-medium bg-zinc-900/80 px-4 py-2 rounded-full backdrop-blur-md">Change Photo</span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-8 h-8 text-brand-400" />
              </div>
              <p className="text-zinc-200 font-medium mb-1">Take photo or upload</p>
              <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                Pose in a standing position with arms spread wide and feet slightly apart
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-300
            ${isLoading || !isFormValid
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:shadow-brand-500/25 hover:scale-[1.01] active:scale-[0.99]'}`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
              Analyzing Biometrics...
            </>
          ) : (
            <>
              Generate Analysis <User className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;