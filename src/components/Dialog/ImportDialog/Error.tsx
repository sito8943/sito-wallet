import { useTranslation } from "@sito/dashboard-app";

type ImportDialogErrorProps = {
  message?: string | null;
  className?: string;
};

export function ImportDialogError(props: ImportDialogErrorProps) {
  const { message, className = "" } = props;
  const { t } = useTranslation();

  if (!message) return null;

  return (
    <p className={`text-red-600 text-sm mt-2 ${className}`}>
      {message || t("_messages:errors.parseFile", { defaultValue: "Failed to process file" })}
    </p>
  );
}

