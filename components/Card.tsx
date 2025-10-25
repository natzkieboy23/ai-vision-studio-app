
import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    onClear?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, children, onClear }) => {
    return (
        <div className="bg-gray-700/50 rounded-lg p-4 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-gray-200">{title}</h3>
                {onClear && (
                    <button onClick={onClear} className="text-xs text-gray-400 hover:text-white">&times; clear</button>
                )}
            </div>
            <div>{children}</div>
            {/* Fix: Removed invalid `jsx="true"` prop from style tag. This was causing a TypeScript error. */}
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
