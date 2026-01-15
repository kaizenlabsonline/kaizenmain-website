import React, { useState, useEffect, useRef } from 'react';
import MotivMateWidget from '../MotivMate/MotivMateWidget';

const App = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('work'); // 'work' | 'break' | 'longBreak'
    const [task, setTask] = useState('');

    // Audio Context for Beep (Browser Native - No External File)
    const audioCtx = useRef(null);

    const playBeep = () => {
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const osc = audioCtx.current.createOscillator();
        const gain = audioCtx.current.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.current.destination);
        osc.frequency.value = 800;
        gain.gain.value = 0.1;
        osc.start();
        setTimeout(() => {
            osc.stop();
            // Second beep
            setTimeout(() => {
                const osc2 = audioCtx.current.createOscillator();
                const gain2 = audioCtx.current.createGain();
                osc2.connect(gain2);
                gain2.connect(audioCtx.current.destination);
                osc2.frequency.value = 1000;
                gain2.gain.value = 0.1;
                osc2.start();
                setTimeout(() => osc2.stop(), 200);
            }, 300);
        }, 200);
    };

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            playBeep();
            if (Notification.permission === 'granted') {
                new Notification("Time's up!");
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'work') setTimeLeft(25 * 60);
        if (mode === 'break') setTimeLeft(5 * 60);
        if (mode === 'longBreak') setTimeLeft(15 * 60);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'work') setTimeLeft(25 * 60);
        if (newMode === 'break') setTimeLeft(5 * 60);
        if (newMode === 'longBreak') setTimeLeft(15 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Calculate progress for circle (circumference = 2 * PI * r)
    // r=120, C=753.98
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const totalTime = mode === 'work' ? 25 * 60 : (mode === 'break' ? 5 * 60 : 15 * 60);
    const progress = (timeLeft / totalTime) * circumference;
    const strokeDashoffset = circumference - progress;

    return (
        <div className="w-full max-w-xl mx-auto p-4 flex flex-col items-center">
            <header className="mb-8 text-center bg-gray-900 bg-opacity-80 p-6 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-md w-full">
                <h1 className="text-3xl font-bold text-white mb-2">🔥 Pomodoro Focus</h1>
                <p className="text-slate-400">Stay in the zone. 25 minutes at a time.</p>
            </header>

            <div className="bg-gray-800 bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-gray-700 w-full flex flex-col items-center">
                {/* Mode Switcher */}
                <div className="flex bg-gray-900 rounded-full p-1 mb-8">
                    <button
                        onClick={() => switchMode('work')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${mode === 'work' ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Focus
                    </button>
                    <button
                        onClick={() => switchMode('break')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${mode === 'break' ? 'bg-green-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Short Break
                    </button>
                    <button
                        onClick={() => switchMode('longBreak')}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${mode === 'longBreak' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Long Break
                    </button>
                </div>

                {/* SVG Timer */}
                <div className="relative mb-8">
                    <svg className="w-80 h-80 transform -rotate-90">
                        {/* Background Ring */}
                        <circle
                            cx="160" cy="160" r={radius}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                            fill="transparent"
                        />
                        {/* Progress Ring */}
                        <circle
                            cx="160" cy="160" r={radius}
                            stroke={mode === 'work' ? '#ef4444' : (mode === 'break' ? '#22c55e' : '#3b82f6')}
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-7xl font-bold text-white font-mono tracking-tighter shadow-black drop-shadow-lg">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-slate-400 mt-2 uppercase tracking-widest text-xs font-bold">
                            {isActive ? 'RUNNING' : 'PAUSED'}
                        </span>
                    </div>
                </div>

                {/* Task Input */}
                <div className="w-full mb-8">
                    <input
                        type="text"
                        placeholder="What are you working on?"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        className="w-full bg-transparent border-b border-gray-600 text-center text-xl text-white outline-none focus:border-white pb-2 transition-colors placeholder-gray-600"
                    />
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={toggleTimer}
                        className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl transition-transform hover:scale-105 active:scale-95 ${isActive ? 'bg-gray-700 text-red-400 border-2 border-red-500' : 'bg-white text-gray-900'}`}
                    >
                        {isActive ? '⏸' : '▶'}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="w-16 h-16 rounded-full flex items-center justify-center text-xl bg-gray-700 text-slate-300 hover:bg-gray-600 shadow-lg transition-transform hover:scale-105 active:scale-95 absolute right-12 bottom-12"
                        title="Reset"
                    >
                        ↺
                    </button>
                </div>
            </div>

            <MotivMateWidget
                category={mode === 'work' ? 'focus' : 'rest'}
                position="inline"
            />
        </div>
    );
};

export default App;
