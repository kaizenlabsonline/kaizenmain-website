import React from 'react';

export const AffirmationCard = ({ text, imageUrl }) => {
  return (
    <div className="bg-slate-800 bg-opacity-60 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105">
      <div className="w-full h-72 sm:h-96 overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Uplifting scenery" 
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
        />
      </div>
      <div className="p-6 md:p-8">
        <p className="text-xl sm:text-2xl font-medium text-center text-slate-100 leading-relaxed">
          "{text}"
        </p>
      </div>
    </div>
  );
};