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

  it('round-trips weighted subjects and rejects incompatible weight data', () => {
    const weighted={...valid,average:5.25,values:['6,0','5,5','4,8'],weights:['20','30','50']};
    expect(parseSavedSubjects(JSON.stringify([weighted]))).toEqual([weighted]);
    for (const weights of [['100'], ['20','30','60'], ['20','bad','50'], [20,30,50]]) {
      expect(parseSavedSubjects(JSON.stringify([{...weighted,weights}]))).toEqual([]);
    }
    expect(parseSavedSubjects(JSON.stringify([{...valid,values:[]}]))).toEqual([]);
    expect(parseSavedSubjects(JSON.stringify([{...valid,values:['8']}]))).toEqual([]);
    expect(parseSavedSubjects(JSON.stringify([{...valid,updatedAt:'invalid'}]))).toEqual([]);
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
