import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

// types
import { GlobalActions, UseExportAction } from "hooks";

export const useExportAction = <TRow extends object>(
  props: UseExportAction<TRow>
) => {
  const { t } = useTranslation();

  const { data = [], hidden = false, disabled = false } = props;

  const action = useCallback(
    () => ({
      id: GlobalActions.Export,
      hidden: hidden,
      disabled: disabled,
      icon: <FontAwesomeIcon icon={faDownload} />,
      tooltip: t("_pages:common.actions.export.text"),
      onClick: () => {
        const json = JSON.stringify(data, null, 2);

        // Crear un blob
        const blob = new Blob([json], { type: "application/json" });

        // Crear una URL temporal
        const url = URL.createObjectURL(blob);

        // Crear un link invisible
        const link = document.createElement("a");
        link.href = url;
        link.download = "data.json"; // nombre del archivo
        link.click();

        // Liberar memoria
        URL.revokeObjectURL(url);
      },
    }),
    [data, disabled, hidden, t]
  );

  return {
    action,
  };
};
