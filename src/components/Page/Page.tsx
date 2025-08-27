import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Action, Badge, useTableOptions } from "@sito/dashboard";

// components
import { Loading } from "components";

// types
import { PagePropsType } from "./types.ts";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faFilter,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

// lib
import { BaseEntityDto } from "lib";

// hooks
import { GlobalActions } from "hooks";

// providers
import { queryClient } from "providers";

// components
import { PageHeader } from "./PageHeader.tsx";

// styles
import "./styles.css";

export const Page = <TEntity extends BaseEntityDto>(
  props: PagePropsType<TEntity>
) => {
  const {
    title,
    children,
    isLoading,
    addOptions,
    filterOptions,
    actions,
    queryKey,
    isAnimated = true,
    showBack = false,
  } = props;

  const { t } = useTranslation();

  const { countOfFilters } = useTableOptions();

  const parsedActions = useMemo(() => {
    const pActions = Array.isArray(actions) ? [...actions] : [];
    if (queryKey) {
      const refreshAction = {
        id: GlobalActions.Refresh,
        onClick: () => queryClient.invalidateQueries({ queryKey }),
        icon: <FontAwesomeIcon icon={faRotateLeft} />,
        tooltip: t("_pages:common.actions.refresh.text"),
      };
      pActions.unshift(refreshAction as Action<BaseEntityDto>);
    }
    if (addOptions) {
      const addAction = {
        ...(addOptions as Action<BaseEntityDto>),
        id: GlobalActions.Add,
        icon: <FontAwesomeIcon icon={faAdd} />,
      };
      pActions.unshift(addAction);
    }
    if (filterOptions) {
      const filterAction = {
        ...(filterOptions as Action<BaseEntityDto>),
        id: "filter",
        icon: <FontAwesomeIcon icon={faFilter} />,
        children: (
          <Badge
            className={`${countOfFilters > 0 ? "show" : "hide"} `}
            count={countOfFilters}
          />
        ),
      };
      pActions.push(filterAction);
    }
    return pActions;
  }, [actions, addOptions, countOfFilters, filterOptions, queryKey, t]);

  return (
    <main className="">
      <div className={`${isAnimated ? "appear" : ""} flex flex-col`}>
        <PageHeader showBack={showBack} actions={parsedActions} title={title} />
        <div className="px-5 py-3 h-full">
          {isLoading ? (
            <Loading containerClassName="flex justify-center items-center h-50" />
          ) : (
            children
          )}
        </div>
      </div>
      <button
        onClick={() => addOptions?.onClick?.()}
        className="submit button icon-button fab primary min-xs:!hidden"
      >
        <FontAwesomeIcon icon={faAdd} />
      </button>
    </main>
  );
};
