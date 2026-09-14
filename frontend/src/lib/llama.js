// Domain derivations for a llama record. Pure: no React, no network.

// Single source of truth for fiber colors — drives both the form dropdown
// and the swatch tint, and matches the select options the backend accepts.
export const FIBER_COLORS = [
  { name: 'Red', hex: '#9E4434' },
  { name: 'Orange', hex: '#D9822E' },
  { name: 'Yellow', hex: '#E4B93C' },
  { name: 'Green', hex: '#6B7F4E' },
  { name: 'Blue', hex: '#4C6E91' },
  { name: 'Purple', hex: '#6B5578' },
  { name: 'Black', hex: '#2B2B2B' },
  { name: 'White', hex: '#DCD3BE' },
  { name: 'Gray', hex: '#9A9A93' },
  { name: 'Brown', hex: '#8B6F4E' },
  { name: 'Tan', hex: '#C9A876' },
];

const HEX_BY_NAME = Object.fromEntries(FIBER_COLORS.map(c => [c.name, c.hex]));

export const colorHex = name => HEX_BY_NAME[name] || 'var(--wool)';

// Llamas are sheared about once a year, so a record untouched for longer than
// that is the thing the ledger should flag.
const OVERDUE_AFTER_DAYS = 365;

export const daysSince = dateString => {
  if (!dateString) return null;
  const then = new Date(dateString);
  if (isNaN(then)) return null;
  return (Date.now() - then.getTime()) / 86400000;
};

export const isOverdue = dateString => {
  const days = daysSince(dateString);
  return days !== null && days > OVERDUE_AFTER_DAYS;
};

// Ledger entries are numbered by the order they were recorded.
export const entryNo = index => String(index + 1).padStart(3, '0');

export const formatYield = mm => `${mm || 0}mm`;
