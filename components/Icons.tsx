
import React from 'react';

export const Icon: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {children}
    </svg>
);

export const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

export const UploadIcon: React.FC = () => (
    <Icon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </Icon>
);

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414l-2.293 2.293m0-4.586l2.293-2.293a1 1 0 011.414 0l2.293 2.293m-4.586 0l-2.293 2.293a1 1 0 01-1.414 0l-2.293-2.293m4.586 0l-2.293-2.293" />
    </Icon>
);

export const MagicWandIcon: React.FC = () => (
    <Icon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.586l-2.293-2.293a1 1 0 00-1.414 1.414l2.293 2.293m2.828-2.828l2.293-2.293a1 1 0 011.414 1.414l-2.293 2.293m-4.242 4.242L6 18.293l-1.293-1.293a1 1 0 010-1.414l2.293-2.293m8.486 8.486L18 6.707l1.293 1.293a1 1 0 010 1.414l-2.293 2.293m-4.242-4.242L18 6.707" />
    </Icon>
);

export const DocumentTextIcon: React.FC = () => (
    <Icon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </Icon>
);

export const LightBulbIcon: React.FC = () => (
    <Icon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </Icon>
);

export const ChatBubbleLeftRightIcon: React.FC = () => (
    <Icon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </Icon>
);

