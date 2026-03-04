// context/NavigationContext.tsx
"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const NavigationContext = createContext<{ getPreviousPath: () => string | null }>({
  getPreviousPath: () => null,
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const historyStack = useRef<string[]>([]);

  useEffect(() => {
    historyStack.current = [...historyStack.current, pathname];
  }, [pathname]);

  const getPreviousPath = () => {
    const stack = historyStack.current;
    return stack.length >= 2 ? stack[stack.length - 2] : null;
  };

  return (
    <NavigationContext.Provider value={{ getPreviousPath }}>
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);