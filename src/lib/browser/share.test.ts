import { describe, expect, it } from 'vitest';
import { shareOrCopy } from './share';

describe('shareOrCopy', () => {
  it('fails safely when browser share APIs are unavailable', async () => {
    expect(await shareOrCopy('NotaCL','https://notacl.example/')).toBe('failed');
  });
});
