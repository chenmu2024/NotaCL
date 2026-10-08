import { average, parseDecimal, weightedAverage } from '../calculators/core';

export type SavedSubject = {
  subject: string;
  average: number;
  values: string[];
  weights?: string[];
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
        if (typeof item.subject !== 'string' || !item.subject.trim() || item.subject.trim().length > 80) return false;
        if (!Number.isFinite(item.average) || item.average < 1 || item.average > 7) return false;
        if (!Array.isArray(item.values) || !item.values.length || item.values.length > 200 || item.values.some((value: unknown) => typeof value !== 'string' || value.length > 32)) return false;
        if (typeof item.updatedAt !== 'string' || !Number.isFinite(Date.parse(item.updatedAt))) return false;
        try {
          if (item.weights !== undefined) {
            if (!Array.isArray(item.weights) || item.weights.length !== item.values.length || item.weights.some((value: unknown) => typeof value !== 'string' || value.length > 32)) return false;
            weightedAverage(item.values.map((value: string, index: number) => ({ grade: parseDecimal(value), weight: parseDecimal(item.weights[index]) })));
          } else {
            average(item.values.map(parseDecimal));
          }
        } catch {
          return false;
        }
        return true;
      })
      .slice(-50);
  } catch {
    return [];
  }
}

export function upsertSavedSubject(rows: SavedSubject[], record: SavedSubject): SavedSubject[] {
  const cleanedRecord = { ...record, subject: record.subject.trim().slice(0, 80), values: record.values.slice(0, 200) };
  const normalizedName = cleanedRecord.subject.toLocaleLowerCase('es-CL');
  const withoutSame = rows.filter(
    (row) => row.subject.trim().toLocaleLowerCase('es-CL') !== normalizedName,
  );
  return [...withoutSame, cleanedRecord].slice(-50);
}
