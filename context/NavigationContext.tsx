// context/NavigationContext.tsx
"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const NavigationContext = createContext<{
  getPreviousPath: () => string | null;
  goBack: () => string | null;
}>({
  getPreviousPath: () => null,
  goBack: () => null,
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const historyStack = useRef<string[]>([]);

  useEffect(() => {
    const stack = historyStack.current;
    // Don't push if it's the same path (e.g. re-renders)
    if (stack[stack.length - 1] !== pathname) {
      historyStack.current = [...stack, pathname];
    }
  }, [pathname]);

  const getPreviousPath = () => {
    const stack = historyStack.current;
    return stack.length >= 2 ? stack[stack.length - 2] : null;
  };

  // Pops current path and returns the previous one
  const goBack = () => {
    const stack = historyStack.current;
    if (stack.length >= 2) {
      historyStack.current = stack.slice(0, -1);
      return stack[stack.length - 2];
    }
    return null;
  };

  return (
    <NavigationContext.Provider value={{ getPreviousPath, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);