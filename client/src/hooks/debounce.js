import { useState, useEffect } from "react";

export const useDebounce = (term, delay = 500) => {
  const [debounceValue, setDebounceValue] = useState(term);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(term);
    }, delay)

    return () => clearTimeout(timer);
  },[term, delay])

  return debounceValue;
}