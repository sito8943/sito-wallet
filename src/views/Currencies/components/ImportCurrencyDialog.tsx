import { useTranslation } from "react-i18next";

// components
import {
  FileInput,
  ImportDialog,
  ImportDialogPropsType,
} from "@sito/dashboard-app";

export function ImportCurrencyDialog(props: ImportDialogPropsType) {
  const { t } = useTranslation();

  return (
    <ImportDialog {...props}>
      <FileInput label={t("_accessibility:labels.file")} />
    </ImportDialog>
  );
}
