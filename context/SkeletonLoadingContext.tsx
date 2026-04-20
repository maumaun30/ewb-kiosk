"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

interface SkeletonLoadingContextType {
  register: () => void;
  unregister: () => void;
  count: number;
}

const SkeletonLoadingContext = createContext<SkeletonLoadingContextType>({
  register: () => {},
  unregister: () => {},
  count: 0,
});

export function SkeletonLoadingProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const register = useCallback(() => setCount((c) => c + 1), []);
  const unregister = useCallback(() => setCount((c) => Math.max(0, c - 1)), []);
  return (
    <SkeletonLoadingContext.Provider value={{ register, unregister, count }}>
      {children}
    </SkeletonLoadingContext.Provider>
  );
}

export function SkeletonTracker({ children }: { children: React.ReactNode }) {
  const { register, unregister } = useContext(SkeletonLoadingContext);
  useEffect(() => {
    register();
    return () => unregister();
  }, [register, unregister]);
  return <>{children}</>;
}

export const useSkeletonLoading = () => useContext(SkeletonLoadingContext);
