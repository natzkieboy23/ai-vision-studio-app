import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { UploadIcon, SparklesIcon } from './components/Icons';
import type { EditSuggestion } from './types';
import * as geminiService from './services/geminiService';

type AppState = 'idle' | 'generating' | 'analyzing' | 'editing';
type AnalysisType = 'describe' | 'suggest' | 'story' | null;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [image, setImage] = useState<{ url: string; base64: string; mimeType: string; } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [editSuggestions, setEditSuggestions] = useState<EditSuggestion[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisType>(null);


  const handleImageGenerated = (base64Image: string) => {
    setImage({ url: `data:image/jpeg;base64,${base64Image}`, base64: base64Image, mimeType: 'image/jpeg' });
    setAppState('idle');
    clearAnalysis();
  };

  const handleImageUploaded = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImage({ url: URL.createObjectURL(file), base64: base64String, mimeType: file.type });
      setAppState('idle');
      clearAnalysis();
    };
    reader.onerror = () => {
        setError("Failed to read the uploaded file.");
    };
    reader.readAsDataURL(file);
  };
  
  const clearAnalysis = () => {
      setAnalysisResult(null);
      setEditSuggestions([]);
      setActiveAnalysis(null);
  }

  const reset = () => {
    setImage(null);
    setAppState('idle');
    setError(null);
    clearAnalysis();
  };

  const analyzeImage = useCallback(async (type: AnalysisType) => {
    if (!image) return;
    setAppState('analyzing');
    setActiveAnalysis(type);
    setError(null);
    setAnalysisResult(null);
    setEditSuggestions([]);
    try {
      let result;
      switch (type) {
        case 'describe':
          result = await geminiService.describeImage(image.base64, image.mimeType);
          setAnalysisResult(result);
          break;
        case 'suggest':
          const suggestions = await geminiService.suggestEdits(image.base64, image.mimeType);
          setEditSuggestions(suggestions);
          break;
        case 'story':
          result = await geminiService.generateStory(image.base64, image.mimeType);
          setAnalysisResult(result);
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setAppState('idle');
    }
  }, [image]);

  const applyMagicEdit = useCallback(async (prompt: string) => {
    if (!image) return;
    setAppState('editing');
    setError(null);
    clearAnalysis();
    try {
      const newImageBase64 = await geminiService.editImage(image.base64, image.mimeType, prompt);
      setImage({ url: `data:image/png;base64,${newImageBase64}`, base64: newImageBase64, mimeType: 'image/png' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while editing the image.');
    } finally {
      setAppState('idle');
    }
  }, [image]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <Header />
      <main className="w-full max-w-5xl mx-auto flex-grow flex flex-col items-center">
        {!image ? (
          <div className="w-full max-w-2xl text-center flex-grow flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-200 mb-4">Welcome to AI Vision Studio</h2>
            <p className="text-lg text-gray-400 mb-8">Generate a new image from your imagination or upload one to start the magic.</p>
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
              <ImageGenerator onImageGenerated={handleImageGenerated} setAppState={setAppState} setError={setError} />
              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4 text-gray-400">OR</span>
                <div className="flex-grow border-t border-gray-600"></div>
              </div>
              <label htmlFor="file-upload" className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md inline-flex items-center justify-center transition-colors">
                <UploadIcon />
                <span className="ml-2">Upload an Image</span>
              </label>
              <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && e.target.files[0] && handleImageUploaded(e.target.files[0])} />
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2 flex flex-col items-center">
              <div className="relative w-full max-w-lg aspect-square bg-gray-800 rounded-lg shadow-2xl overflow-hidden mb-4">
                <img src={image.url} alt="User generated or uploaded content" className="w-full h-full object-contain" />
                 {(appState === 'generating' || appState === 'editing' || appState === 'analyzing') && (
                     <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                         <SparklesIcon className="h-12 w-12 text-purple-400 animate-pulse" />
                         <p className="text-xl mt-4 font-semibold text-white">
                             {appState === 'generating' && 'Generating your vision...'}
                             {appState === 'editing' && 'Applying magic edit...'}
                             {appState === 'analyzing' && `Analyzing image...`}
                         </p>
                     </div>
                 )}
              </div>
              <button
                onClick={reset}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
              >
                Start Over
              </button>
            </div>
            <div className="lg:w-1/2">
              <ImageAnalyzer
                isLoading={appState === 'analyzing'}
                activeAnalysis={activeAnalysis}
                analysisResult={analysisResult}
                editSuggestions={editSuggestions}
                onAnalyze={analyzeImage}
                onApplyEdit={applyMagicEdit}
              />
            </div>
          </div>
        )}
        {error && (
            <div className="mt-4 p-4 bg-red-800 border border-red-600 text-white rounded-md text-center">
                <p><strong>Error:</strong> {error}</p>
                <button onClick={() => setError(null)} className="mt-2 text-sm underline">Dismiss</button>
            </div>
        )}
      </main>
      <footer className="text-center text-gray-500 mt-8 text-sm">
          <p>Powered by Google Gemini. Create, analyze, and transform your images.</p>
      </footer>
    </div>
  );
};

export default App;