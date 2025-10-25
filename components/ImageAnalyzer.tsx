
import React, { useState } from 'react';
import type { EditSuggestion } from '../types';
import { MagicWandIcon, DocumentTextIcon, LightBulbIcon, ChatBubbleLeftRightIcon } from './Icons';
import { Card } from './Card';

interface ImageAnalyzerProps {
    isLoading: boolean;
    activeAnalysis: 'describe' | 'suggest' | 'story' | null;
    analysisResult: string | null;
    editSuggestions: EditSuggestion[];
    onAnalyze: (type: 'describe' | 'suggest' | 'story') => void;
    onApplyEdit: (prompt: string) => void;
}

export const ImageAnalyzer: React.FC<ImageAnalyzerProps> = ({ isLoading, activeAnalysis, analysisResult, editSuggestions, onAnalyze, onApplyEdit }) => {
    const [editPrompt, setEditPrompt] = useState('');
    
    const handleSuggestionClick = (description: string) => {
        setEditPrompt(description);
    };

    const handleApplyEdit = () => {
        if (!editPrompt.trim()) return;
        onApplyEdit(editPrompt);
        setEditPrompt('');
    };

    // Fix: The 'jsx' prop is not valid on a style tag in this React setup, and @apply is not standard CSS.
    // The <style> block has been removed and Tailwind classes are applied directly to the buttons for styling.
    const toolButtonClassName = "flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl w-full">
            <h3 className="text-2xl font-bold text-gray-200 mb-4">AI Toolkit</h3>
            <p className="text-gray-400 mb-6">Explore what AI can do with your image. Get descriptions, creative ideas, or even a story.</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <button onClick={() => onAnalyze('describe')} disabled={isLoading} className={toolButtonClassName}>
                    <DocumentTextIcon /> Describe
                </button>
                <button onClick={() => onAnalyze('suggest')} disabled={isLoading} className={toolButtonClassName}>
                    <LightBulbIcon /> Suggest Edits
                </button>
                <button onClick={() => onAnalyze('story')} disabled={isLoading} className={toolButtonClassName}>
                    <ChatBubbleLeftRightIcon /> Generate Story
                </button>
            </div>
            
            <div className="min-h-[200px]">
                {isLoading && activeAnalysis && (
                    <Card title={`Generating ${activeAnalysis}...`}>
                        <div className="flex justify-center items-center p-8">
                             <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </Card>
                )}

                {!isLoading && analysisResult && (
                    <Card title={activeAnalysis === 'describe' ? "Image Description" : "A Story for You"} onClear={() => onAnalyze(null)}>
                        <p className="text-gray-300 whitespace-pre-wrap">{analysisResult}</p>
                    </Card>
                )}
                
                {!isLoading && editSuggestions.length > 0 && (
                    <Card title="Creative Edit Suggestions" onClear={() => onAnalyze(null)}>
                        <div className="space-y-4">
                            {editSuggestions.map((suggestion, index) => (
                                <div key={index} className="p-3 bg-gray-700 rounded-md">
                                    <h4 className="font-semibold text-purple-300">{suggestion.title}</h4>
                                    <p className="text-gray-300 text-sm mt-1 mb-2">{suggestion.description}</p>
                                    <button onClick={() => handleSuggestionClick(suggestion.description)} className="text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded-md transition-colors">
                                        Use this idea
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>

            <div className="mt-6">
                 <h4 className="font-semibold text-lg mb-2 text-gray-300">Magic Edit</h4>
                 <textarea
                    rows={3}
                    className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-white placeholder-gray-400 resize-none"
                    placeholder="Describe the edit you want to apply..."
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    disabled={isLoading}
                />
                 <button 
                    onClick={handleApplyEdit} 
                    disabled={isLoading || !editPrompt}
                    className="w-full mt-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors">
                     <MagicWandIcon />
                     <span className="ml-2">Apply Edit</span>
                 </button>
            </div>
        </div>
    );
};
