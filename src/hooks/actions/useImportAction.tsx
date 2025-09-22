import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleNotch,
  faCloudUpload,
} from "@fortawesome/free-solid-svg-icons";

// types
import { GlobalActions, UseImportAction } from "hooks";

export const useImportAction = (props: UseImportAction) => {
  const { t } = useTranslation();

  const {
    onClick,
    hidden = false,
    disabled = false,
    isLoading = false,
  } = props;

  const action = useCallback(
    () => ({
      id: GlobalActions.Import,
      hidden: hidden,
      disabled: disabled,
      icon: (
        <FontAwesomeIcon
          className="primary"
          icon={isLoading ? faCircleNotch : faCloudUpload}
        />
      ),
      tooltip: t("_pages:common.actions.import.text"),
      onClick: onClick,
    }),
    [disabled, hidden, isLoading, onClick, t]
  );

  return {
    action,
  };
};
