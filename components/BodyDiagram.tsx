import React, { useState } from 'react';
import { BodyLandmarks, Coordinates } from '../types';

interface BodyDiagramProps {
  imageSrc: string;
  landmarks: BodyLandmarks;
}

const BodyDiagram: React.FC<BodyDiagramProps> = ({ imageSrc, landmarks }) => {
  const [imgRatio, setImgRatio] = useState<number | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalHeight > 0) {
      setImgRatio(naturalWidth / naturalHeight);
    }
  };

  // Helper to convert % to standard CSS string
  const toPos = (coord: Coordinates) => ({
    left: `${coord.x}%`,
    top: `${coord.y}%`
  });

  const Point = ({ coord, label }: { coord: Coordinates; label?: string }) => {
    if (!coord) return null;
    return (
      <div
        className="absolute w-2 h-2 -ml-1 -mt-1 bg-brand-300 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)] z-10 group"
        style={toPos(coord)}
      >
        {label && (
          <div className="absolute left-3 top-0 bg-black/80 text-[10px] text-brand-100 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-20">
            {label}
          </div>
        )}
      </div>
    );
  };
  
  // Construct an SVG path string for connections
  const Line = ({ p1, p2 }: { p1: Coordinates, p2: Coordinates }) => {
     if(!p1 || !p2) return null;
     return <line x1={`${p1.x}%`} y1={`${p1.y}%`} x2={`${p2.x}%`} y2={`${p2.y}%`} stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.6" />;
  }

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800 group/container flex items-center justify-center">
      {/* 
        Wrapper that constrains aspect ratio. 
        It scales down to fit the parent (w-full h-full) while maintaining aspect ratio.
        This ensures the overlay matches the image dimensions exactly, preventing misalignment.
      */}
      <div 
        className="relative shadow-2xl"
        style={{ 
          aspectRatio: imgRatio ? `${imgRatio}` : 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
          width: imgRatio ? 'auto' : '100%', 
          height: imgRatio ? 'auto' : '100%'
        }}
      >
        <img
          src={imageSrc}
          alt="Analyzed Body"
          onLoad={handleImageLoad}
          className="block w-full h-full object-contain opacity-70 grayscale contrast-125 transition-all duration-500 group-hover/container:opacity-90"
        />

        {/* Only render overlays after we have the aspect ratio to ensure alignment */}
        {imgRatio && (
          <>
            {/* Grid Overlay for "Scanner" effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            {/* SVG Layer for Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <Line p1={landmarks.top_skull} p2={landmarks.chin} />
              <Line p1={landmarks.chin} p2={landmarks.l_shoulder} />
              <Line p1={landmarks.chin} p2={landmarks.r_shoulder} />
              
              {/* Arms */}
              <Line p1={landmarks.l_shoulder} p2={landmarks.l_elbow} />
              <Line p1={landmarks.l_elbow} p2={landmarks.l_wrist} />
              <Line p1={landmarks.l_wrist} p2={landmarks.l_fingertip} />
              
              <Line p1={landmarks.r_shoulder} p2={landmarks.r_elbow} />
              <Line p1={landmarks.r_elbow} p2={landmarks.r_wrist} />
              <Line p1={landmarks.r_wrist} p2={landmarks.r_fingertip} />

              {/* Torso */}
              <Line p1={landmarks.l_shoulder} p2={landmarks.waist_l} />
              <Line p1={landmarks.r_shoulder} p2={landmarks.waist_r} />
              <Line p1={landmarks.waist_l} p2={landmarks.hip_l} />
              <Line p1={landmarks.waist_r} p2={landmarks.hip_r} />
              <Line p1={landmarks.hip_l} p2={landmarks.hip_r} />
              <Line p1={landmarks.l_shoulder} p2={landmarks.r_shoulder} />

              {/* Legs */}
              <Line p1={landmarks.hip_l} p2={landmarks.l_knee} />
              <Line p1={landmarks.l_knee} p2={landmarks.l_ankle} />
              <Line p1={landmarks.l_ankle} p2={landmarks.l_foot} />

              <Line p1={landmarks.hip_r} p2={landmarks.r_knee} />
              <Line p1={landmarks.r_knee} p2={landmarks.r_ankle} />
              <Line p1={landmarks.r_ankle} p2={landmarks.r_foot} />
            </svg>

            {/* Points Layer */}
            <Point coord={landmarks.top_skull} label="Top Skull" />
            <Point coord={landmarks.chin} label="Chin" />
            <Point coord={landmarks.l_shoulder} label="L Shoulder" />
            <Point coord={landmarks.r_shoulder} label="R Shoulder" />
            <Point coord={landmarks.l_elbow} label="L Elbow" />
            <Point coord={landmarks.r_elbow} label="R Elbow" />
            <Point coord={landmarks.l_wrist} label="L Wrist" />
            <Point coord={landmarks.r_wrist} label="R Wrist" />
            <Point coord={landmarks.l_fingertip} label="L Finger" />
            <Point coord={landmarks.r_fingertip} label="R Finger" />
            <Point coord={landmarks.hip_l} label="L Hip" />
            <Point coord={landmarks.hip_r} label="R Hip" />
            <Point coord={landmarks.l_knee} label="L Knee" />
            <Point coord={landmarks.r_knee} label="R Knee" />
            <Point coord={landmarks.l_ankle} label="L Ankle" />
            <Point coord={landmarks.r_ankle} label="R Ankle" />
          </>
        )}
      </div>
    </div>
  );
};

export default BodyDiagram;