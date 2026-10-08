import { describe,it,expect } from 'vitest';
import { nemScore, rankingLevel, rankingScore, admissionScore, presets, duocFinal } from './admissions';
import nemData from '../../data/nem-2027.json';

describe('official NEM table snapshot',()=>{
  it('has all 301 increasing entries per group and official endpoints',()=>{
    for(const group of ['a','b','c'] as const){
      const table=nemData.tables[group];expect(table).toHaveLength(301);
      expect(table[0]).toBe(100);expect(table[300]).toBe(1000);
      table.forEach((score,i)=>{expect(Number.isInteger(score)).toBe(true);if(i)expect(score).toBeGreaterThanOrEqual(table[i-1]);expect(nemScore((400+i)/100,group).score).toBe(score);});
    }
  });
  it('uses modality-specific exact rows, not interpolation',()=>{
    expect(nemScore(6,'a').score).toBe(713);expect(nemScore(6,'b').score).toBe(717);expect(nemScore(6,'c').score).toBe(715);
    expect(nemScore(6.005,'a')).toEqual({grade:6.01,score:nemData.tables.a[201]});
  });
  it('rejects missing values, unsupported groups and out-of-table grades',()=>{
    for(const value of [NaN,Infinity,3.99,7.01])expect(()=>nemScore(value,'a')).toThrow();
    expect(()=>nemScore(6,'__proto__')).toThrow();
  });
});
describe('Ranking 2027 context formula',()=>{
  it('applies all three official branches and boundaries',()=>{
    expect(rankingLevel(500,600,800)).toBe(500);expect(rankingLevel(600,600,800)).toBe(600);
    expect(rankingLevel(700,600,800)).toBe(800);expect(rankingLevel(800,600,800)).toBe(1000);expect(rankingLevel(900,600,800)).toBe(1000);
  });
  it('averages four contexts without intermediate rounding',()=>{
    expect(rankingScore([[500,600,800],[700,600,800],[800,600,800],[600,600,800]]).score).toBe(725);
  });
  it('fails closed on invalid contexts and missing levels',()=>{
    expect(()=>rankingLevel(700,600,600)).toThrow();expect(()=>rankingLevel(NaN,600,800)).toThrow();
    expect(()=>rankingScore([[700,600,800]])).toThrow();
  });
});
describe('PAES weighted admissions',()=>{
  const scores=[700,750,650,800,700,600,700];
  it('computes independently checked university scenarios',()=>{
    expect(admissionScore(scores,presets.usach[0].weights).score).toBe(730);
    expect(admissionScore(scores,presets.uc[0].weights).score).toBe(682.5);
    expect(admissionScore(scores,presets.uc[1].weights).score).toBe(730);
    expect(admissionScore(scores,presets.uchile[1].weights).score).toBe(727.5);
  });
  it('validates every preset total',()=>{Object.values(presets).flat().forEach(preset=>expect(preset.weights.reduce((a,b)=>a+b,0)).toBe(100));});
  it('allows blank inactive tests and a single elective',()=>{
    expect(admissionScore([700,750,650,800,NaN,NaN,700],presets.usach[0].weights).score).toBe(730);
    expect(admissionScore([700,750,650,800,NaN,600,NaN],presets.uc[0].weights).score).toBe(682.5);
  });
  it('rejects blank required scores, invalid weights and double-counted electives',()=>{
    expect(()=>admissionScore([700,750,650,800,NaN,600,700],presets.uc[1].weights)).toThrow();
    expect(()=>admissionScore(scores,[20,20,20,30,0,0,0,9])).toThrow();
    expect(()=>admissionScore(scores,[20,20,20,20,0,10,0,10])).toThrow();
    expect(()=>admissionScore([700,750,650,800,700,NaN,NaN],presets.usach[0].weights)).toThrow();
    expect(()=>admissionScore([700,750,650,800,700,50,700],presets.usach[0].weights)).toThrow();
  });
  it('preserves endpoint scores',()=>{for(const point of [100,1000])expect(admissionScore(Array(7).fill(point),presets.uc[1].weights).score).toBe(point);});
});
describe('DUOC 2026 art. 35 d',()=>{
  it('computes 60/40 and endpoints',()=>{expect(duocFinal(5,4)).toBe(4.6);expect(duocFinal(1,1)).toBe(1);expect(duocFinal(7,7)).toBe(7);});
  it('rejects empty and out-of-range grades',()=>{expect(()=>duocFinal(NaN,4)).toThrow();expect(()=>duocFinal(5,7.1)).toThrow();});
});
