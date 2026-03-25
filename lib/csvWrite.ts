/** RFC-style CSV cell escaping for appending rows. */
export function escapeCsvCell(value: string | undefined | null): string {
  if (value == null) return "";
  const s = String(value);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowToCsvLine(cells: string[]): string {
  return cells.map(escapeCsvCell).join(",") + "\r\n";
}
