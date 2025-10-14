import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Action, Badge, useTableOptions } from "@sito/dashboard";
import { queryClient, GlobalActions } from "@sito/dashboard-app";

// components
import { Loading } from "components";
import { IconButton } from "@sito/dashboard-app";

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
import { BaseEntityDto } from "@sito/dashboard-app";

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
    addOptions,
    filterOptions,
    actions,
    queryKey,
    isLoading = false,
    isAnimated = true,
    showBackButton = false,
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
      <div className={`flex flex-col`}>
        <PageHeader
          showBackButton={showBackButton}
          actions={parsedActions}
          title={title}
        />
        <div className={`px-5 py-3 h-full ${isAnimated ? "appear" : ""}`}>
          {isLoading ? (
            <Loading containerClassName="flex justify-center items-center h-50" />
          ) : (
            children
          )}
        </div>
      </div>
      <IconButton
        icon={faAdd}
        color="primary"
        variant="submit"
        onClick={() => addOptions?.onClick?.()}
        className="button fab min-xs:!hidden"
      />
    </main>
  );
};
