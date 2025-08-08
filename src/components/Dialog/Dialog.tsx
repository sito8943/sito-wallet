import { useCallback, useEffect, useMemo, useState, MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

// @emotion/css
import { css } from "@emotion/css";

// types
import { DialogPropsType } from "./types.ts";

export const Dialog = (props: DialogPropsType) => {
  const { t } = useTranslation();
  const {
    title,
    children,
    handleClose,
    open = false,
    containerClassName = "",
    className = "",
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
      console.log(e?.currentTarget?.getAttribute("aria-label"));
      if (
        e?.currentTarget?.getAttribute("name") ===
        t("_accessibility:buttons.closeDialog")
      )
        handleClose();
    },
    [t, handleClose]
  );

  return createPortal(
    <div
      aria-label={t("_accessibility:ariaLabels.closeDialog")}
      aria-disabled={!open}
      onClick={bigHandleClose}
      className={`dialog-backdrop animated ${
        open ? "opened" : "closed"
      } ${styles} h-screen ${
        open ? "bg-base/20 backdrop-blur-xl" : "pointer-events-none"
      } ${containerClassName}`}
    >
      <div
        className={`dialog elevated animated ${
          open ? "opened" : "closed"
        } ${className}`}
      >
        <div className="flex items-center justify-between gap-2 mb-6 max-xs:mb-10">
          <h3 className="text-text text-xl">{title}</h3>
          <button
            disabled={!open}
            aria-disabled={!open}
            name={t("_accessibility:buttons.closeDialog")}
            aria-label={t("_accessibility:ariaLabels.closeDialog")}
            className="icon-button text-red-400"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};
