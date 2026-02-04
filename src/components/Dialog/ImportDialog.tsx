import {
  useTranslation,
  Dialog,
  DialogActions,
  DialogPropsType,
  BaseEntityDto,
} from "@sito/dashboard-app";
import { useEffect, useState } from "react";
import { FileInput } from "../FileInput/FileInput";

export interface ImportDialogPropsType<EntityDto extends BaseEntityDto>
  extends DialogPropsType {
  handleSubmit: (file: File) => void;
  isLoading?: boolean;
  fileProcessor?: (file: File) => Promise<EntityDto[]>;
  onFileProcessed?: (items: EntityDto[]) => void;
}

export const ImportDialog = <EntityDto extends BaseEntityDto>(
  props: ImportDialogPropsType<EntityDto>
) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewItems, setPreviewItems] = useState<EntityDto[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const {
    children,
    handleSubmit,
    handleClose,
    isLoading = false,
    fileProcessor,
    onFileProcessed,
    open,
    ...rest
  } = props;

  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreviewItems(null);
      setParseError(null);
      setInputKey((k) => k + 1);
    }
  }, [open]);

  return (
    <Dialog {...rest} open={open} handleClose={handleClose}>
      <FileInput
        key={inputKey}
        onClear={() => {
          setFile(null);
          setPreviewItems(null);
          setParseError(null);
        }}
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            setFile(null);
            setPreviewItems(null);
            setParseError(null);
            return;
          }
          if (fileProcessor) {
            fileProcessor(file)
              .then((items) => {
                setPreviewItems(items ?? []);
                setParseError(null);
                onFileProcessed?.(items ?? []);
              })
              .catch((err) => {
                console.error(err);
                setPreviewItems(null);
                const message =
                  err instanceof Error ? err.message : "Failed to parse file";
                setParseError(message);
              });
          }
          setFile(file);
        }}
        label={t("_accessibility:labels.file")}
      />
      {!!parseError && (
        <p className="text-red-600 text-sm mt-2">{parseError}</p>
      )}
      {!!previewItems && previewItems.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Preview: {previewItems.length} items
          </p>
          <pre className="mt-2 max-h-56 overflow-auto rounded bg-gray-100 p-3 text-xs">
            {(() => {
              // Show only the first 5 items to keep it compact
              const limited = previewItems.slice(0, 5);
              return JSON.stringify(limited, null, 2);
            })()}
          </pre>
        </div>
      )}
      {children}
      <DialogActions
        primaryText={t("_accessibility:buttons.ok")}
        cancelText={t("_accessibility:buttons.cancel")}
        onPrimaryClick={() => {
          const canSubmit =
            !fileProcessor || (!!previewItems && previewItems.length > 0);
          if (canSubmit && file) handleSubmit(file);
        }}
        onCancel={handleClose}
        isLoading={isLoading}
        disabled={!!isLoading}
        primaryType="button"
        containerClassName="mt-5"
        primaryName={t("_accessibility:buttons.ok")}
        primaryAriaLabel={t("_accessibility:ariaLabels.ok")}
        cancelName={t("_accessibility:buttons.cancel")}
        cancelAriaLabel={t("_accessibility:ariaLabels.cancel")}
      />
    </Dialog>
  );
};
