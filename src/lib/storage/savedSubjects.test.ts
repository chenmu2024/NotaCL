import { describe, expect, it } from 'vitest';
import { parseSavedSubjects, upsertSavedSubject } from './savedSubjects';

describe('saved subject storage', () => {
  const valid = {
    subject: 'Matemáticas',
    average: 5.6,
    values: ['5,5', '5,7'],
    updatedAt: '2026-10-07T00:00:00.000Z',
  };

  it('returns an empty list for corrupted or incompatible data', () => {
    expect(parseSavedSubjects('{broken')).toEqual([]);
    expect(parseSavedSubjects(JSON.stringify({ subject: 'x' }))).toEqual([]);
    expect(parseSavedSubjects(JSON.stringify([{ ...valid, average: 9 }]))).toEqual([]);
    expect(parseSavedSubjects(JSON.stringify([{ ...valid, values: [5.5] }]))).toEqual([]);
  });

  it('keeps valid saved subjects and rejects oversized payloads', () => {
    expect(parseSavedSubjects(JSON.stringify([valid]))).toEqual([valid]);
    expect(parseSavedSubjects(JSON.stringify([{ ...valid, subject: 'x'.repeat(81) }]))).toEqual([]);
    expect(parseSavedSubjects(JSON.stringify([{ ...valid, values: Array(201).fill('5,0') }]))).toEqual([]);
  });

  it('updates the same subject name instead of duplicating it', () => {
    const updated = { ...valid, subject: 'matemáticas', average: 6.1 };
    const result = upsertSavedSubject([valid], updated);
    expect(result).toHaveLength(1);
    expect(result[0].average).toBe(6.1);
  });

  it('caps storage at fifty subjects', () => {
    const rows = Array.from({ length: 50 }, (_, index) => ({
      ...valid,
      subject: `Materia ${index}`,
    }));
    const result = upsertSavedSubject(rows, { ...valid, subject: 'Materia nueva' });
    expect(result).toHaveLength(50);
    expect(result.at(-1)?.subject).toBe('Materia nueva');
  });
});
