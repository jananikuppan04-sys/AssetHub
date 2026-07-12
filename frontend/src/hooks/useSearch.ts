import { useCallback, useState } from 'react';
import { useDebounce } from './useDebounce';

interface UseSearchReturn {
  searchQuery: string;
  debouncedQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export function useSearch(debounceMs = 400): UseSearchReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  const clearSearch = useCallback(() => setSearchQuery(''), []);

  return { searchQuery, debouncedQuery, setSearchQuery, clearSearch };
}
