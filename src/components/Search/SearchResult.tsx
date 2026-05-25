import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Loading, IconButton, classNames } from "@sito/dashboard-app";

// icons
import { faBroom } from "@fortawesome/free-solid-svg-icons";

// types
import type { SearchResultPropsType } from "./types";

// components
import PageResult from "./PageResult";

import "./styles.css";

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
    [show, onClose],
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
    [show, onClose],
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
      className={classNames(
        "search-results animated",
        !isModal && "search-results--dropdown elevated",
        show || isModal
          ? "search-results--open"
          : "search-results--closed",
      )}
    >
      {!items.length && !!searching.length && !isLoading && (
        <p className="search-results-empty">{t("_pages:search.noResult")}</p>
      )}
      {isLoading && (
        <div className="search-results-loading">
          <Loading
            className="search-results-loader"
            loaderClass="search-results-loader-icon"
          />
        </div>
      )}
      {!!items.length && !!searching.length && (
        <ul className="search-results-list">
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
          <div className="search-results-header">
            <p className="search-results-title">
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
          <ul className="search-results-list">
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
          <p className="search-results-empty-recent">
            {t("_pages:search.noRecentSearches")}
          </p>
        )}
      </>
    </div>
  );
};
