import nemData from '../../data/nem-2027.json';
import { roundHalfUp } from './core';

export const factors = ['NEM','Ranking','Competencia Lectora','M1','M2','Historia y Ciencias Sociales','Ciencias','Mejor electiva (Historia/Ciencias)'];
export interface AdmissionPreset { name: string; weights: number[] }
export const presets: Record<string, AdmissionPreset[]> = {
  paes: [{name:'Personalizado: completa las ponderaciones de tu carrera',weights:[20,20,20,30,0,0,0,10]}],
  usach: [{name:'Bachillerato en Ciencias y Humanidades · 16030',weights:[10,40,20,20,0,0,0,10]}],
  uc: [{name:'Derecho',weights:[20,20,25,10,0,25,0,0]},{name:'Ingeniería',weights:[20,20,10,25,10,0,15,0]}],
  uchile: [{name:'Derecho · 11055',weights:[20,20,25,10,0,25,0,0]},{name:'Ingeniería y Ciencias – Plan Común · 11045',weights:[10,25,10,20,20,0,15,0]}]
};
function inRange(value:number,min:number,max:number) {
  if (!Number.isFinite(value) || value<min || value>max) throw new Error(`Ingresa valores entre ${min} y ${max}.`);
}
export function nemScore(grade:number,group:string) {
  inRange(grade,4,7);
  if (!Object.hasOwn(nemData.tables,group)) throw new Error('Selecciona una modalidad válida.');
  const rounded=roundHalfUp(grade,2);
  return {grade:rounded,score:nemData.tables[group as keyof typeof nemData.tables][Math.round(rounded*100)-400]};
}
export function rankingLevel(nem:number,prom:number,max:number) {
  [nem,prom,max].forEach(value=>inRange(value,100,1000));
  if(max<=prom) throw new Error('MAX debe ser mayor que PROM; este contexto requiere revisión oficial.');
  if(nem<=prom) return nem;
  if(nem>=max) return 1000;
  return prom+(nem-prom)*(1000-prom)/(max-prom);
}
export function rankingScore(rows:number[][]) {
  if(rows.length!==4 || rows.some(row=>row.length!==3)) throw new Error('Completa los cuatro niveles.');
  const levels=rows.map(([nem,prom,max])=>rankingLevel(nem,prom,max));
  return {levels,score:levels.reduce((a,b)=>a+b,0)/4};
}
export function admissionScore(scores:number[],weights:number[]) {
  if(scores.length!==7 || weights.length!==8) throw new Error('Completa todos los factores.');
  weights.forEach(value=>inRange(value,0,100));
  if(Math.abs(weights.reduce((a,b)=>a+b,0)-100)>0.000001) throw new Error('Las ponderaciones deben sumar 100%.');
  if(weights[7]>0 && (weights[5]>0 || weights[6]>0)) throw new Error('Usa la mejor electiva o sus pruebas por separado, sin duplicarlas.');
  const contributions=weights.map((weight,i)=>{
    if(weight===0) return 0;
    let score=scores[i];
    if(i===7) {
      const electives=scores.slice(5,7).filter(value=>!Number.isNaN(value));
      if(!electives.length) throw new Error('Ingresa al menos una prueba electiva.');
      electives.forEach(value=>inRange(value,100,1000));
      score=Math.max(...electives);
    }
    inRange(score,100,1000);
    return score*weight/100;
  });
  return {contributions,score:contributions.reduce((a,b)=>a+b,0)};
}
export function duocFinal(presentation:number,exam:number) {
  [presentation,exam].forEach(value=>inRange(value,1,7));
  return presentation*0.6+exam*0.4;
}
