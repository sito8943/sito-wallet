import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

// types
import { GlobalActions, UseExportAction } from "hooks";

export const useExportAction = <TRow extends object>(
  props: UseExportAction
) => {
  const { t } = useTranslation();

  const { entity = "", hidden = false, disabled = false } = props;

  const action = useCallback(
    () => ({
      id: GlobalActions.Export,
      hidden: hidden,
      disabled: disabled,
      icon: <FontAwesomeIcon icon={faDownload} />,
      tooltip: t("_pages:common.actions.export.text"),
      onClick: (data: TRow) => {
        const json = JSON.stringify(data, null, 2);

        const blob = new Blob([json], { type: "application/json" });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${entity}.json`;
        link.click();

        URL.revokeObjectURL(url);
      },
    }),
    [disabled, entity, hidden, t]
  );

  return {
    action,
  };
};
