import { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  AlertCircle,
  FileText,
  Calendar,
  HardDrive,
  RefreshCcw
} from 'lucide-react';

const formatBytes = (bytes, decimals = 1) => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export function ResumeViewerModal({
  isOpen,
  onClose,
  resumeUrl,
  studentName,
  fileName,
  uploadedAt,
  fileSize
}) {
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [animate, setAnimate] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);

  const containerRef = useRef(null);

  // Smooth enter/exit transition trigger
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  // Handle ESC key and Focus trapping for accessibility
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement;

    // Body scroll lock
    document.body.style.overflow = 'hidden';

    // Focus container initially
    if (containerRef.current) {
      containerRef.current.focus();
    }

    const handleKeyDown = (e) => {
      // Escape key to close
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Tab focus trap
      if (e.key === 'Tab') {
        if (!containerRef.current) return;
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (previousActiveElement && previousActiveElement.focus) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, onClose]);

  // Fullscreen mode event listener and state sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Fetch the PDF as a Blob to display inline, bypassing forced downloads
  useEffect(() => {
    if (!isOpen || !resumeUrl) return;

    setIsLoading(true);
    setHasError(false);
    setBlobUrl(null);

    let isMounted = true;
    let localUrl = null;

    const loadPdf = async () => {
      try {
        const response = await fetch(resumeUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        
        if (isMounted) {
          // Explicitly set MIME type as application/pdf so browser renders it inline
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          localUrl = URL.createObjectURL(pdfBlob);
          setBlobUrl(localUrl);
        }
      } catch (err) {
        console.error("Error loading PDF blob:", err);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    // Timeout safety fallback: if PDF doesn't trigger iframe onLoad in 15s, show error state.
    const loadTimeout = setTimeout(() => {
      if (isMounted) {
        setIsLoading((loading) => {
          if (loading) {
            setHasError(true);
            return false;
          }
          return loading;
        });
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearTimeout(loadTimeout);
      if (localUrl) {
        URL.revokeObjectURL(localUrl);
      }
    };
  }, [isOpen, resumeUrl, retryKey]);

  // Format uploaded date
  const formattedDate = useMemo(() => {
    if (!uploadedAt) return 'N/A';
    try {
      return new Date(uploadedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  }, [uploadedAt]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2.0));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1.0);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error enabling fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryKey((prev) => prev + 1);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ats-resume-viewer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6"
    >
      {/* Backdrop with fade transition */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Modal Dialog with scale & fade transition */}
      <div
        ref={containerRef}
        tabIndex="-1"
        className={`relative bg-[var(--bg-surface)] shadow-2xl w-full h-full sm:h-[90vh] sm:max-w-5xl sm:rounded-2xl flex flex-col overflow-hidden border-t sm:border border-[var(--border-primary)] transition-all duration-300 transform outline-none ${
          animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* ATS Resume Information Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 border-b border-[var(--border-primary)] bg-[var(--bg-surface)] gap-4 select-none">
          <div className="min-w-0">
            <h2
              id="ats-resume-viewer-title"
              className="text-lg font-bold text-[var(--text-primary)] truncate flex items-center gap-2"
            >
              <FileText className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              {studentName}'s Resume
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-muted)] mt-1.5 font-medium">
              <span className="truncate max-w-[200px]" title={fileName}>
                <strong>File:</strong> {fileName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                Uploaded: {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5 flex-shrink-0" />
                Size: {formatBytes(fileSize)}
              </span>
            </div>
          </div>

          {/* Close button for header (mobile/fallback) */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 p-2 rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Close PDF viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Professional Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] select-none">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5 || isLoading || hasError}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] disabled:opacity-40 transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              disabled={zoom === 1.0 || isLoading || hasError}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] disabled:opacity-40 transition-colors min-w-[50px] text-center"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 2.0 || isLoading || hasError}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] disabled:opacity-40 transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleFullscreen}
              disabled={isLoading || hasError}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] transition-colors text-xs font-semibold"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-xs font-semibold shadow-sm ml-1"
              title="Close"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Content Viewer Area */}
        <div className="flex-1 bg-[var(--bg-elevated)] relative flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-0">
          {/* Loading Skeleton */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-elevated)] p-4 sm:p-8 z-10">
              <div className="w-full max-w-3xl h-full bg-[var(--bg-surface)] rounded-xl border border-[var(--border-secondary)] p-6 sm:p-8 shadow-inner animate-pulse flex flex-col gap-6 overflow-hidden">
                {/* Header mock */}
                <div className="flex justify-between items-center border-b border-[var(--border-primary)] pb-4">
                  <div className="space-y-2">
                    <div className="h-6 w-32 sm:w-48 bg-[var(--bg-hover)] rounded-md" />
                    <div className="h-4 w-20 sm:w-32 bg-[var(--bg-hover)] rounded-md" />
                  </div>
                  <div className="h-8 w-16 sm:w-24 bg-[var(--bg-hover)] rounded-md" />
                </div>
                {/* Text paragraph blocks */}
                <div className="space-y-4">
                  <div className="h-4 w-full bg-[var(--bg-hover)] rounded-md" />
                  <div className="h-4 w-5/6 bg-[var(--bg-hover)] rounded-md" />
                  <div className="h-4 w-4/5 bg-[var(--bg-hover)] rounded-md" />
                </div>
                {/* List block */}
                <div className="space-y-3 mt-2">
                  <div className="h-5 w-24 sm:w-36 bg-[var(--bg-hover)] rounded-md" />
                  <div className="h-4 w-full bg-[var(--bg-hover)] rounded-md" />
                  <div className="h-4 w-11/12 bg-[var(--bg-hover)] rounded-md" />
                </div>
                {/* Column block */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="h-4 w-3/4 bg-[var(--bg-hover)] rounded-md" />
                  <div className="h-4 w-2/3 bg-[var(--bg-hover)] rounded-md" />
                  <div className="h-4 w-5/6 bg-[var(--bg-hover)] rounded-md" />
                  <div className="h-4 w-1/2 bg-[var(--bg-hover)] rounded-md" />
                </div>
                {/* Text paragraph blocks */}
                <div className="space-y-4 mt-2 hidden sm:block">
                  <div className="h-4 w-full bg-[var(--bg-hover)] rounded-md" />
                  <div className="h-4 w-5/6 bg-[var(--bg-hover)] rounded-md" />
                </div>
              </div>
            </div>
          )}

          {/* Error Screen */}
          {hasError ? (
            <div className="flex flex-col items-center justify-center text-center p-6 max-w-md gap-4 select-none">
              <div className="w-16 h-16 rounded-2xl bg-error-50 dark:bg-error-900/20 flex items-center justify-center border border-error-100 dark:border-error-900/50 shadow-sm animate-bounce">
                <AlertCircle className="w-8 h-8 text-error-600 dark:text-error-400" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1.5 flex items-center justify-center gap-1.5">
                  📄 Resume unavailable
                </h4>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  Unable to load this resume. Please try reloading or verify if the file exists on the server.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Retry</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-[var(--border-secondary)] text-[var(--text-secondary)] rounded-xl text-sm font-semibold hover:bg-[var(--bg-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Responsive, Non-Reloading Iframe Container */
            blobUrl && (
              <div className="w-full h-full flex justify-center items-start overflow-auto">
                <iframe
                  key={`${retryKey}-${resumeUrl}`}
                  src={`${blobUrl}#toolbar=0&navpanes=0`}
                  title={`${studentName}'s Resume`}
                  className="rounded-xl border border-[var(--border-secondary)] bg-white shadow-lg overflow-hidden transition-transform duration-150 ease-out"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    width: `${100 / zoom}%`,
                    height: `${100 / zoom}%`,
                    minHeight: '100%'
                  }}
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
