/** Two-digit project index, as the site labels projects: 1 → "01". */
export function pad(index: number) {
  return String(index).padStart(2, "0");
}
