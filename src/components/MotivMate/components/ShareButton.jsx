import React, { useState } from 'react';

export const ShareButton = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. You might need to enable clipboard permissions for this site.');
      }
    } else if (navigator.share) { 
        try {
            await navigator.share({
                title: 'MotivMate Affirmation',
                text: textToCopy,
            });
            setCopied(true); 
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error sharing: ', err);
            if (err.name !== 'AbortError') {
                alert('Could not share content.');
            }
        }
    }
     else {
      alert('Sharing is not supported on your browser, or you are not in a secure context (HTTPS). Try copying the text manually.');
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`
        px-6 py-3 text-lg font-semibold rounded-lg shadow-md
        border-2 border-sky-500 text-sky-300
        hover:bg-sky-500 hover:text-white
        focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50
        transition-all duration-200 ease-in-out
        transform hover:scale-105
        w-full sm:w-auto
      `}
      title="Copy affirmation to clipboard or share"
    >
      {copied ? 'Copied!' : 'Share'}
    </button>
  );
};