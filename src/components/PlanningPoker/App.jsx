import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { db } from '../../services/firebase';
import { ref, onValue, set, update } from "firebase/database";
import MotivMateWidget from '../MotivMate/MotivMateWidget';

const FIBONACCI = ['1', '2', '3', '5', '8', '13', '21', '?', '☕'];

const PlanningPoker = () => {
    // --- STATE ---
    const [view, setView] = useState('join'); // 'join', 'poker'
    const [sessionId, setSessionId] = useState('');
    const [myUserId, setMyUserId] = useState('');
    const [myName, setMyName] = useState('');

    // Synced State
    const [taskName, setTaskName] = useState('');
    const [revealed, setRevealed] = useState(false);
    const [votes, setVotes] = useState({}); // { userId: { name, vote } }
    const [team, setTeam] = useState([]); // Derived from votes

    // --- FIREBASE LISTENERS ---
    useEffect(() => {
        if (view === 'poker' && sessionId) {
            const sessionRef = ref(db, `poker/sessions/${sessionId}`);

            const unsubscribe = onValue(sessionRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setTaskName(data.taskName || '');
                    setRevealed(data.revealed || false);
                    setVotes(data.votes || {});

                    // Transform votes object to team array for UI
                    if (data.votes) {
                        const members = Object.keys(data.votes).map(key => ({
                            id: key,
                            name: data.votes[key].name,
                            vote: data.votes[key].vote
                        }));
                        setTeam(members);
                    } else {
                        setTeam([]);
                    }
                } else {
                    // Session might have been deleted or doesn't exist
                    alert("Session not found!");
                    setView('join');
                }
            });

            return () => unsubscribe();
        }
    }, [view, sessionId]);

    // --- ACTIONS ---

    const handleJoin = (isCreating) => {
        if (!myName.trim()) {
            alert("Please enter your name.");
            return;
        }

        let sid = sessionId.trim();
        if (isCreating) {
            // Generate simple 4-char ID
            sid = Math.random().toString(36).substring(2, 6).toUpperCase();
            setSessionId(sid);
        } else if (!sid) {
            alert("Please enter a Session ID.");
            return;
        }

        // Generate a user ID (simple random)
        const uid = Date.now().toString() + Math.random().toString(36).substring(2, 5);
        setMyUserId(uid);

        // Initial write to join the session
        const updates = {};
        if (isCreating) {
            updates[`poker/sessions/${sid}/created`] = Date.now();
            updates[`poker/sessions/${sid}/revealed`] = false;
            updates[`poker/sessions/${sid}/taskName`] = "Task 1";
        }
        updates[`poker/sessions/${sid}/votes/${uid}`] = { name: myName, vote: null };

        update(ref(db), updates)
            .then(() => setView('poker'))
            .catch(err => alert("Error joining session: " + err.message));
    };

    const castVote = (value) => {
        if (revealed) return;
        set(ref(db, `poker/sessions/${sessionId}/votes/${myUserId}/vote`), value);
    };

    const toggleReveal = () => {
        update(ref(db, `poker/sessions/${sessionId}`), { revealed: !revealed });
    };

    const resetRound = () => {
        const updates = {};
        updates[`poker/sessions/${sessionId}/revealed`] = false;

        // Iterate over current votes and reset the 'vote' value to null
        Object.keys(votes).forEach(uid => {
            updates[`poker/sessions/${sessionId}/votes/${uid}/vote`] = null;
        });

        update(ref(db), updates);
    };

    const updateTaskName = (name) => {
        set(ref(db, `poker/sessions/${sessionId}/taskName`), name);
    };

    // --- PDF EXPORT ---
    const downloadSummary = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Planning Poker Results", 20, 20);
        doc.setFontSize(14);
        doc.text(`Task: ${taskName || 'Untitled Task'}`, 20, 35);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);

        let y = 60;
        let total = 0;
        let count = 0;

        team.forEach(member => {
            doc.text(`${member.name}: ${member.vote || '-'}`, 20, y);
            const num = parseFloat(member.vote);
            if (!isNaN(num)) { total += num; count++; }
            y += 10;
        });

        if (count > 0) doc.text(`Average: ${(total / count).toFixed(1)}`, 20, y + 10);
        doc.save(`poker-summary.pdf`);
    };

    // --- RENDER: JOIN SCREEN ---
    if (view === 'join') {
        return (
            <div className="card w-full max-w-md mx-auto bg-gray-900 bg-opacity-80 p-8 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                    Planning Poker
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-2">Display Name</label>
                        <input
                            value={myName} onChange={e => setMyName(e.target.value)}
                            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-600 text-white focus:outline-none focus:border-cyan-400"
                            placeholder="e.g., Alice"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                        <button
                            onClick={() => handleJoin(true)}
                            className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold hover:scale-105 transition-transform"
                        >
                            Create New
                        </button>
                        <div className="flex flex-col gap-2">
                            <input
                                value={sessionId} onChange={e => setSessionId(e.target.value.toUpperCase())}
                                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-600 text-center uppercase tracking-widest text-white"
                                placeholder="CODE"
                                maxLength={4}
                            />
                            <button
                                onClick={() => handleJoin(false)}
                                className="p-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER: POKER TABLE ---
    return (
        <div className="w-full max-w-5xl mx-auto p-4 content-start">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gray-900 bg-opacity-80 p-6 rounded-2xl backdrop-blur-md border border-gray-700">
                <div>
                    <span className="text-gray-400 text-sm uppercase tracking-wide">Session ID</span>
                    <div className="text-4xl font-mono font-bold text-cyan-400 tracking-widest">{sessionId}</div>
                </div>
                <div className="flex-1 mx-8 w-full">
                    <input
                        value={taskName}
                        onChange={(e) => updateTaskName(e.target.value)}
                        placeholder="Current Task: Enter title..."
                        className="w-full bg-transparent text-2xl font-bold text-center border-b border-gray-600 focus:border-cyan-500 focus:outline-none p-2"
                    />
                </div>
                <div className="flex gap-2">
                    <button onClick={resetRound} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Reset</button>
                    <button onClick={downloadSummary} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600">Export PDF</button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Voting Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Cards */}
                    <div className="bg-gray-900 bg-opacity-60 p-6 rounded-2xl border border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-cyan-300">Cast Your Vote</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {FIBONACCI.map(val => (
                                <button
                                    key={val}
                                    onClick={() => castVote(val)}
                                    disabled={revealed}
                                    className={`aspect-square rounded-xl text-2xl font-bold transition-all transform hover:scale-105 ${votes[myUserId]?.vote === val
                                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50 ring-2 ring-white'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        } ${revealed ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className="bg-gray-900 bg-opacity-60 p-6 rounded-2xl border border-gray-700 min-h-[300px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-blue-300">Team Votes ({team.length})</h3>
                            <button
                                onClick={toggleReveal}
                                className={`px-6 py-2 rounded-full font-bold transition-all ${revealed
                                        ? 'bg-gray-600 text-gray-300'
                                        : 'bg-gradient-to-r from-pink-500 to-orange-400 hover:shadow-lg hover:shadow-orange-500/30'
                                    }`}
                            >
                                {revealed ? 'Hide Votes' : 'Reveal Votes'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {team.map(member => (
                                <div key={member.id} className="bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center border border-gray-700 relative overflow-hidden">
                                    <div className="font-semibold text-lg mb-2">{member.name}</div>
                                    {revealed ? (
                                        <div className="text-3xl font-bold text-cyan-400 animate-in zoom-in">{member.vote || '-'}</div>
                                    ) : (
                                        <div className={`text-3xl transition-all ${member.vote ? 'text-green-500 scale-110' : 'text-gray-600'}`}>
                                            {member.vote ? '✓' : '...'}
                                        </div>
                                    )}
                                    {member.id === myUserId && <div className="absolute top-1 right-2 text-xs text-gray-500">(You)</div>}
                                </div>
                            ))}
                        </div>

                        {/* Statistics */}
                        {revealed && (
                            <div className="mt-6 pt-4 border-t border-gray-700 flex justify-center gap-8">
                                <div className="text-center">
                                    <div className="text-gray-400 text-sm">Average</div>
                                    <div className="text-2xl font-bold text-white">
                                        {(team.reduce((acc, m) => acc + (parseFloat(m.vote) || 0), 0) / team.filter(m => !isNaN(parseFloat(m.vote))).length || 0).toFixed(1)}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-gray-400 text-sm">Agreement</div>
                                    {(() => {
                                        const validVotes = team.map(m => m.vote).filter(v => v !== null && v !== '?' && v !== '☕');
                                        const unique = new Set(validVotes);
                                        return unique.size === 1 && validVotes.length > 0
                                            ? <div className="text-2xl font-bold text-green-400">Perfect! 🎯</div>
                                            : <div className="text-2xl font-bold text-yellow-400">{unique.size > 1 ? 'Diverse' : '-'}</div>
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <MotivMateWidget category="collaboration" />

                    <div className="bg-blue-900 bg-opacity-20 p-4 rounded-xl border border-blue-500/30">
                        <h4 className="font-bold text-blue-300 mb-2">💡 Tips</h4>
                        <ul className="text-sm text-gray-300 space-y-2 list-disc pl-4">
                            <li>Share the Session ID <strong>{sessionId}</strong> with your team.</li>
                            <li>Votes are hidden until you click Reveal.</li>
                            <li>Use ☕ for a break request.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanningPoker;
