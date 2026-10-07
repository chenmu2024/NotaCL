import { describe, expect, it } from 'vitest';
import {
  DEFAULT_GRADE_CONFIG,
  average,
  buildGradeScale,
  parseDecimal,
  projectedFinalGrade,
  requiredGrade,
  roundHalfUp,
  scoreToGrade,
  validateGradeConfig,
  validateChileGrade,
  weightedAverage,
  weightStatus,
} from './core';

describe('parseDecimal', () => {
  it('accepts Chilean comma and dot decimal forms', () => {
    expect(parseDecimal('5,5')).toBe(5.5);
    expect(parseDecimal('5.5')).toBe(5.5);
    expect(parseDecimal(' 5,5 ')).toBe(5.5);
  });
});

describe('rounding', () => {
  it('handles known decimal boundaries deterministically', () => {
    expect(roundHalfUp(3.94, 1)).toBe(3.9);
    expect(roundHalfUp(3.95, 1)).toBe(4);
    expect(roundHalfUp(3.96, 1)).toBe(4);
    expect(roundHalfUp(5.25, 1)).toBe(5.3);
    expect(roundHalfUp(6.95, 1)).toBe(7);
  });
});

describe('grade scale', () => {
  it('maps 0, exigency threshold and full score correctly', () => {
    expect(scoreToGrade(0, 60)).toBe(1);
    expect(scoreToGrade(36, 60)).toBe(4);
    expect(scoreToGrade(60, 60)).toBe(7);
  });

  it('rejects scores outside range and exigency boundaries', () => {
    expect(() => scoreToGrade(61, 60)).toThrow();
    expect(validateGradeConfig({ ...DEFAULT_GRADE_CONFIG, exigency: 0 })).not.toHaveLength(0);
    expect(validateGradeConfig({ ...DEFAULT_GRADE_CONFIG, exigency: 1 })).not.toHaveLength(0);
    expect(validateGradeConfig({ ...DEFAULT_GRADE_CONFIG, passGrade: 0.5 })).not.toHaveLength(0);
  });

  it('builds a complete descending table', () => {
    const rows = buildGradeScale(10);
    expect(rows).toHaveLength(11);
    expect(rows[0].score).toBe(10);
    expect(rows.at(-1)?.score).toBe(0);
  });
});

describe('averages', () => {
  it('calculates simple average exactly', () => {
    expect(average([5.5, 6.2, 4.8, 6])).toBeCloseTo(5.625);
  });

  it('rejects grades outside Chilean 1.0–7.0 range', () => {
    expect(() => validateChileGrade(0.9)).toThrow();
    expect(() => validateChileGrade(7.1)).toThrow();
    expect(() => average([5.5, 8])).toThrow();
    expect(() => weightedAverage([{ grade: 0, weight: 100 }])).toThrow();
  });

  it('calculates the audited 5.25 weighted example', () => {
    const result = weightedAverage([
      { grade: 6, weight: 20 },
      { grade: 5.5, weight: 30 },
      { grade: 4.8, weight: 50 },
    ]);
    expect(result.average).toBeCloseTo(5.25);
    expect(result.totalWeight).toBe(100);
    expect(result.contribution).toBeCloseTo(5.25);
  });

  it('handles 33.3 x 3 as a near-complete weight set', () => {
    const result = weightedAverage([
      { grade: 5, weight: 33.3 },
      { grade: 5, weight: 33.3 },
      { grade: 5, weight: 33.3 },
    ]);
    expect(result.totalWeight).toBeCloseTo(99.9);
    expect(result.contribution).toBeCloseTo(4.995);
    expect(weightStatus(result.totalWeight)).toBe('complete');
  });
});

describe('required grade', () => {
  it('solves reverse grade equation', () => {
    expect(requiredGrade({ currentAverage: 5, completedWeight: 70, finalWeight: 30, targetGrade: 5.4 })).toBeCloseTo(6.3333333);
  });

  it('rejects incomplete weight totals and invalid grade targets', () => {
    expect(() => requiredGrade({ currentAverage: 5, completedWeight: 60, finalWeight: 30, targetGrade: 5.4 })).toThrow();
    expect(() => requiredGrade({ currentAverage: 8, completedWeight: 70, finalWeight: 30, targetGrade: 5.4 })).toThrow();
    expect(() => requiredGrade({ currentAverage: 5, completedWeight: 70, finalWeight: 30, targetGrade: 8 })).toThrow();
  });

  it('projects final grade scenarios with the same weights', () => {
    expect(projectedFinalGrade({ currentAverage: 5, completedWeight: 70, finalGrade: 4, finalWeight: 30 })).toBeCloseTo(4.7);
    expect(projectedFinalGrade({ currentAverage: 5, completedWeight: 70, finalGrade: 6, finalWeight: 30 })).toBeCloseTo(5.3);
  });
});
