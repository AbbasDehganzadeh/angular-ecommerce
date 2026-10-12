/**
 * Format a date to a string in the format YYYY-MM-DD HH:MM:SS
 * @param {Date} date - The date to format
 * @returns {string} The formatted date
 */
export function formatDate(date) {
  return date.toISOString().slice(0, 16).replace(/T/, " ");
}

/**
 * Format the current date to a string in the format YYYY-MM-DD HH:MM:SS
 * @returns {string} The formatted date
 */
export function formatDateNow() {
  return new Date().toISOString().slice(0, 16).replace(/T/, " ");
}
