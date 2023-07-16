'use client';

import { useState } from "react";
import {singletonHook} from 'react-singleton-hook';

export interface IAsteroidLookupInfo {
  year: string;
  actualYear: number;
  recclass?: string;
  mass: number;
  fall: string;
  name: string;
  id: number;
  reclat: string;
  reclong: string;
}

export type AsteroidLookupResult = IAsteroidLookupInfo | null;
export type YearRange = {
  min: number;
  max: number;
  values: number[];
}

namespace Internal {
  export function yearFromISODate(raw: string): number {
    return new Date(raw).getFullYear()
  }
  export function extractYearsSorted(raw: any[]): number[] {
    const results = [];
    try { 
      for (const item of raw) {
        let year = yearFromISODate(item.year)
        if (!isNaN(year)) {
          results.push(year);
        }
      }
      return Array.from(new Set(results.sort((a,b) => a - b)));
    }
     catch (error) {
      return [1950, new Date().getFullYear() + 50];
    }
  }
}

let _rawData: any[] = [];

const useLookup = () => {
  const value = useState<AsteroidLookupResult>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [knownYears, setKnownYears] = useState<YearRange>();
  const [startYear, setStartYear] = useState(new Date().getUTCFullYear() - 100);
  const [endYear, setEndYear] = useState(new Date().getUTCFullYear());
  const [minMass, setMinMass] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const loadInitialData = async () => {
    if (isLoaded) return;
    setIsLoading(true);
    setIsError(false);
    const response = await fetch('/data.json');
    try {
      _rawData = await response.json();
      _rawData.forEach(entry => {
        entry.actualYear = Internal.yearFromISODate(entry.year)
        entry.mass = Number(entry.mass);
        if (isNaN(entry.mass)) entry.mass = 0;
      })
      _rawData.sort((a, b) => a.actualYear - b.actualYear)
      const knownYears = Internal.extractYearsSorted(_rawData);
      setKnownYears({
        max: Math.max(...knownYears),
        min: Math.min(...knownYears),
        values: knownYears
      });
      setIsLoading(false);
      setIsError(false);
      setIsLoaded(true);
    } catch (error) {
      setIsError(true);
      setIsLoaded(false);
      setIsLoading(false);
    }
  }

  const getByYearRange = (from: number, to: number, minMass: number = 0): IAsteroidLookupInfo[] => {
    const yearFrom = Math.min(Number(from), Number(to));
    const yearTo = Math.max(Number(from), Number(to));
    let result = _rawData.filter(entry => entry.actualYear >= yearFrom && entry.actualYear <= yearTo);
    // Mass filter
    if (minMass > 0) {
      result = result.filter(entry => parseFloat(entry.mass) >= minMass);
      if (!result.length) {
        const firstMatch = _rawData.find(entry => parseFloat(entry.mass) >= minMass);
        if (firstMatch) {
          if (firstMatch.actualYear < yearFrom || firstMatch.actualYear > yearTo) {
            setStartYear(firstMatch.actualYear);
            setEndYear(firstMatch.actualYear);
            result = getByYearRange(firstMatch.actualYear, firstMatch.actualYear, minMass);
            if (result.length) {
              setErrorMessage(`Mass located outside time frame. Your filters were updated accordingly`);
            }
          }
        }
      } else {
        setErrorMessage('');
      }
    }
    
    if (!result.length) {
      setErrorMessage(`Could not find anything. Try different filters`);
    }
    return result;
  }

  const getByYear = (year: number) => {
    return _rawData.filter((item: any) => item.actualYear === year)
  };

  return {
    value,
    isLoading,
    isLoaded,
    isError,
    getByYear,
    getByYearRange,
    loadInitialData,
    knownYears,
    startYear,
    setStartYear,
    endYear,
    setEndYear,
    minMass,
    setMinMass,
    errorMessage
  };
};

export const useAsteroidLookup = singletonHook(undefined, useLookup);