
import React, { useState, useCallback, useEffect } from 'react';
import Button from './components/Button';
import './styles.css';

const MAX_HISTORY_ITEMS = 10;
const LOCAL_STORAGE_KEY_ITEMS = 'randomPickerItems';
const LOCAL_STORAGE_KEY_HISTORY = 'randomPickerHistory';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [isPicking, setIsPicking] = useState(false);
  const [history, setHistory] = useState([]);

  // Load items and history from localStorage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY_ITEMS);
    if (storedItems) {
      setInputValue(storedItems);
    }
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
        setHistory([]); // Reset history if parsing fails
      }
    }
  }, []);

  // Save items to localStorage whenever inputValue changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ITEMS, inputValue);
  }, [inputValue]);

  // Save history to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(history));
  }, [history]);

  const parseInputToList = useCallback((input) => {
    if (!input.trim()) return [];
    return input
      .split(/[\n,]+/)
      .map(item => item.trim())
      .filter(item => item !== "");
  }, []);

  const handlePickRandom = useCallback(() => {
    setError(null);
    const items = parseInputToList(inputValue);

    if (items.length === 0) {
      setError('Please enter some items to pick from.');
      setSelectedItem(null);
      return;
    }

    setIsPicking(true);
    setSelectedItem(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      const pickedItem = items[randomIndex];
      setSelectedItem(pickedItem);
      setHistory(prevHistory => {
        const newHistory = [pickedItem, ...prevHistory];
        return newHistory.slice(0, MAX_HISTORY_ITEMS);
      });
      setIsPicking(false);
    }, 1000);
  }, [inputValue, parseInputToList]);

  const handleClearInput = useCallback(() => {
    setInputValue('');
    setSelectedItem(null);
    setError(null);
    // Note: inputValue change will trigger useEffect to save to localStorage
  }, []);

  const handleResetSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    // Note: history change will trigger useEffect to save to localStorage
  }, []);

  return (
    <div className="header-margin min-h-screen text-gray-200 flex flex-col items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      <div className="bg-neutral-900/80 backdrop-blur-sm shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-xl space-y-8 border border-neutral-700/50">
        <header>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              Random Picker
            </span>
          </h1>
          <p className="text-center text-neutral-400 mt-3 text-sm sm:text-base">
            Enter items below (separated by commas or new lines).
          </p>
        </header>

        <section>
          <label htmlFor="itemInput" className="block text-sm font-medium text-neutral-300 mb-2">
            Your Items:
          </label>
          <textarea
            id="itemInput"
            rows={5}
            className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-neutral-500 text-gray-100 resize-y transition-colors duration-150"
            placeholder="e.g., Stardust, Nebula, Galaxy...&#10;or&#10;Alpha&#10;Beta&#10;Gamma"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="Enter items for random selection"
          />
        </section>

        <section className="space-y-4">
          <Button
            onClick={handlePickRandom}
            variant="primary"
            className="text-lg py-3.5"
            disabled={isPicking || inputValue.trim() === ''}
            title={inputValue.trim() === '' ? "Enter some items first" : (isPicking ? "Picking..." : "Pick a random item")}
          >
            {isPicking ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Picking...
              </div>
            ) : "✨ Pick Random Item"}
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleClearInput}
              variant="secondary"
              title="Clear the input list and current selection"
              disabled={inputValue === '' && selectedItem === null}
            >
              Clear Input
            </Button>
            <Button
              onClick={handleResetSelection}
              variant="secondary"
              title="Clear the current selection"
              disabled={selectedItem === null && !isPicking}
            >
              Reset Selection
            </Button>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 p-4 bg-red-900/50 border border-red-700/70 text-red-300 rounded-lg text-center text-sm"
          >
            {error}
          </div>
        )}

        <div className="mt-8 min-h-[100px] flex flex-col items-center justify-center">
          {isPicking && (
            <div className="text-center text-neutral-400">
              <p className="text-lg animate-pulse">Scanning the cosmos...</p>
            </div>
          )}
          {selectedItem && !isPicking && (
            <div className="w-full text-center animate-fade-in-up">
              <p className="text-neutral-400 mb-2 text-sm">The oracle has chosen:</p>
              <div
                className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-lg shadow-xl text-2xl sm:text-3xl font-bold break-all"
              >
                {selectedItem}
              </div>
            </div>
          )}
          {!selectedItem && !error && !isPicking && (
             <div className="text-center p-6 bg-neutral-800/60 rounded-lg w-full">
                <p className="text-neutral-400 text-lg">Your randomly selected item will materialize here!</p>
             </div>
          )}
        </div>

        {/* History Section */}
        <section className="mt-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-neutral-300">Pick History</h2>
            <Button
              onClick={handleClearHistory}
              variant="secondary"
              className="px-4 py-2 text-sm"
              disabled={history.length === 0}
              title={history.length === 0 ? "No history to clear" : "Clear pick history"}
            >
              Clear History
            </Button>
          </div>
          {history.length > 0 ? (
            <ul className="space-y-2 max-h-48 overflow-y-auto bg-neutral-800/60 p-4 rounded-lg border border-neutral-700/50">
              {history.map((item, index) => (
                <li 
                  key={index} 
                  className="p-2 bg-neutral-700/80 rounded-md text-neutral-200 text-sm break-all"
                  aria-label={`History item ${index + 1}: ${item}`}
                >
                  <span className="font-mono text-xs text-blue-400 mr-2">#{history.length - index}</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-4 bg-neutral-800/60 rounded-lg">
              <p className="text-neutral-400">No items picked yet. Your historical selections will appear here.</p>
            </div>
          )}
        </section>

      </div>
      <style>
        {`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default App;
