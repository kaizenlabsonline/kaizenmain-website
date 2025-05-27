import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-400"></div>
      <p className="text-lg text-slate-300">Loading your moment of calm...</p>
    </div>
  );
};