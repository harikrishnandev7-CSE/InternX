const statusStyles = {
  'Applied': 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  'Under Review': 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  'Shortlisted': 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-400',
  'Rejected': 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  'Selected': 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
};

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${statusStyles[status] || 'bg-neutral-100 text-neutral-700'}`}>
      {status}
    </span>
  );
}
