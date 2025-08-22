import { useCallback, useEffect, useState } from "react";

export function useScrollTrigger(offset: number) {
  const [triggered, setTriggered] = useState(false);

  const onScroll = useCallback(() => {
    const scrolled = window.scrollY > offset;
    setTriggered(scrolled);
  }, [offset]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return triggered;
}
