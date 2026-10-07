export type GradeConfig = {
  minGrade: number;
  passGrade: number;
  maxGrade: number;
  exigency: number;
  decimals: number;
};

export const DEFAULT_GRADE_CONFIG: GradeConfig = {
  minGrade: 1,
  passGrade: 4,
  maxGrade: 7,
  exigency: 0.6,
  decimals: 1,
};

export function parseDecimal(value: string | number): number {
  if (typeof value === 'number') return value;
  const normalized = value.trim().replace(/\s+/g, '').replace(',', '.');
  if (!normalized) return Number.NaN;
  return Number(normalized);
}

export function roundHalfUp(value: number, decimals = 1): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number, decimals = 1): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function validateGradeConfig(config: GradeConfig): string[] {
  const errors: string[] = [];
  if (!(config.exigency > 0 && config.exigency < 1)) errors.push('La exigencia debe ser mayor que 0% y menor que 100%.');
  if (!(config.minGrade < config.passGrade && config.passGrade < config.maxGrade)) {
    errors.push('Las notas deben cumplir: mínima < aprobación < máxima.');
  }
  if (config.minGrade < 0 || config.maxGrade > 10) errors.push('La configuración de notas está fuera de un rango razonable.');
  if (!Number.isInteger(config.decimals) || config.decimals < 0 || config.decimals > 3) errors.push('Los decimales deben estar entre 0 y 3.');
  return errors;
}

export function scoreToExactGrade(score: number, maxScore: number, config: GradeConfig = DEFAULT_GRADE_CONFIG): number {
  const errors = validateGradeConfig(config);
  if (errors.length) throw new Error(errors.join(' '));
  if (!Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0) throw new Error('El puntaje máximo debe ser mayor que 0.');
  if (score < 0 || score > maxScore) throw new Error('El puntaje obtenido debe estar entre 0 y el puntaje máximo.');

  const threshold = maxScore * config.exigency;
  if (score <= threshold) {
    return config.minGrade + (config.passGrade - config.minGrade) * (score / threshold);
  }
  return config.passGrade + (config.maxGrade - config.passGrade) * ((score - threshold) / (maxScore - threshold));
}

export function scoreToGrade(score: number, maxScore: number, config: GradeConfig = DEFAULT_GRADE_CONFIG): number {
  return roundHalfUp(scoreToExactGrade(score, maxScore, config), config.decimals);
}

export function buildGradeScale(maxScore: number, config: GradeConfig = DEFAULT_GRADE_CONFIG) {
  if (!Number.isInteger(maxScore) || maxScore <= 0 || maxScore > 1000) throw new Error('El puntaje máximo debe ser un entero entre 1 y 1000.');
  return Array.from({ length: maxScore + 1 }, (_, score) => {
    const exact = scoreToExactGrade(score, maxScore, config);
    const grade = roundHalfUp(exact, config.decimals);
    return {
      score,
      percentage: (score / maxScore) * 100,
      exact,
      grade,
      passed: grade >= config.passGrade,
    };
  }).reverse();
}

export function average(values: number[]): number {
  if (!values.length) throw new Error('Agrega al menos una nota.');
  if (values.some((v) => !Number.isFinite(v))) throw new Error('Todas las notas deben ser números válidos.');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export type WeightedItem = { grade: number; weight: number };

export function weightedAverage(items: WeightedItem[]): { average: number; totalWeight: number } {
  if (!items.length) throw new Error('Agrega al menos una nota.');
  for (const item of items) {
    if (!Number.isFinite(item.grade) || !Number.isFinite(item.weight)) throw new Error('Revisa las notas y porcentajes.');
    if (item.weight < 0) throw new Error('Los porcentajes no pueden ser negativos.');
  }
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) throw new Error('El porcentaje total debe ser mayor que 0.');
  const total = items.reduce((sum, item) => sum + item.grade * item.weight, 0);
  return { average: total / totalWeight, totalWeight };
}

export function weightStatus(totalWeight: number, tolerance = 0.11): 'complete' | 'under' | 'over' {
  if (Math.abs(totalWeight - 100) <= tolerance) return 'complete';
  return totalWeight < 100 ? 'under' : 'over';
}

export function requiredGrade(params: {
  currentAverage: number;
  completedWeight: number;
  finalWeight: number;
  targetGrade: number;
}): number {
  const { currentAverage, completedWeight, finalWeight, targetGrade } = params;
  if (![currentAverage, completedWeight, finalWeight, targetGrade].every(Number.isFinite)) throw new Error('Completa todos los campos con números válidos.');
  if (completedWeight < 0 || finalWeight <= 0) throw new Error('Los porcentajes deben ser positivos.');
  const total = completedWeight + finalWeight;
  if (Math.abs(total - 100) > 0.11) throw new Error('El porcentaje completado más el examen debe sumar 100%.');
  return (targetGrade * 100 - currentAverage * completedWeight) / finalWeight;
}
