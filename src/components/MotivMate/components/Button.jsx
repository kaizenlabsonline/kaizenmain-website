import React from 'react';

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        px-6 py-3 text-lg font-semibold rounded-lg shadow-lg
        text-white 
        bg-blue-600
        hover:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75
        transition-all duration-200 ease-in-out
        transform hover:scale-105
        disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:bg-blue-500 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};