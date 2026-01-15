import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import MotivMateWidget from '../MotivMate/MotivMateWidget';

const COLUMNS = [
    { id: 'start', title: 'Start Doing', color: 'bg-green-600', icon: '🚀' },
    { id: 'stop', title: 'Stop Doing', color: 'bg-red-600', icon: '🛑' },
    { id: 'continue', title: 'Continue Doing', color: 'bg-blue-600', icon: '⭐' }
];

const App = () => {
    const [items, setItems] = useState(() => {
        // Load from local storage
        try {
            const saved = localStorage.getItem('retroItems');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    const [newItemText, setNewItemText] = useState('');
    const [activeColumn, setActiveColumn] = useState('start');

    useEffect(() => {
        localStorage.setItem('retroItems', JSON.stringify(items));
    }, [items]);

    const addItem = (e) => {
        e.preventDefault();
        if (!newItemText.trim()) return;

        setItems([...items, {
            id: Date.now(),
            column: activeColumn,
            text: newItemText.trim(),
            timestamp: new Date().toISOString()
        }]);
        setNewItemText('');
    };

    const deleteItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const clearBoard = () => {
        if (window.confirm("Clear all items?")) {
            setItems([]);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Retrospective Board", 20, 20);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);

        let y = 45;

        COLUMNS.forEach(col => {
            // Column Header
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text(`${col.icon} ${col.title}`, 20, y);
            y += 10;

            // Items
            doc.setFontSize(12);
            const colItems = items.filter(i => i.column === col.id);

            if (colItems.length === 0) {
                doc.setTextColor(150);
                doc.text("(No items)", 25, y);
                y += 10;
            } else {
                colItems.forEach(item => {
                    if (y > 280) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.setTextColor(0);
                    const splitText = doc.splitTextToSize(`• ${item.text}`, 170);
                    doc.text(splitText, 25, y);
                    y += (splitText.length * 7) + 3;
                });
            }
            y += 10; // Space between columns
        });

        doc.save(`retro-board-${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 content-start">
            <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-gray-900 bg-opacity-80 p-6 rounded-2xl backdrop-blur-md shadow-xl border border-gray-700">
                <div>
                    <h1 className="text-3xl font-bold text-white">Retro Board</h1>
                    <p className="text-slate-400 text-sm">Ephemeral & Private. Data stays in your browser.</p>
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <button
                        onClick={clearBoard}
                        className="px-4 py-2 text-red-400 hover:text-red-300 transition"
                    >
                        Clear Board
                    </button>
                    <button
                        onClick={downloadPDF}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all"
                    >
                        Download PDF
                    </button>
                </div>
            </header>

            {/* Input Area */}
            <div className="mb-8 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
                <form onSubmit={addItem} className="flex flex-col md:flex-row gap-4">
                    <select
                        value={activeColumn}
                        onChange={(e) => setActiveColumn(e.target.value)}
                        className="bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 outline-none focus:border-blue-500 min-w-[150px]"
                    >
                        {COLUMNS.map(col => (
                            <option key={col.id} value={col.id}>{col.icon} {col.title}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        placeholder="Type a thought..."
                        className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 px-8 py-3 rounded-lg text-white font-bold hover:bg-green-500 transition-colors shadow-lg"
                    >
                        Add
                    </button>
                </form>
            </div>

            {/* Board Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COLUMNS.map(col => (
                    <div key={col.id} className="bg-gray-800 bg-opacity-50 rounded-xl p-4 border border-gray-700 min-h-[400px]">
                        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${col.color.replace('bg-', 'text-')}`}>
                            <span className="text-2xl">{col.icon}</span> {col.title}
                        </h2>

                        <div className="space-y-3">
                            {items.filter(i => i.column === col.id).map(item => (
                                <div key={item.id} className="bg-gray-700 p-4 rounded-lg shadow group relative animate-fade-in hover:bg-gray-650 transition">
                                    <p className="text-slate-200 pr-6">{item.text}</p>
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            {items.filter(i => i.column === col.id).length === 0 && (
                                <div className="text-slate-600 text-center italic mt-10">
                                    Nothing here yet.
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <MotivMateWidget category="growth" position="bottom" />
        </div>
    );
};

export default App;
