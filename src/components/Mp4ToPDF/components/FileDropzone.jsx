import React, { useState, useCallback } from 'react';

// Upload Icon SVG
const UploadIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-12 h-12 text-slate-400"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338 0 4.5 4.5 0 01-1.41 8.775H6.75z" />
  </svg>
);

export const FileDropzone = ({ onFilesSelected, disabled, maxFiles }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) {
      e.dataTransfer.dropEffect = 'none';
    } else {
      e.dataTransfer.dropEffect = 'copy';
    }
  }, [disabled]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected, disabled]);

  const handleFileChange = (e) => {
    if (disabled) return;
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      onFilesSelected(files);
    }
    e.target.value = '';
  };

  // Enhanced style classes
  const baseClasses = "border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ease-in-out outline-none focus:ring-2 focus:ring-blue-400";
  const activeClasses = isDragging && !disabled ? "border-blue-500 bg-blue-950/30" : "border-slate-600 hover:border-blue-400";
  const disabledClasses = disabled ? "bg-slate-800 cursor-not-allowed opacity-60" : "bg-slate-900 hover:bg-slate-800 cursor-pointer";

  return (
    <div
      className={`${baseClasses} ${activeClasses} ${disabledClasses}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !disabled && document.getElementById('fileInput')?.click()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          document.getElementById('fileInput')?.click();
        }
      }}
      aria-label="File dropzone and selector"
      aria-disabled={disabled}
    >
      <input
        type="file"
        id="fileInput"
        multiple
        accept="video/mp4"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        aria-hidden="true"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <UploadIcon />
        <p className="text-slate-200 font-semibold text-lg">
          {isDragging ? "Drop files here" : "Drag & drop MP4 files here, or click to select"}
        </p>
        <p className="text-xs text-slate-400">Up to {maxFiles} files. MP4 format only.</p>
        {disabled && <p className="text-xs text-amber-400 mt-1">File selection disabled during processing or when max files reached.</p>}
      </div>
    </div>
  );
};
