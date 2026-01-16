import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { db } from '../../services/firebase';
import { ref, onValue, set, update } from "firebase/database";
import MotivMateWidget from '../MotivMate/MotivMateWidget';

const COLUMNS = [
    { id: 'start', title: 'Start Doing', color: 'bg-green-600', icon: '🚀' },
    { id: 'stop', title: 'Stop Doing', color: 'bg-red-600', icon: '🛑' },
    { id: 'continue', title: 'Continue Doing', color: 'bg-blue-600', icon: '⭐' }
];

const RetroBoard = () => {
    // --- STATE ---
    const [view, setView] = useState('join'); // 'join', 'board'
    const [boardId, setBoardId] = useState('');

    const [items, setItems] = useState([]);
    const [newItemText, setNewItemText] = useState('');
    const [activeColumn, setActiveColumn] = useState('start');

    // --- FIREBASE LISTENERS ---
    useEffect(() => {
        if (view === 'board' && boardId) {
            const boardRef = ref(db, `retro/boards/${boardId}/items`);
            const unsubscribe = onValue(boardRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    if (Array.isArray(data)) {
                        setItems(data.filter(Boolean)); // Remove nulls
                    } else {
                        setItems(Object.values(data));
                    }
                } else {
                    setItems([]);
                }
            });
            return () => unsubscribe();
        }
    }, [view, boardId]);

    // --- ACTIONS ---
    const handleJoin = (isCreating) => {
        let bid = boardId.trim();
        if (isCreating) {
            bid = Math.random().toString(36).substring(2, 6).toUpperCase();
            setBoardId(bid);
            // Create board meta
            set(ref(db, `retro/boards/${bid}/created`), Date.now())
                .then(() => setView('board'));
        } else {
            if (!bid) return alert("Enter Board ID");
            setView('board');
        }
    };

    const addItem = (e) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        const newItem = {
            id: Date.now(),
            column: activeColumn,
            text: newItemText.trim(),
            timestamp: new Date().toISOString()
        };

        const updatedItems = [...items, newItem];
        // Optimistic update
        setItems(updatedItems);
        setNewItemText('');

        // Sync (Overwriting the list is simplest for this scale)
        set(ref(db, `retro/boards/${boardId}/items`), updatedItems);
    };

    const deleteItem = (id) => {
        if (!window.confirm("Delete this card?")) return;
        const updatedItems = items.filter(i => i.id !== id);
        setItems(updatedItems);
        set(ref(db, `retro/boards/${boardId}/items`), updatedItems);
    };

    const clearBoard = () => {
        if (window.confirm("Clear all items?")) {
            set(ref(db, `retro/boards/${boardId}/items`), []);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Retrospective Board", 20, 20);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Board ID: ${boardId}`, 20, 40);

        let y = 55;

        COLUMNS.forEach(col => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(`${col.icon} ${col.title}`, 20, y);
            y += 10;

            doc.setFontSize(12);
            const colItems = items.filter(i => i.column === col.id);

            if (colItems.length === 0) {
                doc.setTextColor(150);
                doc.text("(No items)", 25, y);
                y += 10;
            } else {
                colItems.forEach(item => {
                    if (y > 280) { doc.addPage(); y = 20; }
                    doc.setTextColor(0);
                    const splitText = doc.splitTextToSize(`• ${item.text}`, 170);
                    doc.text(splitText, 25, y);
                    y += (splitText.length * 7) + 3;
                });
            }
            y += 10;
        });

        doc.save(`retro-${boardId}.pdf`);
    };

    // --- RENDER: JOIN ---
    if (view === 'join') {
        return (
            <div className="card w-full max-w-md mx-auto bg-gray-900 bg-opacity-80 p-8 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                    Retro Board
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button
                            onClick={() => handleJoin(true)}
                            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold hover:scale-105 transition-transform"
                        >
                            Create New
                        </button>
                        <div className="flex flex-col gap-2">
                            <input
                                value={boardId} onChange={e => setBoardId(e.target.value.toUpperCase())}
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

    // --- RENDER: BOARD ---
    return (
        <div className="w-full max-w-6xl mx-auto p-4 content-start">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gray-900 bg-opacity-80 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-gray-700">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                        Retro Board
                    </h2>
                    <span className="text-gray-400 text-sm uppercase tracking-wide">ID: <span className="text-white font-mono text-lg">{boardId}</span></span>
                </div>
                <div className="flex gap-3">
                    <button onClick={clearBoard} className="px-4 py-2 bg-red-900/50 text-red-200 rounded-lg hover:bg-red-900/70 border border-red-800">
                        Clear All
                    </button>
                    <button onClick={downloadPDF} className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 border border-gray-600">
                        Export PDF
                    </button>
                </div>
            </header>

            {/* Input Area */}
            <div className="mb-8 bg-gray-800 bg-opacity-60 p-6 rounded-xl border border-gray-700">
                <form onSubmit={addItem} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            placeholder="Type your thought here..."
                            className="w-full p-3 bg-gray-900 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none text-white"
                        />
                    </div>
                    <select
                        value={activeColumn}
                        onChange={(e) => setActiveColumn(e.target.value)}
                        className="p-3 bg-gray-900 rounded-lg border border-gray-600 text-white focus:outline-none"
                    >
                        {COLUMNS.map(col => (
                            <option key={col.id} value={col.id}>{col.icon} {col.title}</option>
                        ))}
                    </select>
                    <button type="submit" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold transition-colors">
                        Add Card
                    </button>
                </form>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COLUMNS.map(col => (
                    <div key={col.id} className="bg-gray-900 bg-opacity-40 p-4 rounded-xl border border-gray-800 flex flex-col h-full min-h-[400px]">
                        <div className={`p-3 rounded-lg mb-4 ${col.color} bg-opacity-90 shadow-lg flex items-center gap-2`}>
                            <span className="text-2xl">{col.icon}</span>
                            <h3 className="font-bold text-lg">{col.title}</h3>
                        </div>

                        <div className="flex-1 space-y-3">
                            {items.filter(i => i.column === col.id).map(item => (
                                <div key={item.id} className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 group relative hover:border-gray-500 transition-colors">
                                    <p className="whitespace-pre-wrap">{item.text}</p>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <MotivMateWidget category="growth" />
            </div>
        </div>
    );
};

export default RetroBoard;
