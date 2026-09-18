import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTransactionSearchRoute } from "../../lib/routes";
import { useTransactionSearch } from "./useTransactionSearch";

// "@sito/dashboard-app
import {
  useAuth,
  useTimeAge,
  isMac,
  toLocal,
  fromLocal,
} from "@sito/dashboard-app";
import { useFeatureFlags } from "providers";

// components
import { SearchResult } from "./SearchResult";
import { SearchInput } from "./SearchInput";

// sitemap
import { flattenSitemap, getFeatureFilteredSitemap } from "../../views/sitemap";

// types
import type { SearchResultType, SearchWrapperPropsType } from "./types";

import { SEARCH_FOCUSABLE_SELECTOR } from "./constants";
import { matchesSearch } from "./utils";

// config
import { config } from "../../config";

import "./styles.css";

export const SearchWrapper = (props: SearchWrapperPropsType) => {
  const { isModal = false, onNavigate } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { i18n } = useTranslation();
  const transactionSearch = useTransactionSearch(
    debouncedSearch,
    searching.trim() === debouncedSearch && (isModal || showResults),
  );
  const [recent, setRecent] = useState<SearchResultType[]>(() => {
    const stored = fromLocal(config.recentSearches);
    try {
      return stored ? (JSON.parse(stored) as SearchResultType[]) : [];
    } catch {
      toLocal(config.recentSearches, "");
    }
    return [];
  });
  const [searchResults, setSearchResults] = useState<SearchResultType[]>([]);

  const navigate = useNavigate();
  const { isFeatureEnabled } = useFeatureFlags();
  const { account } = useAuth();

  const { timeAge } = useTimeAge();

  const searchableSitemap = useMemo(() => {
    const routes = flattenSitemap(
      getFeatureFilteredSitemap(isFeatureEnabled, account),
      "",
    );
    return routes ?? [];
  }, [account, isFeatureEnabled]);

  const searchOnRoutes = useCallback(
    (searchInput: string) => {
      return searchableSitemap.filter((route) =>
        matchesSearch(searchInput, route.name),
      );
    },
    [searchableSitemap],
  );

  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setDebouncedSearch(value.trim());
      const results = searchOnRoutes(value);

      setSearchResults(
        results.map((route) => ({
          ...route,
          type: "page",
          onClick: () => {
            // Build new recent list with dedupe + cap
            const existing = [...recent];
            const filtered = existing.filter((r) => r.path !== route.path);
            const history = [
              {
                ...route,
                type: "page" as const,
                time: timeAge(new Date()),
              },
              ...filtered,
            ].slice(0, 4);

            setRecent(history);
            toLocal(config.recentSearches, history);
            onNavigate?.();
            navigate(route.path);

            setSearching("");
          },
        })),
      );
      setShowResults(!!value);
      setLoading(false);
    },
    // delay in ms
    300,
  );

  useEffect(() => {
    debounced(searching);
    return () => debounced.cancel();
  }, [searching, debounced]);

  const transactionResults: SearchResultType[] = transactionSearch.items.map(
    (transaction) => {
      const path = getTransactionSearchRoute(
        transaction.id,
        transaction.account?.id,
      );
      const date = transaction.date ? new Date(transaction.date) : null;
      const detail = [
        new Intl.NumberFormat(i18n.language).format(transaction.amount),
        transaction.account?.currency?.symbol,
        date && !Number.isNaN(date.getTime())
          ? date.toLocaleDateString(i18n.language)
          : null,
        transaction.account?.name,
      ]
        .filter(Boolean)
        .join(" · ");
      const item: SearchResultType = {
        type: "entity",
        path,
        name: transaction.description ?? "",
        detail,
      };
      return {
        ...item,
        onClick: () => {
          const history = [
            { ...item, time: timeAge(new Date()) },
            ...recent.filter((entry) => entry.path !== path),
          ].slice(0, 4);
          setRecent(history);
          toLocal(config.recentSearches, history);
          onNavigate?.();
          navigate(path);
          setSearching("");
          setShowResults(false);
        },
      };
    },
  );

  const openOnKeyCombination = useCallback(
    (e: KeyboardEvent) => {
      const primary = isMac() ? e.metaKey : e.ctrlKey;
      if (primary && e.shiftKey && e.key.toLowerCase() === "f") {
        inputRef?.current?.focus();
        if (!showResults && !isModal) setShowResults(true);
        e.preventDefault();
      }
    },
    [isModal, showResults],
  );

  useEffect(() => {
    window.addEventListener("keydown", openOnKeyCombination);
    return () => {
      window.removeEventListener("keydown", openOnKeyCombination);
    };
  }, [isModal, openOnKeyCombination]);

  const moveFocus = useCallback((direction: -1 | 1) => {
    const wrapper = wrapperRef.current;
    const input = inputRef.current;
    if (!wrapper || !input) return;

    const options = Array.from(
      wrapper.querySelectorAll<HTMLElement>(SEARCH_FOCUSABLE_SELECTOR),
    );
    const focusableElements = [input, ...options];
    const currentIndex = focusableElements.indexOf(
      document.activeElement as HTMLElement,
    );
    let nextIndex = direction === 1 ? 0 : focusableElements.length - 1;

    if (currentIndex >= 0) {
      nextIndex =
        (currentIndex + direction + focusableElements.length) %
        focusableElements.length;
    }

    focusableElements[nextIndex]?.focus();
  }, []);

  const handleKeyboardNavigation = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      event.preventDefault();
      if (!showResults && !isModal) setShowResults(true);
      moveFocus(event.key === "ArrowDown" ? 1 : -1);
    },
    [isModal, moveFocus, showResults],
  );

  return (
    <div
      ref={wrapperRef}
      role="search"
      className="search-wrapper"
      onKeyDown={handleKeyboardNavigation}
    >
      <SearchInput
        ref={inputRef}
        onClick={() => {
          if (!showResults) setShowResults(true);
        }}
        searching={searching}
        setSearching={(value) => {
          setLoading(true);
          setSearchResults([]);
          setSearching(value);
        }}
      />
      <SearchResult
        isModal={isModal}
        isLoading={loading || transactionSearch.isLoading}
        isError={transactionSearch.isError}
        searching={searching}
        items={[...searchResults, ...transactionResults]}
        recent={recent}
        show={showResults}
        onClearRecent={() => {
          setRecent([]);
          toLocal(config.recentSearches, "");
        }}
        onRecentClick={(item) => {
          const existing = [...recent];
          const filtered = existing.filter((r) => r.path !== item.path);
          const history = [
            {
              ...item,
              type: item.type,
              time: timeAge(new Date()),
            },
            ...filtered,
          ].slice(0, 10);

          setRecent(history);
          toLocal(config.recentSearches, history);
          onNavigate?.();
        }}
        onClose={() => setShowResults(false)}
      />
    </div>
  );
};
