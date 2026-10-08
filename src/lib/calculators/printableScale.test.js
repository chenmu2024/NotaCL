import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildGradeScale, DEFAULT_GRADE_CONFIG, formatNumber } from './core';

describe('downloadable reference scale', () => {
  it('keeps every CSV row consistent with the declared 100-point / 60% configuration', () => {
    const lines=readFileSync('public/recursos/escala-100-puntos-60.csv','utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n/);
    expect(lines.shift()).toBe('Puntaje;Porcentaje;Nota;Estado según corte');
    const rows=buildGradeScale(100,DEFAULT_GRADE_CONFIG);
    expect(lines).toHaveLength(101);
    rows.forEach((row,index)=>{
      expect(lines[index].split(';')).toEqual([String(row.score),`${formatNumber(row.percentage,1)}%`,formatNumber(row.grade,1),row.passed?'Cumple exigencia':'Bajo exigencia']);
    });
  });
});
