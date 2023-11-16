import { useEffect, useState } from "react";

export function usePersistentState<
  T extends string | number | boolean | null | undefined,
>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined")
      return defaultValue;

    const storedValue = localStorage.getItem(key);
    const parsedValue: unknown =
      storedValue !== null ? JSON.parse(storedValue) : null;

    if (
      typeof parsedValue === "string" ||
      typeof parsedValue === "number" ||
      typeof parsedValue === "boolean"
    )
      return parsedValue as T;

    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
