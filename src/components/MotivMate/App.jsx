import React, { useState, useEffect, useCallback } from 'react';
import { AffirmationCard } from './components/AffirmationCard';
import { Button } from './components/Button';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ShareButton } from './components/ShareButton';
import { getLocalAffirmationAndImage } from './services/contentService';

const App = () => {
  const [currentContent, setCurrentContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); 
      const newContent = getLocalAffirmationAndImage();
      
      setCurrentContent(newContent);
      if (!newContent || (newContent.text.includes("data is shy") || newContent.text.includes("journey, for every step"))) { 
        // Optionally, you could set a soft error if it's a fallback from contentService itself
      }

    } catch (err) {
      console.error("Error fetching local content in App:", err);
      setError("An unexpected error occurred while loading inspiration.");
      setCurrentContent({ 
        text: "Even in challenges, strength and resilience bloom. You are capable.",
        imageUrl: "https://picsum.photos/seed/appfallback/600/400"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewContent();
  }, [fetchNewContent]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans text-slate-100">
      <header className="text-center mb-8">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white">
          MotivMate
        </h1>
        <p className="text-lg text-slate-300 mt-2">Your daily dose of inspiration.</p>
      </header>

      <main className="w-full max-w-2xl">
        {isLoading && <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>}
        {error && !isLoading && (
          <div className="bg-red-700 bg-opacity-50 text-white p-6 rounded-xl shadow-2xl text-center my-6">
            <h2 className="text-2xl font-semibold mb-2">Oops! Something went wrong.</h2>
            <p>{error}</p>
          </div>
        )}
        {!isLoading && !error && currentContent && (
          <AffirmationCard
            text={currentContent.text}
            imageUrl={currentContent.imageUrl}
          />
        )}
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button onClick={fetchNewContent} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Inspiring...' : 'Get New Inspiration'}
          </Button>
          {currentContent && !isLoading && <ShareButton textToCopy={currentContent.text} />}
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-400 text-sm">
        <p>&copy; 2025 KaizenLabs. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;