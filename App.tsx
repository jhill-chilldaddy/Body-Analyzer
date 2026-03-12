import React, { useState } from 'react';
import InputForm from './components/InputForm';
import BodyDiagram from './components/BodyDiagram';
import AnalysisResults from './components/AnalysisResults';
import { UserInput, AnalysisResult } from './types';
import { analyzeImage } from './services/gemini';
import { ScanFace, ChevronLeft } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputSubmit = async (input: UserInput) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create a local URL for the image to display immediately
      const imageUrl = URL.createObjectURL(input.image!);
      setCurrentImage(imageUrl);
      
      const result = await analyzeImage(
        input.image!, 
        input.height, 
        input.weight, 
        input.heightUnit, 
        input.weightUnit,
        input.sex,
        input.age,
        input.sport
      );
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setData(null);
    setCurrentImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500/10 p-2 rounded-lg">
              <ScanFace className="w-6 h-6 text-brand-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-100 to-brand-400">
              VITRUVIAN<span className="font-light text-brand-600">.AI</span>
            </h1>
          </div>
          {data && (
            <button 
              onClick={handleReset}
              className="text-sm font-medium text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> New Scan
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto min-h-screen">
        {!data && !isLoading && !currentImage && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
             <div className="text-center mb-12 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Unlock your <span className="text-brand-400">Biological Blueprint</span>
                </h2>
                <p className="text-lg text-zinc-400">
                  Advanced AI biomechanical analysis comparing your proportions to classical ideals, athletic standards, and population datasets.
                </p>
             </div>
             <InputForm onSubmit={handleInputSubmit} isLoading={isLoading} />
          </div>
        )}

        {(isLoading || (currentImage && !data)) && (
          <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <ScanFace className="absolute inset-0 m-auto w-12 h-12 text-brand-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Analyzing Anatomy</h3>
            <p className="text-zinc-500 animate-pulse">Calculating levers, ratios, and comparisons...</p>
          </div>
        )}

        {error && (
          <div className="max-w-xl mx-auto mt-12 p-6 bg-red-950/20 border border-red-900/50 rounded-xl text-center">
            <h3 className="text-red-400 font-bold text-lg mb-2">Analysis Failed</h3>
            <p className="text-red-200/70 mb-4">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-200 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {data && currentImage && (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:h-[calc(100vh-8rem)]">
             {/* Left Column: Interactive Diagram */}
             <div className="lg:col-span-5 h-[500px] lg:h-full relative flex flex-col shrink-0">
               <div className="flex-1 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-2 relative shadow-lg overflow-hidden">
                 <BodyDiagram 
                    imageSrc={currentImage} 
                    landmarks={data.landmarks}
                  />
               </div>
               <div className="mt-4 text-center">
                 <p className="text-xs text-zinc-500 font-mono">
                   * Diagram coordinates are AI-estimated overlays
                 </p>
               </div>
             </div>

             {/* Right Column: Analysis Data */}
             <div className="lg:col-span-7 lg:h-full bg-zinc-950/50 rounded-2xl border border-zinc-800/50 p-6 lg:overflow-y-auto custom-scrollbar flex flex-col shadow-xl">
                <AnalysisResults data={data} />
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;