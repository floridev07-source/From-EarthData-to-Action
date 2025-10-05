export function downloadCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return;
  const headers = Array.from(rows.reduce<Set<string>>((acc, row) => {
    Object.keys(row).forEach(k => acc.add(k));
    return acc;
  }, new Set())).join(',');

  const escape = (val: any) => {
    if (val == null) return '';
    const s = String(val).replace(/"/g, '""');
    if (/[",\n]/.test(s)) return '"' + s + '"';
    return s;
  };

  const lines = rows.map(r => headers.split(',').map(h => escape(r[h])).join(','));
  const csv = [headers, ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJSON(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
