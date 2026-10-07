export type RoundingRule = 'half-up' | 'truncate';

export type GradeConfig = {
  minGrade: number;
  passGrade: number;
  maxGrade: number;
  exigency: number;
  decimals: number;
  rounding?: RoundingRule;
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
  const normalized = value.trim().replace(',', '.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return Number.NaN;
  return Number(normalized);
}

export function roundHalfUp(value: number, decimals = 1): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  const scaled = value * factor;
  return Math.round(scaled + Number.EPSILON * Math.max(1, Math.abs(scaled))) / factor;
}

export function roundGrade(value: number, decimals = 1, rule: RoundingRule = 'half-up'): number {
  if (rule === 'half-up') return roundHalfUp(value, decimals);
  if (rule !== 'truncate') throw new Error('Selecciona una regla de redondeo válida.');
  const factor = 10 ** decimals;
  const scaled = value * factor;
  return Math.trunc(scaled + Number.EPSILON * Math.max(1, Math.abs(scaled))) / factor;
}

// A minimum required grade must never be displayed below the mathematical threshold.
export function minimumRequiredGrade(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  const scaled = value * factor;
  return Math.ceil(scaled - Number.EPSILON * Math.max(1, Math.abs(scaled))) / factor;
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
  if (![config.minGrade, config.passGrade, config.maxGrade].every(Number.isFinite) || config.minGrade < 1 || config.maxGrade > 7) errors.push('Las notas deben estar entre 1,0 y 7,0.');
  if (config.rounding !== undefined && !['half-up', 'truncate'].includes(config.rounding)) errors.push('Selecciona una regla de redondeo válida.');
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
  return roundGrade(scoreToExactGrade(score, maxScore, config), config.decimals, config.rounding);
}

export function buildGradeScale(maxScore: number, config: GradeConfig = DEFAULT_GRADE_CONFIG) {
  if (!Number.isInteger(maxScore) || maxScore <= 0 || maxScore > 1000) throw new Error('El puntaje máximo debe ser un entero entre 1 y 1000.');
  return Array.from({ length: maxScore + 1 }, (_, score) => {
    const exact = scoreToExactGrade(score, maxScore, config);
    const grade = roundGrade(exact, config.decimals, config.rounding);
    return {
      score,
      percentage: (score / maxScore) * 100,
      exact,
      grade,
      passed: exact >= config.passGrade,
    };
  }).reverse();
}

export function validateChileGrade(value: number, label = 'La nota'): number {
  if (!Number.isFinite(value)) throw new Error(`${label} debe ser un número válido.`);
  if (value < 1 || value > 7) throw new Error(`${label} debe estar entre 1,0 y 7,0.`);
  return value;
}

export function average(values: number[]): number {
  if (!values.length) throw new Error('Agrega al menos una nota.');
  values.forEach((value, index) => validateChileGrade(value, `La nota ${index + 1}`));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export type WeightedItem = { grade: number; weight: number };

export function weightedAverage(items: WeightedItem[]): { average: number; totalWeight: number; contribution: number } {
  if (!items.length) throw new Error('Agrega al menos una nota.');
  for (const [index, item] of items.entries()) {
    validateChileGrade(item.grade, `La nota ${index + 1}`);
    if (!Number.isFinite(item.weight)) throw new Error('Revisa los porcentajes.');
    if (item.weight < 0) throw new Error('Los porcentajes no pueden ser negativos.');
    if (item.weight > 100) throw new Error('Un porcentaje individual no puede superar 100%.');
  }
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) throw new Error('El porcentaje total debe ser mayor que 0.');
  if (totalWeight > 100.11) throw new Error('La suma de porcentajes no puede superar 100%.');
  const total = items.reduce((sum, item) => sum + item.grade * item.weight, 0);
  return { average: total / totalWeight, totalWeight, contribution: total / 100 };
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
  validateChileGrade(currentAverage, 'El promedio actual');
  validateChileGrade(targetGrade, 'La nota objetivo');
  if (completedWeight < 0 || finalWeight <= 0) throw new Error('Los porcentajes deben ser positivos.');
  const total = completedWeight + finalWeight;
  if (Math.abs(total - 100) > 0.11) throw new Error('El porcentaje completado más el examen debe sumar 100%.');
  return (targetGrade * 100 - currentAverage * completedWeight) / finalWeight;
}


export function projectedFinalGrade(params: {
  currentAverage: number;
  completedWeight: number;
  finalGrade: number;
  finalWeight: number;
}): number {
  const { currentAverage, completedWeight, finalGrade, finalWeight } = params;
  if (![currentAverage, completedWeight, finalGrade, finalWeight].every(Number.isFinite)) throw new Error('Completa todos los campos con números válidos.');
  validateChileGrade(currentAverage, 'El promedio actual');
  validateChileGrade(finalGrade, 'La nota del examen');
  if (completedWeight < 0 || finalWeight < 0) throw new Error('Los porcentajes no pueden ser negativos.');
  const total = completedWeight + finalWeight;
  if (Math.abs(total - 100) > 0.11) throw new Error('El porcentaje completado más el examen debe sumar 100%.');
  return (currentAverage * completedWeight + finalGrade * finalWeight) / 100;
}
