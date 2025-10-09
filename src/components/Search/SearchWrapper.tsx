import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useNavigate } from "react-router-dom";
import { stringSimilarity } from "string-similarity-js";

// hooks
import { useTimeAge } from "hooks";

// utils
import { toLocal, fromLocal } from "lib";

// components
import { SearchResult } from "./SearchResult";
import { SearchInput } from "./SearchInput";

// sitemap
import { flattenSitemap, sitemap } from "../../views/sitemap";

// types
import { SearchResultType } from "./types";
import { config } from "../../config";

export const SearchWrapper = () => {
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState("");
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

  const { timeAge } = useTimeAge();

  const searchableSitemap = useMemo(() => {
    const routes = flattenSitemap(sitemap, "");
    return routes ?? [];
  }, []);

  const searchOnRoutes = useCallback(
    (searchInput: string) => {
      const routes = searchableSitemap.filter((route) => {
        const result = stringSimilarity(searchInput, route.name);
        if (result >= 0.3) return true;
      });
      return routes;
    },
    [searchableSitemap]
  );

  const debounced = useDebouncedCallback(
    // function
    (value) => {
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
            navigate(route.path);

            setSearching("");
          },
        }))
      );
      setShowResults(!!value);
      setLoading(false);
    },
    // delay in ms
    300
  );

  useEffect(() => {
    setLoading(true);
    debounced(searching);
  }, [searching, debounced]);

  return (
    <div role="search" className="relative">
      <SearchInput
        onClick={() => {
          if (!showResults) setShowResults(true);
        }}
        searching={searching}
        setSearching={setSearching}
      />
      <SearchResult
        isLoading={loading}
        searching={searching}
        items={searchResults}
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
              type: "page" as const,
              time: timeAge(new Date()),
            },
            ...filtered,
          ].slice(0, 10);

          setRecent(history);
          toLocal(config.recentSearches, history);
        }}
        onClose={() => setShowResults(false)}
      />
    </div>
  );
};
