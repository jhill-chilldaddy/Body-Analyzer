import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';
import { Activity, Users, Palette, Trophy, Ruler, Dumbbell, Star } from 'lucide-react';

interface AnalysisResultsProps {
  data: AnalysisResult;
}

const MeasurementCard = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0 group">
    <span className="text-zinc-400 text-sm">{label}</span>
    <span className="text-zinc-100 font-mono font-medium">{value}</span>
  </div>
);

const AnalysisSection = ({ 
  title, 
  icon: Icon, 
  content 
}: { 
  title: string; 
  icon: React.ElementType; 
  content: string;
}) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 shadow-md">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-brand-900/30 rounded-lg">
        <Icon className="w-5 h-5 text-brand-400" />
      </div>
      <h3 className="text-xl font-semibold text-zinc-100">{title}</h3>
    </div>
    <div className="prose prose-invert prose-brand max-w-none text-zinc-300 text-sm leading-relaxed">
      <ReactMarkdown
        components={{
          h3: ({node, ...props}) => {
             const text = String(props.children).toLowerCase();
             if (text.includes('advantages')) {
               return <h3 className="text-lg font-bold text-emerald-400 mt-6 mb-3 p-2 bg-emerald-950/30 rounded-lg border border-emerald-900/50 flex items-center gap-2" {...props} />
             }
             if (text.includes('disadvantages')) {
               return <h3 className="text-lg font-bold text-rose-400 mt-6 mb-3 p-2 bg-rose-950/30 rounded-lg border border-rose-900/50 flex items-center gap-2" {...props} />
             }
             return <h3 className="text-lg font-semibold text-zinc-100 mt-4 mb-2" {...props} />
          },
          strong: ({node, ...props}) => (
             <strong className="font-bold text-brand-200 bg-brand-900/40 px-1 py-0.5 rounded border border-brand-500/20" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  </div>
);

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar pr-2">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Biometric Report</h2>
        <p className="text-zinc-400 text-sm">Comprehensive analysis of proportions and biomechanics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Key Measurements Panel */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:col-span-2">
           <div className="flex items-center gap-2 mb-4">
              <Ruler className="w-5 h-5 text-brand-400" />
              <h3 className="text-lg font-semibold text-white">Key Measurements</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
             <MeasurementCard label="Head Size (Height)" value={data.measurements.head_size} />
             <MeasurementCard label="Neck Width" value={data.measurements.neck_width} />
             <MeasurementCard label="Shoulder Width" value={data.measurements.shoulder_width} />
             
             <MeasurementCard label="Total Arm Length" value={data.measurements.arm_length_total} />
             <MeasurementCard label="Upper Arm (Humerus)" value={data.measurements.upper_arm_length} />
             <MeasurementCard label="Lower Arm (Radius)" value={data.measurements.lower_arm_length} />
             <MeasurementCard label="Arm Ratio" value={data.measurements.upper_lower_arm_ratio} />
             <MeasurementCard label="Wingspan" value={data.measurements.wingspan} />
             
             <MeasurementCard label="Torso Length" value={data.measurements.torso_length} />
             <MeasurementCard label="Chest Width" value={data.measurements.chest_width} />
             <MeasurementCard label="Hip Width" value={data.measurements.hip_width} />
             <MeasurementCard label="Chest/Hip Ratio" value={data.measurements.chest_hip_ratio} />
             <MeasurementCard label="Chest/Waist Ratio" value={data.measurements.chest_waist_ratio} />
             
             <MeasurementCard label="Total Leg Length" value={data.measurements.leg_length_total} />
             <MeasurementCard label="Upper Leg (Femur)" value={data.measurements.upper_leg_length} />
             <MeasurementCard label="Lower Leg (Tibia)" value={data.measurements.lower_leg_length} />
             <MeasurementCard label="Leg Ratio" value={data.measurements.upper_lower_leg_ratio} />
           </div>
        </div>
      </div>

      <AnalysisSection 
        title="Recommended Exercises & Activities" 
        icon={Star} 
        content={data.analysis.recommended_activities} 
      />

      {data.analysis.sport_specific_analysis && (
        <AnalysisSection 
          title="Sport Specific Analysis" 
          icon={Dumbbell} 
          content={data.analysis.sport_specific_analysis} 
        />
      )}

      <AnalysisSection 
        title="Athletic Advantage" 
        icon={Trophy} 
        content={data.analysis.athletic_analysis} 
      />

      <AnalysisSection 
        title="Population Comparison" 
        icon={Users} 
        content={data.analysis.population_comparison} 
      />
      
      <AnalysisSection 
        title="Aesthetic Analysis" 
        icon={Palette} 
        content={data.analysis.aesthetic_beauty} 
      />

      <AnalysisSection 
        title="Artistic Comparison" 
        icon={Activity} 
        content={data.analysis.artistic_comparison} 
      />

    </div>
  );
};

export default AnalysisResults;