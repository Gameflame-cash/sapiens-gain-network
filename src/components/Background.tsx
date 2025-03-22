
import React from 'react';

const Background: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 dark:from-background dark:to-blue-950/20 relative overflow-hidden">
      {/* Gradient elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-100/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-sky-100/30 dark:bg-sky-900/10 rounded-full blur-3xl" />
        
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 bg-gradient-noise opacity-[0.15] mix-blend-soft-light" />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;
