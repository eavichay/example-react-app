"use client";

import { useEffect, useState } from "react";

type UseAutocompleteOpts<T = any> = {
  thorttle?: number;
  initialQuery?: string;
  initialResult?: T[];
  dataProvider?: (query: string) => Promise<T[]> | T[];
};

const DEFAULT_THROTTLE = 350; // in milliseconds

const simpleToStringLookup = <T>(needle: string, haystack: T[]): T[] => {
  if (needle) {
    const query = needle.toLowerCase();
    return haystack.filter((item) => String(item).toLowerCase().includes(query));
  }
  return [];
};

export const useAutocomplete = <T = any>(
  dataset: T[],
  opts: UseAutocompleteOpts<T> = {}
) => {
  const [query, setQuery] = useState<string>(opts.initialQuery || '');
  const [result, setResult] = useState<T[]>(opts.initialResult || dataset);
  const [timerId, setTimerId] = useState(0);
  const provider = opts.dataProvider || simpleToStringLookup;

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }
    const newTimerId = setTimeout(async () => {
      if (!query) {
        setResult([]);
        return;
      }
      const newData = await provider(query, dataset);
      setResult(newData);
    }, opts.thorttle || DEFAULT_THROTTLE);
    setTimerId(newTimerId as unknown as number);
  }, [query]);

  return {
    query,
    setQuery,
    result,
  };
};
