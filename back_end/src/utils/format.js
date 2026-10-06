export function formatDateNow() {
  return new Date().toISOString().slice(0, 16).replace(/T/, " ");
}
