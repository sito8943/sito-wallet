import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// @use-gesture/react
import { useDrag } from "@use-gesture/react";

// constants
import {
  SLIDE_GAP,
  SLIDE_PEEK_RATIO,
  STICKY_TOP_PX,
  SWIPE_DISTANCE_THRESHOLD,
  SWIPE_VELOCITY_THRESHOLD,
  TAP_SLOP,
} from "./constants";

// types
import type { UseAccountSliderParams } from "./types";

// Drag/snap engine for the account slider. Position is derived from the
// parent-controlled `activeIndex` plus a local drag offset that resets on
// release; on release we snap to the neighbouring index (distance or velocity)
// and report it back via `onIndexChange`. A separate sentinel controls the
// sticky summary so it appears after the card area has scrolled away.
export function useAccountSlider({
  count,
  activeIndex,
  onIndexChange,
}: UseAccountSliderParams) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stickyTriggerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  // Set true once a gesture moves past the tap slop, so a trailing click can be
  // ignored (a swipe should not also navigate via the slide's onClick).
  const movedRef = useRef(false);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const el = stickyTriggerRef.current;
      if (!el) {
        setShowSticky(false);
        return;
      }
      setShowSticky(
        count > 0 && el.getBoundingClientRect().top <= STICKY_TOP_PX,
      );
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [count]);

  const slideWidth = width ? width * SLIDE_PEEK_RATIO : 0;
  const step = slideWidth + SLIDE_GAP;
  const inset = (width - slideWidth) / 2;
  const translateX = inset - activeIndex * step + drag;

  const bind = useDrag(
    ({
      first,
      active,
      last,
      movement: [mx],
      velocity: [vx],
      direction: [dx],
    }) => {
      if (first) movedRef.current = false;
      if (Math.abs(mx) > TAP_SLOP) movedRef.current = true;

      if (active) {
        setDragging(true);
        setDrag(mx);
        return;
      }

      if (last) {
        const passedDistance =
          Math.abs(mx) > slideWidth * SWIPE_DISTANCE_THRESHOLD;
        const passedVelocity = vx > SWIPE_VELOCITY_THRESHOLD;
        let next = activeIndex;
        if ((passedDistance || passedVelocity) && dx !== 0) {
          next = Math.max(
            0,
            Math.min(count - 1, activeIndex + (dx < 0 ? 1 : -1)),
          );
        }
        setDrag(0);
        setDragging(false);
        if (next !== activeIndex) onIndexChange(next);
      }
    },
    { axis: "x", filterTaps: true },
  );

  // Returns whether the just-finished gesture was a drag (so a trailing click
  // can bail out), clearing the flag for the next gesture.
  const consumeMoved = useCallback(() => {
    const moved = movedRef.current;
    movedRef.current = false;
    return moved;
  }, []);

  return {
    viewportRef,
    stickyTriggerRef,
    bind,
    slideWidth,
    translateX,
    dragging,
    showSticky,
    consumeMoved,
  };
}
