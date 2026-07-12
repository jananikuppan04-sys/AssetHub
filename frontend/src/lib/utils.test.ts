import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge tailwind classes', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
    });

    it('should resolve tailwind conflicts', () => {
      // tailwind-merge resolves conflicts, the later class wins
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4');
      expect(cn('text-sm', 'text-lg')).toBe('text-lg');
    });

    it('should handle conditional classes via clsx', () => {
      expect(cn('font-bold', true && 'italic', false && 'underline')).toBe('font-bold italic');
    });

    it('should handle arrays and undefined', () => {
      expect(cn(['flex', 'items-center'], undefined, null, 'gap-2')).toBe('flex items-center gap-2');
    });
  });
});
