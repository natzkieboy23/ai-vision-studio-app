
import React, { useState } from 'react';
import * as geminiService from '../services/geminiService';
import { SparklesIcon } from './Icons';

interface ImageGeneratorProps {
    onImageGenerated: (base64Image: string) => void;
    setAppState: (state: 'idle' | 'generating') => void;
    setError: (error: string | null) => void;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onImageGenerated, setAppState, setError }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt to generate an image.');
            return;
        }
        setIsLoading(true);
        setAppState('generating');
        setError(null);

        try {
            const imageBase64 = await geminiService.generateImage(prompt);
            onImageGenerated(imageBase64);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setAppState('idle');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="relative">
                 <textarea
                    rows={3}
                    className="w-full p-4 pr-12 bg-gray-700 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-400 resize-none"
                    placeholder="e.g., A majestic lion wearing a crown, cinematic lighting"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleGenerate();
                        }
                    }}
                    disabled={isLoading}
                />
            </div>
           
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md flex items-center justify-center transition-colors"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : (
                    <>
                        <SparklesIcon />
                        <span className="ml-2">Generate Image</span>
                    </>
                )}
            </button>
        </div>
    );
};
