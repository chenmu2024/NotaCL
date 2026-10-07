export type SavedSubject = {
  subject: string;
  average: number;
  values: string[];
  updatedAt: string;
};

export function parseSavedSubjects(raw: string | null): SavedSubject[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is SavedSubject => {
        if (!item || typeof item !== 'object') return false;
        if (typeof item.subject !== 'string' || !item.subject.trim()) return false;
        if (!Number.isFinite(item.average) || item.average < 1 || item.average > 7) return false;
        if (!Array.isArray(item.values) || item.values.some((value: unknown) => typeof value !== 'string')) return false;
        if (typeof item.updatedAt !== 'string') return false;
        return true;
      })
      .slice(-50);
  } catch {
    return [];
  }
}

export function upsertSavedSubject(rows: SavedSubject[], record: SavedSubject): SavedSubject[] {
  const normalizedName = record.subject.trim().toLocaleLowerCase('es-CL');
  const withoutSame = rows.filter(
    (row) => row.subject.trim().toLocaleLowerCase('es-CL') !== normalizedName,
  );
  return [...withoutSame, record].slice(-50);
}
