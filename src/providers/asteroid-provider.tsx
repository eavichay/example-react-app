'use client';

import { useAsteroidLookup } from "@/app/model/useAsteroidLookup";
import { PropsWithChildren } from "react";

export const WithDataProvider = (props: PropsWithChildren<{}>) => {
    const {loadInitialData, isLoaded, isLoading, isError} = useAsteroidLookup() || {};
  
    if (!isLoaded && !isLoading && !isError) {
      loadInitialData?.();
      return <>Loading...</>
    }
  
    if (isError) {
      return <>Error Loading Data...</>
    }
  
    return <>{props.children}</>;
  }