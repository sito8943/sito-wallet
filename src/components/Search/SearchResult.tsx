import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Loading, IconButton } from "@sito/dashboard-app";

// icons
import { faBroom } from "@fortawesome/free-solid-svg-icons";

// types
import { SearchResultPropsType } from "./types";

// components
import PageResult from "./PageResult";

export const SearchResult = (props: SearchResultPropsType) => {
  const {
    items,
    recent,
    show,
    isLoading,
    searching,
    onClose,
    onClearRecent,
    onRecentClick,
    isModal = false,
  } = props;

  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const onEscapePress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) {
        onClose();
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [show, onClose]
  );
  const onClickToHide = useCallback(
    (e: MouseEvent) => {
      if (!show) return;
      const target = e.target as Node | null;
      const container = containerRef.current;
      // If click is outside the container, close
      if (container && target && !container.contains(target)) {
        onClose();
      }
    },
    [show, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", onEscapePress);
    return () => {
      document.removeEventListener("keydown", onEscapePress);
    };
  }, [onEscapePress]);

  useEffect(() => {
    if (!show) return;
    document.addEventListener("click", onClickToHide);
    return () => {
      document.removeEventListener("click", onClickToHide);
    };
  }, [onClickToHide, show]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col animated gap-2 ${
        !isModal ? "z-10 bg-base elevated absolute" : ""
      } w-full p-2 rounded-md mt-2 ${
        show || isModal
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      {!items.length && !!searching.length && !isLoading && (
        <p className="text-sm">{t("_pages:search.noResult")}</p>
      )}
      {isLoading && (
        <div className="flex gap-2 items-center justify-start pl-1">
          <Loading className="mt-0.5" loaderClass="w-10 h-10" />
        </div>
      )}
      {!!items.length && !!searching.length && (
        <ul className="text-sm">
          {items.map((item) => (
            <li key={item.path ?? `${item.name}-${item.time}`}>
              {item.type === "page" && (
                <PageResult
                  onClick={item.onClick}
                  path={item.path}
                  name={item.name}
                  time={item.time}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      <>
        {!!recent?.length && (
          <div className="flex items-center justify-between px-1">
            <p className="text-xs uppercase tracking-wide opacity-70">
              {t("_pages:search.recentSearches")}
            </p>
            <IconButton
              icon={faBroom}
              type="button"
              onClick={() => onClearRecent?.()}
              data-tooltip-id="tooltip"
              data-tooltip-content={t("_pages:search.clearRecent")}
            />
          </div>
        )}
        {recent?.length ? (
          <ul>
            {recent.map((item, index) => (
              <li key={item.path ?? `${item.name}-${item.time ?? index}`}>
                {item.type === "page" && (
                  <PageResult
                    path={item.path}
                    name={item.name}
                    time={item.time}
                    onClick={() => onRecentClick?.(item)}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm text-text-muted/50">
            {t("_pages:search.noRecentSearches")}
          </p>
        )}
      </>
    </div>
  );
};
