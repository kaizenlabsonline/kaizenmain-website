import React, { useState } from 'react';
import SpinnerWheel from './SpinnerWheel';

const App = () => {
    const [options, setOptions] = useState(['Pizza', 'Burgers', 'Sushi', 'Salad', 'Tacos']);
    const [newOption, setNewOption] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState(null);
    const [spinTrigger, setSpinTrigger] = useState(0); // Counter to trigger effects

    const handleAdd = (e) => {
        e.preventDefault();
        if (newOption.trim()) {
            setOptions([...options, newOption.trim()]);
            setNewOption('');
        }
    };

    const handleRemove = (index) => {
        setOptions(options.filter((_, i) => i !== index));
    };

    const spin = () => {
        if (options.length < 2) return;
        setIsSpinning(true);
        setWinner(null);
        setSpinTrigger(prev => prev + 1);
    };

    const onFinished = (result) => {
        setIsSpinning(false);
        setWinner(result);
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center p-4 max-w-6xl mx-auto w-full">
            {/* Left: Spinner */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 p-8 rounded-2xl shadow-2xl backdrop-blur-sm w-full">
                <h2 className="text-3xl font-bold text-white mb-6">Decision Spinner</h2>

                <div className="relative mb-8">
                    <SpinnerWheel
                        options={options}
                        isSpinning={isSpinning}
                        spinTrigger={spinTrigger}
                        onFinished={onFinished}
                    />
                    {/* Winner Overlay */}
                    {winner && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 px-6 py-3 rounded-xl shadow-xl border-4 border-yellow-400 animate-bounce">
                            <p className="text-sm font-bold uppercase text-slate-500">Winner</p>
                            <p className="text-3xl font-extrabold">{winner}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={spin}
                    disabled={isSpinning || options.length < 2}
                    className="w-full max-w-xs py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold text-xl rounded-full shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSpinning ? 'Spinning...' : 'SPIN!'}
                </button>
            </div>

            {/* Right: Controls */}
            <div className="w-full md:w-96 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Options</h3>

                <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        placeholder="Add option..."
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition"
                    >
                        +
                    </button>
                </form>

                <ul className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {options.map((opt, i) => (
                        <li key={i} className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-lg group hover:bg-gray-600 transition">
                            <span className="text-gray-200">{opt}</span>
                            <button
                                onClick={() => handleRemove(i)}
                                className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                                title="Remove"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 text-xs text-gray-400 text-center">
                    add at least 2 options to spin
                </div>
            </div>
        </div>
    );
};

export default App;
