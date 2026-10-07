import { afterEach, describe, expect, it, vi } from 'vitest';
import { shareOrCopy } from './share';

describe('shareOrCopy', () => {
  afterEach(()=>vi.unstubAllGlobals());

  it('falls back to clipboard when native sharing fails', async () => {
    const writeText=vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator',{share:vi.fn().mockRejectedValue(new Error('unavailable')),clipboard:{writeText}});
    expect(await shareOrCopy('NotaCL','https://notacl.example/#notas=5')).toBe('copied');
    expect(writeText).toHaveBeenCalledWith('https://notacl.example/#notas=5');
  });

  it('does not copy when the user cancels native sharing', async () => {
    const writeText=vi.fn();
    vi.stubGlobal('navigator',{share:vi.fn().mockRejectedValue(new DOMException('cancelled','AbortError')),clipboard:{writeText}});
    expect(await shareOrCopy('NotaCL','https://notacl.example/')).toBe('cancelled');
    expect(writeText).not.toHaveBeenCalled();
  });

  it('puts the share state in the address bar for manual copying', async () => {
    const replaceState=vi.fn();
    vi.stubGlobal('navigator',{});
    vi.stubGlobal('window',{history:{replaceState}});
    expect(await shareOrCopy('NotaCL','https://notacl.example/#notas=5')).toBe('failed');
    expect(replaceState).toHaveBeenCalledWith(null,'','https://notacl.example/#notas=5');
  });
  it('fails safely when browser share APIs are unavailable', async () => {
    expect(await shareOrCopy('NotaCL','https://notacl.example/')).toBe('failed');
  });
});
