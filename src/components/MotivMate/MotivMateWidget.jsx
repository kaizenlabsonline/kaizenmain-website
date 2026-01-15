import React, { useState, useEffect } from 'react';
import quotesData from '../../data/quotes.json';

// Global Zen Mode State via localStorage
const isZenModeHidden = () => {
    try {
        return localStorage.getItem('motivmate_zen_mode') === 'true';
    } catch {
        return false;
    }
};

const MotivMateWidget = ({ category = 'collaboration', position = 'bottom' }) => {
    const [quote, setQuote] = useState(null);
    const [hidden, setHidden] = useState(isZenModeHidden());

    // Load a random quote on mount
    useEffect(() => {
        const filtered = quotesData.filter(q => q.category === category);
        const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
        setQuote(randomQ);
    }, [category]);

    const toggleZenMode = () => {
        const newState = !hidden;
        setHidden(newState);
        localStorage.setItem('motivmate_zen_mode', newState);
    };

    if (hidden) {
        return (
            <div className="fixed bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity z-50">
                <button
                    onClick={toggleZenMode}
                    className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1"
                    title="Show Motivational Quotes"
                >
                    💡
                </button>
            </div>
        );
    }

    if (!quote) return null;

    return (
        <div className={`
            font-sans text-slate-500 text-sm italic opacity-70 hover:opacity-100 transition-opacity cursor-default
            ${position === 'bottom' ? 'fixed bottom-4 left-0 right-0 text-center px-8' : ''}
            ${position === 'inline' ? 'my-4 text-center' : ''}
            z-40
        `}>
            <div className="group relative inline-block">
                "{quote.text}"
                <span className="not-italic text-slate-600 opacity-60 ml-2 text-xs">— {quote.author}</span>

                {/* Controls - Appear on Hover */}
                <button
                    onClick={toggleZenMode}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-slate-400 w-6 h-6 rounded-full flex items-center justify-center text-xs hover:text-white hover:bg-red-500 transition-all"
                    title="Hide / Zen Mode"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default MotivMateWidget;
