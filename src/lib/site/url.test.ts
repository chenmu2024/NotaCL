import { describe, expect, it } from 'vitest';
import { normalizeSiteOrigin } from './url';

describe('normalizeSiteOrigin', () => {
  it('normalizes a valid HTTPS origin and removes the trailing slash', () => {
    expect(normalizeSiteOrigin(' https://notacl.cl/ ')).toBe('https://notacl.cl');
    expect(normalizeSiteOrigin('https://www.notacl.cl')).toBe('https://www.notacl.cl');
  });

  it('fails closed for invalid or non-origin values', () => {
    expect(normalizeSiteOrigin('')).toBe('');
    expect(normalizeSiteOrigin('http://notacl.cl')).toBe('');
    expect(normalizeSiteOrigin('https://notacl.cl/path')).toBe('');
    expect(normalizeSiteOrigin('https://notacl.cl/?preview=1')).toBe('');
    expect(normalizeSiteOrigin('notacl.cl')).toBe('');
    expect(normalizeSiteOrigin('https://notacl.pages.dev')).toBe('');
    expect(normalizeSiteOrigin('https://preview.notacl.pages.dev')).toBe('');
    expect(normalizeSiteOrigin('https://notacl.vercel.app')).toBe('');
    expect(normalizeSiteOrigin('https://localhost')).toBe('');
  });
});
