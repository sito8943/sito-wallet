import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faCloudArrowDown,
} from "@fortawesome/free-solid-svg-icons";

// types
import { GlobalActions, UseExportAction } from "hooks";

export const useExportAction = (props: UseExportAction) => {
  const { t } = useTranslation();

  const {
    isLoading = false,
    onClick,
    hidden = false,
    disabled = false,
  } = props;

  const action = useCallback(
    () => ({
      id: GlobalActions.Export,
      hidden: hidden,
      disabled: disabled,
      icon: (
        <FontAwesomeIcon
          icon={isLoading ? faCircleNotch : faCloudArrowDown}
          className={`${isLoading ? "rotate" : ""}`}
        />
      ),
      tooltip: t("_pages:common.actions.export.text"),
      onClick: onClick,
    }),
    [disabled, hidden, isLoading, onClick, t]
  );

  return {
    action,
  };
};
