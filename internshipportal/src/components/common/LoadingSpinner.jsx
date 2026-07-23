export function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 border-2 border-[var(--border-primary)] border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
}
