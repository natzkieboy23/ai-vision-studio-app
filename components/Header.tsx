import React from 'react';
import { CameraIcon } from './Icons';

export const Header: React.FC = () => {
    return (
        <header className="w-full max-w-5xl mx-auto mb-8 text-center">
            <div className="flex items-center justify-center mb-2">
                <CameraIcon />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 ml-3">
                    AI Vision Studio
                </h1>
            </div>
            <p className="text-gray-400 text-lg">Your Personal AI-Powered Vision Studio</p>
        </header>
    );
};