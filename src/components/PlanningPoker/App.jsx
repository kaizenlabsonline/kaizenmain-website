import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import MotivMateWidget from '../MotivMate/MotivMateWidget';

const FIBONACCI = ['1', '2', '3', '5', '8', '13', '21', '?', '☕'];

const PlanningPoker = () => {
    const [phase, setPhase] = useState('setup'); // setup, voting, revealed
    const [taskName, setTaskName] = useState('');
    const [newMember, setNewMember] = useState('');
    const [team, setTeam] = useState([]);
    const [activeVoterIndex, setActiveVoterIndex] = useState(null);

    // --- SETUP HANDLERS ---
    const addMember = (e) => {
        e.preventDefault();
        if (newMember.trim()) {
            setTeam([...team, { name: newMember.trim(), vote: null }]);
            setNewMember('');
        }
    };

    const removeMember = (index) => {
        setTeam(team.filter((_, i) => i !== index));
    };

    const startSession = () => {
        if (team.length === 0) return alert("Add at least one team member!");
        setPhase('voting');
    };

    // --- VOTING HANDLERS ---
    const selectVoter = (index) => {
        if (phase === 'revealed') return;
        setActiveVoterIndex(index);
    };

    const castVote = (value) => {
        const updatedTeam = [...team];
        updatedTeam[activeVoterIndex].vote = value;
        setTeam(updatedTeam);
        setActiveVoterIndex(null);
    };

    const revealVotes = () => {
        setPhase('revealed');
    };

    const resetRound = () => {
        const resetTeam = team.map(m => ({ ...m, vote: null }));
        setTeam(resetTeam);
        setPhase('voting');
        // Keep task name? maybe clear it or keep it for next round iteration.
        // Let's keep it but optional to change.
    };

    const newSession = () => {
        if (window.confirm("End session? All names will be cleared.")) {
            setTeam([]);
            setTaskName('');
            setPhase('setup');
        }
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
        doc.setFontSize(12);
        doc.text("Member", 20, y);
        doc.text("Vote", 120, y);
        doc.line(20, y + 2, 190, y + 2);
        y += 10;

        let total = 0;
        let count = 0;

        team.forEach(member => {
            doc.text(member.name, 20, y);
            const vote = member.vote || '-';
            doc.text(vote, 120, y);

            const num = parseFloat(vote);
            if (!isNaN(num)) {
                total += num;
                count++;
            }
            y += 10;
        });

        if (count > 0) {
            y += 5;
            doc.line(20, y, 190, y);
            y += 10;
            doc.setFont("helvetica", "bold");
            doc.text(`Average: ${(total / count).toFixed(1)}`, 20, y);
        }

        doc.save(`poker-${taskName.replace(/\s+/g, '-') || 'session'}.pdf`);
    };

    // --- COMPUTED ---
    const average = (() => {
        let total = 0;
        let count = 0;
        team.forEach(m => {
            const val = parseFloat(m.vote);
            if (!isNaN(val)) {
                total += val;
                count++;
            }
        });
        return count ? (total / count).toFixed(1) : null;
    })();

    // --- RENDER ---
    return (
        <div className="w-full max-w-4xl mx-auto p-4 font-sans text-slate-100">
            {/* Header / Nav */}
            <div className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400">✨ Planning Poker</h1>
                    {taskName && <p className="text-slate-400 text-sm">Active Task: <span className="text-white">{taskName}</span></p>}
                </div>
                {phase !== 'setup' && (
                    <button onClick={newSession} className="text-xs text-red-400 hover:text-red-300 underline">
                        Exit Session
                    </button>
                )}
            </div>

            {/* SETUP PHASE */}
            {phase === 'setup' && (
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 max-w-lg mx-auto">
                    <h2 className="text-xl font-bold mb-6 text-white text-center">Setup Session</h2>

                    <div className="mb-6">
                        <label className="block text-slate-400 text-sm mb-2">Task / Story Name (Optional)</label>
                        <input
                            type="text"
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. KZN-123 Homepage Redesign"
                            value={taskName}
                            onChange={e => setTaskName(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-slate-400 text-sm mb-2">Add Team Members</label>
                        <form onSubmit={addMember} className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none"
                                placeholder="Name"
                                value={newMember}
                                onChange={e => setNewMember(e.target.value)}
                            />
                            <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg text-white font-bold hover:bg-blue-500">+</button>
                        </form>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {team.length === 0 && <span className="text-slate-600 text-sm italic">No members yet.</span>}
                            {team.map((m, i) => (
                                <span key={i} className="bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                    {m.name}
                                    <button onClick={() => removeMember(i)} className="text-gray-400 hover:text-red-400">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={startSession}
                        disabled={team.length === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-xl font-bold text-white shadow-lg hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start Voting
                    </button>
                </div>
            )}

            {/* VOTING & REVEAL PHASE */}
            {(phase === 'voting' || phase === 'revealed') && (
                <div>
                    {/* Control Bar */}
                    <div className="flex justify-between mb-6">
                        <h2 className="text-xl text-slate-300">
                            {phase === 'voting' ? "🗳 Voting in progress..." : "📊 Results"}
                        </h2>
                        <div className="flex gap-3">
                            {phase === 'voting' && (
                                <button onClick={revealVotes} className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">
                                    Recall / Reveal
                                </button>
                            )}
                            {phase === 'revealed' && (
                                <>
                                    <button onClick={downloadSummary} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors">
                                        Download PDF
                                    </button>
                                    <button onClick={resetRound} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">
                                        Next Round →
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                        {team.map((member, i) => (
                            <div
                                key={i}
                                onClick={() => selectVoter(i)}
                                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105
                                    ${member.vote ? 'bg-blue-900 border-blue-400 shadow-blue-500/20' : 'bg-gray-800 border-dashed border-gray-600 hover:bg-gray-750'}
                                    ${phase === 'revealed' ? 'bg-white border-white text-slate-900' : ''}
                                `}
                            >
                                <div className="text-center">
                                    <h3 className={`font-bold truncate mb-2 ${phase === 'revealed' ? 'text-slate-900' : 'text-white'}`}>{member.name}</h3>

                                    {/* Hidden State */}
                                    {phase === 'voting' && (
                                        <div className="mt-4">
                                            {member.vote ? (
                                                <span className="text-4xl">✅</span>
                                            ) : (
                                                <span className="text-4xl opacity-20">🂠</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Revealed State */}
                                    {phase === 'revealed' && (
                                        <div className="mt-2 text-5xl font-extrabold text-blue-600">
                                            {member.vote || '-'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    {phase === 'revealed' && average && (
                        <div className="bg-blue-900 bg-opacity-30 border border-blue-500/30 p-6 rounded-xl text-center mb-8 animate-fade-in">
                            <p className="text-blue-300 text-sm uppercase tracking-wider font-bold">Team Average</p>
                            <p className="text-6xl font-bold text-white mt-2">{average}</p>
                        </div>
                    )}
                </div>
            )}

            {/* SELECTION MODAL */}
            {activeVoterIndex !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setActiveVoterIndex(null)}>
                    <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl max-w-2xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-white mb-6 text-center">
                            Select vote for <span className="text-blue-400">{team[activeVoterIndex]?.name}</span>
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                            {FIBONACCI.map(val => (
                                <button
                                    key={val}
                                    onClick={() => castVote(val)}
                                    className="aspect-[3/4] bg-white text-slate-900 rounded-lg text-3xl font-bold hover:bg-blue-100 hover:scale-105 transition-all shadow-xl"
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setActiveVoterIndex(null)}
                            className="mt-8 w-full py-3 text-slate-400 hover:text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <MotivMateWidget category="collaboration" position="bottom" />
        </div>
    );
};

export default PlanningPoker;
