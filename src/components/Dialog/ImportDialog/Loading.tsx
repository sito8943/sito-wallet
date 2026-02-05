import { Loading, useTranslation } from "@sito/dashboard-app";

type ImportDialogLoadingProps = {
  message?: string;
  className?: string;
};

export function ImportDialogLoading(props: ImportDialogLoadingProps) {
  const { message, className = "" } = props;
  const { t } = useTranslation();

  return (
    <div className={`mt-4 flex items-center gap-3 text-sm text-gray-600 ${className}`}>
      <Loading loaderClass="w-5 h-5" />
      <span>{message ?? t("_messages:loading.processingFile", { defaultValue: "Processing file..." })}</span>
    </div>
  );
}

