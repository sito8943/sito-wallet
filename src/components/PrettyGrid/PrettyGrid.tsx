import { useEffect, useRef } from "react";

// @sito/dashboard
import {
  useTranslation,
  Loading,
  BaseEntityDto,
  Empty,
} from "@sito/dashboard-app";

// types
import { PrettyGridPropsType } from "./types";

// styles
import "./styles.css";

export const PrettyGrid = <TDto extends BaseEntityDto>(
  props: PrettyGridPropsType<TDto>,
) => {
  const { t } = useTranslation();

  const {
    className = "",
    itemClassName = "",
    loading = false,
    emptyComponent = null,
    emptyMessage = t("_accessibility:messages.empty"),
    renderComponent,
    data = [],
    hasMore = false,
    loadingMore = false,
    onLoadMore,
    loadMoreComponent = null,
    observerRootMargin = "0px 0px 200px 0px",
    observerThreshold = 0,
  } = props;

  const sentinelRef = useRef<HTMLLIElement | null>(null);
  const waitingForNextPageRef = useRef(false);
  const canLoadMore = !!onLoadMore && hasMore;

  useEffect(() => {
    if (!loadingMore) waitingForNextPageRef.current = false;
  }, [loadingMore]);

  useEffect(() => {
    if (!canLoadMore || loading) return;

    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (loadingMore || waitingForNextPageRef.current) return;

        waitingForNextPageRef.current = true;
        void onLoadMore?.();
      },
      {
        root: null,
        rootMargin: observerRootMargin,
        threshold: observerThreshold,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    canLoadMore,
    data?.length,
    loading,
    loadingMore,
    observerRootMargin,
    observerThreshold,
    onLoadMore,
  ]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {data?.length ? (
        <ul className={`pretty-grid-main ${className}`}>
          {data?.map((item) => (
            <li className={`pretty-grid-item ${itemClassName}`} key={item.id}>
              {renderComponent(item)}
            </li>
          ))}
          {canLoadMore ? (
            <li
              aria-hidden={!loadingMore}
              className="pretty-grid-load-more"
              ref={sentinelRef}
            >
              {loadingMore ? loadMoreComponent : null}
            </li>
          ) : null}
        </ul>
      ) : (
        <>
          {emptyComponent ? emptyComponent : <Empty message={emptyMessage} />}
        </>
      )}
    </>
  );
};
