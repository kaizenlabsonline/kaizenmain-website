
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FileDropzone } from './components/FileDropzone';
import { FileList } from './components/FileList';
import { generatePdfFromImages } from './services/pdfService';

const MAX_FILES = 20;
const SCREENSHOT_INTERVAL_S = 10;

const FileProcessingStatus = {
  PENDING: 'Pending',
  UPLOADING: 'Uploading', // Optional if we differentiate upload from selection
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  ERROR: 'Error',
  CANCELLED: 'Cancelled',
};

// Helper: SVG Icons
const LoadingSpinner = ({ className = "w-5 h-5" }) => (
  <svg className={`animate-spin -ml-1 mr-3 ${className} text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Helper function to extract numerical parts from a filename
const extractNumberParts = (fileName) => {
  const match = fileName.match(/^(\d+(?:\.\d+)*)/); // Matches "1", "1.2", "01.002.3", etc. at the start
  if (match && match[1]) {
    return match[1].split('.').map(Number);
  }
  return null;
};

// Comparison function for sorting ProcessableFile objects
const compareProcessableFiles = (a, b) => {
  const numPartsA = extractNumberParts(a.file.name);
  const numPartsB = extractNumberParts(b.file.name);

  if (numPartsA && numPartsB) { // Both files have leading numbers
    const len = Math.min(numPartsA.length, numPartsB.length);
    for (let i = 0; i < len; i++) {
      if (numPartsA[i] < numPartsB[i]) return -1;
      if (numPartsA[i] > numPartsB[i]) return 1;
    }
    // If one is a prefix of the other (e.g., "1.2" vs "1.2.3"), the shorter one comes first
    return numPartsA.length - numPartsB.length;
  } else if (numPartsA) {
    return -1; // File A is numbered, File B is not; A comes first
  } else if (numPartsB) {
    return 1;  // File B is numbered, File A is not; B comes first
  }
  return 0; // Neither file is numbered; maintain original relative order (relies on stable sort)
};


const App = () => {
  const [processableFiles, setProcessableFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0); // 0-100
  const [currentTaskMessage, setCurrentTaskMessage] = useState("");

  const isConvertingRef = useRef(isConverting);
  useEffect(() => {
    isConvertingRef.current = isConverting;
  }, [isConverting]);

  const handleFilesSelected = useCallback((files) => {
    if (isConvertingRef.current) return;

    const newProcessableFiles = files
      .filter(file => file.type.startsWith('video/mp4'))
      .slice(0, MAX_FILES - processableFiles.length)
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        status: FileProcessingStatus.PENDING,
        screenshotsTaken: 0,
      }));

    if (files.length > newProcessableFiles.length && processableFiles.length + newProcessableFiles.length >= MAX_FILES) {
      alert(`You can select up to ${MAX_FILES} files in total. Some files were not added.`);
    } else if (files.some(file => !file.type.startsWith('video/mp4'))) {
      alert('Only MP4 files are accepted. Non-MP4 files were ignored.');
    }
    
    setProcessableFiles(prev => [...prev, ...newProcessableFiles]);
    setPdfUrl(null);
  }, [processableFiles.length]);

  const updateFileStatus = (id, status, error, screenshotsTaken, totalFramesToCapture) => {
    setProcessableFiles(prev =>
      prev.map(f =>
        f.id === id
          ? { ...f, status, error, screenshotsTaken: screenshotsTaken !== undefined ? screenshotsTaken : f.screenshotsTaken, totalFramesToCapture: totalFramesToCapture !== undefined ? totalFramesToCapture : f.totalFramesToCapture }
          : f
      )
    );
  };

  const captureFrame = useCallback((video, time) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            reject(new Error("Video dimensions are zero, cannot capture frame."));
            return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };

      const onError = (e) => {
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
        reject(new Error(`Video seeking/loading error: ${typeof e === 'string' ? e : (e.type || 'unknown error')}`));
      };
      
      video.addEventListener('seeked', onSeeked);
      video.addEventListener('error', onError);
      
      video.currentTime = time;
    });
  }, []);

  const processSingleVideo = useCallback(async (processableFile) => {
    const { file, id } = processableFile;
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      if (!isConvertingRef.current) {
        updateFileStatus(id, FileProcessingStatus.CANCELLED, "Conversion cancelled before start.");
        reject(new Error("Conversion cancelled before start."));
        return;
      }
      
      setCurrentTaskMessage(`Processing ${file.name}...`);
      const video = document.createElement('video');
      video.preload = 'auto';
      const screenshots = [];
      let capturedCount = 0;

      const cleanupVideo = () => {
        URL.revokeObjectURL(video.src);
        video.onloadedmetadata = null;
        video.onerror = null;
      };

      video.onloadedmetadata = async () => {
        try {
          const duration = video.duration;
          if (isNaN(duration) || duration === Infinity || duration <= 0) {
            cleanupVideo();
            reject(new Error(`Invalid video duration for ${file.name}. Duration: ${duration}`));
            return;
          }
          
          const totalFrames = Math.floor(duration / SCREENSHOT_INTERVAL_S) + (duration > 0 ? 1 : 0);
          updateFileStatus(id, FileProcessingStatus.PROCESSING, undefined, 0, totalFrames);

          if (!isConvertingRef.current) {
            cleanupVideo();
            updateFileStatus(id, FileProcessingStatus.CANCELLED, "Conversion cancelled during metadata load.");
            reject(new Error("Cancelled during metadata load"));
            return;
          }

          if (duration > 0) {
            // Capture frame at t=0 (start)
            const frameDataUrlStart = await captureFrame(video, 0);
            screenshots.push(frameDataUrlStart);
            capturedCount++;
            updateFileStatus(id, FileProcessingStatus.PROCESSING, undefined, capturedCount, totalFrames);
            await new Promise(r => setTimeout(r, 50)); 
          }
          
          // Capture frames at SCREENSHOT_INTERVAL_S
          for (let time = SCREENSHOT_INTERVAL_S; time < duration; time += SCREENSHOT_INTERVAL_S) {
            if (!isConvertingRef.current) {
              cleanupVideo();
              updateFileStatus(id, FileProcessingStatus.CANCELLED, "Conversion cancelled during frame capture.");
              reject(new Error("Cancelled during frame capture loop"));
              return;
            }
            const frameDataUrl = await captureFrame(video, time);
            screenshots.push(frameDataUrl);
            capturedCount++;
            updateFileStatus(id, FileProcessingStatus.PROCESSING, undefined, capturedCount, totalFrames);
            await new Promise(r => setTimeout(r, 50));
          }
          
          cleanupVideo();
          resolve(screenshots);
        } catch (err) {
          cleanupVideo();
           if (!isConvertingRef.current && err && err.message && err.message.toLowerCase().includes("cancel")) {
             // Already handled by cancellation checks
           } else {
             updateFileStatus(id, FileProcessingStatus.ERROR, (err && err.message) || "Error during video processing.");
           }
          reject(err);
        }
      };

      video.onerror = (e) => {
        cleanupVideo();
        let errorMsg = `Error loading video ${file.name}. Code: ${video.error?.code}, Message: ${video.error?.message}`;
        updateFileStatus(id, FileProcessingStatus.ERROR, errorMsg);
        reject(new Error(errorMsg));
      };
      
      video.src = URL.createObjectURL(file);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleStartConversion = async () => {
    let filesToProcess = processableFiles.filter(f => f.status === FileProcessingStatus.PENDING || f.status === FileProcessingStatus.ERROR);
    if (filesToProcess.length === 0) {
      alert("No new files to process. Please add MP4 files.");
      return;
    }
    if (isConvertingRef.current) {
        alert("Conversion is already in progress.");
        return;
    }

    // Sort files based on the new comparison logic
    filesToProcess.sort(compareProcessableFiles);

    isConvertingRef.current = true;
    setIsConverting(true);

    setPdfUrl(null);
    setOverallProgress(0);
    setCurrentTaskMessage("Starting conversion...");

    let allCollectedScreenshots = [];
    let totalFiles = filesToProcess.length;
    let filesProcessedCount = 0;

    for (const pFile of filesToProcess) {
      if (!isConvertingRef.current) {
        const currentFile = processableFiles.find(f => f.id === pFile.id);
        if (currentFile && currentFile.status !== FileProcessingStatus.CANCELLED) {
            updateFileStatus(pFile.id, FileProcessingStatus.CANCELLED, "Conversion stopped.");
        }
        setCurrentTaskMessage("Conversion cancelled.");
        break; 
      }
      updateFileStatus(pFile.id, FileProcessingStatus.PROCESSING);
      try {
        const videoScreenshots = await processSingleVideo(pFile);
        allCollectedScreenshots.push(...videoScreenshots);
        if (isConvertingRef.current) {
             updateFileStatus(pFile.id, FileProcessingStatus.COMPLETED, undefined, videoScreenshots.length);
        }
      } catch (error) {
        console.error(`Error processing file ${pFile.file.name}:`, error);
        if (!error.message?.toLowerCase().includes("cancel")) {
          updateFileStatus(pFile.id, FileProcessingStatus.ERROR, error.message || 'Unknown processing error');
        }
      }
      filesProcessedCount++;
      if (isConvertingRef.current) {
        setOverallProgress(Math.round((filesProcessedCount / totalFiles) * 100));
      }
    }

    if (!isConvertingRef.current) { 
      // Message already set to "Conversion cancelled."
    } else if (allCollectedScreenshots.length > 0) {
      setCurrentTaskMessage("Generating PDF...");
      try {
        const generatedPdfUrl = await generatePdfFromImages(allCollectedScreenshots);
        setPdfUrl(generatedPdfUrl);
        setCurrentTaskMessage("PDF generated successfully!");
      } catch (pdfError) {
        console.error("Error generating PDF:", pdfError);
        alert(`Failed to generate PDF: ${pdfError.message}`);
        setCurrentTaskMessage(`PDF generation failed: ${pdfError.message}`);
      }
    } else if (filesToProcess.length > 0 && isConvertingRef.current) { 
      alert("No screenshots were captured. PDF cannot be generated.");
      setCurrentTaskMessage("No screenshots captured. Ensure videos are valid and have >0s duration.");
    }

    if (isConvertingRef.current) {
        isConvertingRef.current = false;
        setIsConverting(false);
    }
    
    if(!isConvertingRef.current){ // Ensure progress resets if cancelled then completed
      setOverallProgress(0);
    }
  };

  const handleCancelConversion = () => {
    if (!isConvertingRef.current && !isConverting) return;

    isConvertingRef.current = false;
    setIsConverting(false);
    setCurrentTaskMessage("User cancelled conversion.");
    
    setProcessableFiles(prev => prev.map(f => 
        (f.status === FileProcessingStatus.PROCESSING || f.status === FileProcessingStatus.PENDING)
        ? {...f, status: FileProcessingStatus.CANCELLED, error: "User cancelled conversion"} 
        : f
    ));
    setOverallProgress(0);
  };
  
  const handleRemoveFile = (id) => {
    if (isConvertingRef.current) return; 
    setProcessableFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleClearAll = () => {
    if (isConvertingRef.current) return;
    setProcessableFiles([]);
    setPdfUrl(null);
    setCurrentTaskMessage("");
    setOverallProgress(0);
  };

  const filesReadyForConversion = processableFiles.filter(f => f.status === FileProcessingStatus.PENDING || f.status === FileProcessingStatus.ERROR).length;

  return (
    <div className="container mx-auto p-4 antialiased">
      <header className="text-center my-8">
        <h1 className="text-4xl font-bold text-slate-100">MP4 to PDF Converter</h1>
        <p className="text-slate-400 mt-2">Upload MP4 videos and get a consolidated PDF.</p>
      </header>

      <main className="bg-gray-800 shadow-2xl rounded-lg p-6 md:p-8">
        <FileDropzone onFilesSelected={handleFilesSelected} disabled={isConverting || processableFiles.length >= MAX_FILES} maxFiles={MAX_FILES} />
        
        {processableFiles.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-slate-300">Selected Files ({processableFiles.length}/{MAX_FILES})</h2>
              <button
                  onClick={handleClearAll}
                  disabled={isConverting}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50 transition-colors"
                >
                  Clear All
              </button>
            </div>
            <FileList files={processableFiles} onRemoveFile={handleRemoveFile} disabled={isConverting} />
          </div>
        )}
        
        { filesReadyForConversion > 0 && !isConverting && (
          <div className="mt-8 text-center">
            <button
              onClick={handleStartConversion}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 transition-all duration-150 ease-in-out flex items-center justify-center mx-auto w-full sm:w-auto"
            >
              Convert to PDF ({filesReadyForConversion})
            </button>
          </div>
        )}


        {isConverting && (
          <div className="mt-6 text-center">
            {/* Hidden button placeholder for layout consistency if needed, but actual button is the spinner one */}
            <button
                disabled={true}
                className="hidden px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md"
              />
            <div className="w-full bg-gray-600 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${overallProgress}%` }}></div>
            </div>
            <p className="text-slate-300 text-sm mb-2">{currentTaskMessage || "Processing..."}</p>
             <button
                type="button" // Added type button
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md flex items-center justify-center mx-auto w-full sm:w-auto mb-3"
                disabled
              >
                <LoadingSpinner /> Converting...
            </button>
            <button
                onClick={handleCancelConversion}
                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
                Cancel Conversion
            </button>
          </div>
        )}

        {pdfUrl && !isConverting && (
          <div className="mt-8 p-6 bg-green-700 border-l-4 border-green-500 rounded-md">
            <h3 className="text-xl font-semibold text-green-100 mb-3">Conversion Complete!</h3>
            <p className="text-green-200 mb-4">{currentTaskMessage}</p>
            <a
              href={pdfUrl}
              download={`mp4_frames_compilation_${new Date().toISOString().slice(0,10)}.pdf`}
              className="inline-block px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Download PDF
            </a>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
