import { useCallback, useRef, useState } from "react";
import type { MouseEventHandler, ReactNode } from "react";
import { useDrag } from "@use-gesture/react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classNames } from "@sito/dashboard-app";

import { isMobileViewport } from "./utils";

import "./styles.css";

type SwipeToDeleteProps = {
  children: ReactNode;
  enabled: boolean;
  deleteOpen?: boolean;
  onDeleteTrigger: () => void;
  onSwipeStart?: () => void;
  shellClassName?: string;
  foregroundClassName?: string;
};

export function SwipeToDelete(props: SwipeToDeleteProps) {
  const {
    children,
    enabled,
    deleteOpen = false,
    onDeleteTrigger,
    onSwipeStart,
    shellClassName,
    foregroundClassName,
  } = props;

  const swipeShellRef = useRef<HTMLDivElement>(null);
  const swipeTriggeredRef = useRef(false);
  const swipeMovedRef = useRef(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const canSwipe = enabled && isMobileViewport();

  const resetSwipeState = useCallback(() => {
    setSwipeOffset(0);
    setIsSwiping(false);

    window.setTimeout(() => {
      swipeMovedRef.current = false;
      swipeTriggeredRef.current = false;
    }, 0);
  }, []);

  const handleClickCapture = useCallback<MouseEventHandler<HTMLDivElement>>(
    (event) => {
      if (!swipeMovedRef.current && !swipeTriggeredRef.current) return;

      event.preventDefault();
      event.stopPropagation();
      resetSwipeState();
    },
    [resetSwipeState],
  );

  const bindSwipe = useDrag(
    ({ down, movement: [movementX], last, cancel }) => {
      if (!canSwipe) return;

      const shellWidth = swipeShellRef.current?.offsetWidth ?? 0;
      if (!shellWidth) return;

      const nextOffset = Math.max(0, Math.min(movementX, shellWidth));
      const reachedDeleteThreshold = nextOffset >= shellWidth * 0.5;

      if (nextOffset > 8) {
        onSwipeStart?.();
        swipeMovedRef.current = true;
      }

      if (down) {
        setIsSwiping(true);
        setSwipeOffset(nextOffset);

        if (reachedDeleteThreshold && !swipeTriggeredRef.current) {
          swipeTriggeredRef.current = true;
          setSwipeOffset(0);
          setIsSwiping(false);
          cancel();
          onDeleteTrigger();
          swipeMovedRef.current = false;
          swipeTriggeredRef.current = false;
        }

        return;
      }

      resetSwipeState();
      if (last) return;
    },
    {
      axis: "x",
      filterTaps: true,
    },
  );

  if (!canSwipe && !deleteOpen) {
    return children;
  }

  return (
    <div
      ref={swipeShellRef}
      className={classNames("swipe-delete-shell", shellClassName)}
    >
      {canSwipe || deleteOpen ? (
        <div
          className="swipe-delete-background"
          style={{ width: deleteOpen ? "50%" : `${swipeOffset}px` }}
          aria-hidden="true"
        >
          <FontAwesomeIcon
            icon={faTrash}
            className="swipe-delete-background-icon"
          />
        </div>
      ) : null}
      <div
        {...(canSwipe ? bindSwipe() : {})}
        onClickCapture={handleClickCapture}
        className={classNames("swipe-delete-foreground", foregroundClassName)}
        style={{
          transform:
            canSwipe || deleteOpen
              ? deleteOpen
                ? "translateX(50%)"
                : `translateX(${swipeOffset}px)`
              : undefined,
          transitionDuration: isSwiping ? "0ms" : undefined,
          touchAction: canSwipe ? "pan-y" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
