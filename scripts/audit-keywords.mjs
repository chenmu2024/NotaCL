import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const { keywords } = JSON.parse(readFileSync(resolve('seo/keyword-map.json'), 'utf8'));
const seen = new Set();
const statuses = new Set(['covered','conditional','variant','limited','excluded','deferred','preset']);
const counts = {};
const fail = (message) => { console.error(`KEYWORD AUDIT FAIL: ${message}`); process.exitCode = 1; };
const expectedContent = {
  '/#calculadora-notas': 'Calculadora de Notas Chile',
  '/generador-de-notas/#tabla-generadora': 'Tabla generadora de notas para docentes',
  '/generador-de-notas/#pauta-evaluacion': 'no crea rúbricas',
  '/escala-de-notas/#conversion-puntaje': 'Convertidor de puntaje a nota',
  '/escala-de-notas/#porcentaje-logro': 'La ponderación indica cuánto vale una evaluación',
  '/escala-de-notas/#generador': 'data-exigency="50"',
  '/escala-de-notas/60/': '60%',
  '/promedio-de-notas/#calcular-promedio': 'Cómo calcular tu promedio paso a paso',
  '/promedio-de-notas/#promedio-materias': 'notas de universidad',
  '/notas-con-porcentaje/#promedio-ponderado': 'Calculadora de promedio con porcentaje',
  '/que-nota-necesito/#nota-examen': 'Calcular la nota de examen',
  '/guias/concentracion-de-notas-ensenanza-media/': 'Ayuda Mineduc'
};

for (const entry of keywords) {
  const key = entry.keyword?.trim().toLocaleLowerCase('es-CL');
  if (!key || seen.has(key)) fail(`empty or duplicate query: ${entry.keyword}`);
  seen.add(key);
  if (!statuses.has(entry.status) || !entry.reason || !entry.sections?.length) fail(`missing classification/source: ${entry.keyword}`);
  counts[entry.status] = (counts[entry.status] ?? 0) + 1;
  if (['excluded','deferred'].includes(entry.status)) {
    if (entry.target) fail(`excluded/deferred query has a target: ${entry.keyword}`);
    continue;
  }
  const [route, anchor] = entry.target.split('#');
  if (!route.startsWith('/') || !route.endsWith('/') || route.includes('..') || route.includes('?')) {
    fail(`invalid clean route: ${entry.keyword}`);
    continue;
  }
  const file = join(resolve('dist'), route, 'index.html');
  if (!existsSync(file)) { fail(`missing built page: ${entry.target}`); continue; }
  const html = readFileSync(file, 'utf8');
  if (anchor && !html.includes(`id="${anchor}"`)) fail(`missing content anchor: ${entry.target}`);
  const expected = expectedContent[entry.target];
  if (!expected || !html.includes(expected)) fail(`missing topic evidence: ${entry.keyword} → ${entry.target}`);
}

for (const route of ['mi-promedio','sacar-promedio','calcular-promedio','calculadora-promedio','escalada-de-notas','tabla-de-notas','puntaje-a-nota','escala-de-notas/50','calculadora-nem','universidades/usach']) {
  if (existsSync(join(resolve('dist'), route, 'index.html'))) fail(`unexpected duplicate or deferred route: /${route}/`);
}

if (!process.exitCode) console.log(`Keyword audit passed: ${keywords.length} unique queries classified; ${JSON.stringify(counts)}. Coverage is by task, not exact-match stuffing or proof of rankings.`);
