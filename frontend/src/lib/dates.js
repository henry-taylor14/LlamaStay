// PocketBase returns dates as UTC midnight ("2026-09-04 00:00:00.000Z"), so
// these must format in UTC. Without it, anywhere west of UTC renders the
// previous day.
const format = (dateString, options) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';
  return date.toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });
};

export const formatDate = dateString =>
  format(dateString, { year: 'numeric', month: 'short', day: 'numeric' });

// Produces the YYYY-MM-DD an <input type="date"> expects. Splitting on "T"
// does not work here: PocketBase separates date and time with a space.
export const toDateInputValue = dateString => {
  const date = dateString ? new Date(dateString) : new Date();
  return (isNaN(date) ? new Date() : date).toISOString().slice(0, 10);
};
