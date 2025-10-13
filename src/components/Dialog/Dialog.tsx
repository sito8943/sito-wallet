import { useCallback, useEffect, useMemo, useState, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

// icons
import { faClose } from "@fortawesome/free-solid-svg-icons";

// @emotion/css
import { css } from "@emotion/css";

// types
import { DialogPropsType } from "./types.ts";

// components
import { IconButton } from "components";

export const Dialog = (props: DialogPropsType) => {
  const { t } = useTranslation();
  const {
    title,
    children,
    handleClose,
    open = false,
    containerClassName = "",
    className = "",
    animationClass = "appear",
  } = props;

  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const onKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose();
    },
    [open, handleClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyPress);
    return () => {
      window.removeEventListener("keydown", onKeyPress);
    };
  }, [onKeyPress]);

  const onWindowsResize = useCallback(() => {
    setWindowSize(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", onWindowsResize);
    return () => {
      window.removeEventListener("resize", onWindowsResize);
    };
  }, [onWindowsResize]);

  const styles = useMemo(() => css({ width: `${windowSize}px` }), [windowSize]);

  const bigHandleClose = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (
        e?.currentTarget?.getAttribute("name") ===
        t("_accessibility:buttons.closeDialog")
      )
        handleClose();
    },
    [t, handleClose]
  );

  useEffect(() => {
    const toggleBodyOverflow = (open: boolean) => {
      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    };
    toggleBodyOverflow(open);
    return () => {
      toggleBodyOverflow(open);
    };
  }, [open]);

  return createPortal(
    <div
      aria-label={t("_accessibility:ariaLabels.closeDialog")}
      aria-disabled={!open}
      onClick={bigHandleClose}
      className={`dialog-backdrop animated ${
        open ? `opened ${animationClass}` : "closed"
      } ${styles} h-screen ${
        open ? "bg-base/20 backdrop-blur-xl" : "pointer-events-none"
      } ${containerClassName}`}
    >
      <div
        className={`dialog elevated animated ${
          open ? `opened ${animationClass}` : "closed"
        } ${className}`}
      >
        <div className="dialog-header">
          <h3 className="text-text text-xl">{title}</h3>
          <IconButton
            icon={faClose}
            disabled={!open}
            aria-disabled={!open}
            onClick={handleClose}
            className="icon-button text-red-400"
            name={t("_accessibility:buttons.closeDialog")}
            aria-label={t("_accessibility:ariaLabels.closeDialog")}
          />
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
