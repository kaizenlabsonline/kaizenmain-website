import React from 'react';

const FileProcessingStatus = {
  PENDING: 'Pending',
  UPLOADING: 'Uploading',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
  ERROR: 'Error',
  CANCELLED: 'Cancelled',
};

const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const XCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MiniSpinner = ({ className = "w-4 h-4" }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const StatusBadge = ({ status }) => {
  switch (status) {
    case FileProcessingStatus.PENDING:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-100"><ClockIcon className="mr-1 w-4 h-4 text-gray-300"/> Pending</span>;
    case FileProcessingStatus.PROCESSING:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-700 text-blue-100"><MiniSpinner className="mr-1 text-blue-300"/> Processing</span>;
    case FileProcessingStatus.COMPLETED:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-700 text-green-100"><CheckCircleIcon className="mr-1 w-4 h-4 text-green-300"/> Completed</span>;
    case FileProcessingStatus.ERROR:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-700 text-red-100"><XCircleIcon className="mr-1 w-4 h-4 text-red-300"/> Error</span>;
    case FileProcessingStatus.CANCELLED:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-700 text-yellow-100"><XCircleIcon className="mr-1 w-4 h-4 text-yellow-300"/> Cancelled</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">Unknown</span>;
  }
};

export const FileList = ({ files, onRemoveFile, disabled }) => {
  if (files.length === 0) {
    return <p className="text-slate-400 text-center py-4">No files selected yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {files.map((file) => (
        <li key={file.id} className="bg-slate-800 p-4 rounded-xl shadow flex items-center justify-between hover:bg-slate-700 transition-colors duration-150">
          <div className="flex-grow overflow-hidden mr-4">
            <p className="text-sm font-medium text-slate-100 truncate" title={file.file.name}>{file.file.name}</p>
            <p className="text-xs text-slate-400">
              {(file.file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            {file.status === FileProcessingStatus.PROCESSING && file.totalFramesToCapture && file.totalFramesToCapture > 0 && (
              <div className="w-full bg-gray-500 rounded-full h-1.5 mt-1">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(file.screenshotsTaken / file.totalFramesToCapture) * 100}%` }}></div>
              </div>
            )}
            {file.status === FileProcessingStatus.PROCESSING && (
              <p className="text-xs text-blue-400 mt-0.5">
                {file.screenshotsTaken} {file.totalFramesToCapture ? `/ ${file.totalFramesToCapture}`: ''} frames captured
              </p>
            )}
            {file.status === FileProcessingStatus.COMPLETED && (
              <p className="text-xs text-green-400 mt-0.5">{file.screenshotsTaken} frames extracted.</p>
            )}
            {file.error && <p className="text-xs text-red-400 mt-0.5 truncate" title={file.error}>Error: {file.error}</p>}
          </div>
          <div className="flex-shrink-0 flex items-center space-x-3">
            <StatusBadge status={file.status} />
            <button
              onClick={() => onRemoveFile(file.id)}
              disabled={disabled || file.status === FileProcessingStatus.PROCESSING}
              title="Remove file"
              aria-label={`Remove file ${file.file.name}`}
              className="text-slate-500 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
