import React, { useState } from 'react';

const JsonSwissKnife = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState(null);
    const [mode, setMode] = useState('format'); // format, minify, diff (future)

    const handleFormat = () => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
            setError(null);
        } catch (e) {
            setError(e.message);
            setOutput('');
        }
    };

    const handleMinify = () => {
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError(null);
        } catch (e) {
            setError(e.message);
            setOutput('');
        }
    };

    const handleValidate = () => {
        try {
            JSON.parse(input);
            setError(null);
            alert("Valid JSON!");
        } catch (e) {
            setError(e.message);
        }
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setError(null);
    };

    const copyOutput = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        alert("Copied to clipboard!");
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 text-slate-100">
            <header className="mb-8 text-center bg-gray-900 bg-opacity-80 p-6 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md">
                <h1 className="text-3xl font-bold text-white mb-2">JSON Swiss Knife 🛠️</h1>
                <p className="text-slate-400">Format, Minify, and Validate your JSON instantly. Offline & Secure.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-6 h-[70vh]">
                {/* Input Pane */}
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-slate-300 font-semibold">Input JSON</label>
                        <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300 underline">Clear</button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste messy JSON here..."
                        className={`w-full flex-1 bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-xl p-4 font-mono text-sm text-green-400 outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                        spellCheck={false}
                    />
                    {error && (
                        <div className="mt-2 bg-red-900 bg-opacity-50 text-red-200 p-3 rounded-lg text-sm font-mono border border-red-700">
                            ❌ Syntax Error: {error}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex flex-row md:flex-col justify-center gap-4 py-4 md:py-0">
                    <button
                        onClick={handleFormat}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl shadow-lg font-bold flex flex-col items-center gap-2 min-w-[100px] transition-transform hover:scale-105"
                    >
                        <span>✨</span> Format
                    </button>
                    <button
                        onClick={handleMinify}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl shadow-lg font-bold flex flex-col items-center gap-2 min-w-[100px] transition-transform hover:scale-105"
                    >
                        <span>📦</span> Minify
                    </button>
                    <button
                        onClick={handleValidate}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-xl shadow-lg font-bold flex flex-col items-center gap-2 min-w-[100px] transition-transform hover:scale-105"
                    >
                        <span>✅</span> Validate
                    </button>
                </div>

                {/* Output Pane */}
                <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-slate-300 font-semibold">Output</label>
                        <button onClick={copyOutput} disabled={!output} className="text-xs text-blue-400 hover:text-blue-300 underline disabled:opacity-50">Copy</button>
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        placeholder="Result will appear here..."
                        className="w-full flex-1 bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-sm text-blue-300 outline-none resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default JsonSwissKnife;
