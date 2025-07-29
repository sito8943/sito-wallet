import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// components
import { Actions, Loading } from "components";

// types
import { PagePropsType } from "./types.ts";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faArrowLeft,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

// lib
import { BaseEntityDto } from "lib";
import { GlobalActions } from "hooks";
import { queryClient } from "providers";

export const Page = <TEntity extends BaseEntityDto>(
  props: PagePropsType<TEntity>
) => {
  const {
    title,
    children,
    isLoading,
    addOptions,
    actions,
    queryKey,
    animated = true,
    showBack = false,
  } = props;

  const { t } = useTranslation();

  const navigate = useNavigate();

  const parsedActions = useMemo(() => {
    const pActions = Array.isArray(actions) ? actions : [];
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

    return pActions;
  }, [actions, addOptions, queryKey, t]);

  return (
    <main className="">
      <div className={`${animated ? "apparition" : ""} flex flex-col gap-5`}>
        <div className="flex items-center justify-between p-5 bg-base">
          <div className="flex gap-2 items-center justify-start">
            {showBack && (
              <button
                onClick={() => navigate(-1)}
                className="action"
                name={t("_accessibility:buttons.back")}
                data-tooltip-id="tooltip"
                data-tooltip-content={t("_accessibility:buttons.back")}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
          <Actions actions={parsedActions ?? []} />
        </div>
        <div className="p-5 h-full">
          {isLoading ? (
            <Loading containerClassName="flex justify-center items-center h-50" />
          ) : (
            children
          )}
        </div>
      </div>
    </main>
  );
};
