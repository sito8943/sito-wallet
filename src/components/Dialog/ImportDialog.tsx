import {
  useTranslation,
  Dialog,
  DialogActions,
  DialogPropsType,
  BaseEntityDto,
} from "@sito/dashboard-app";
import { useEffect, useState } from "react";
import { FileInput } from "../FileInput/FileInput";
import { ImportDialogLoading } from "./ImportDialog/Loading";
import { ImportDialogError } from "./ImportDialog/Error";
import { ImportDialogPreview } from "./ImportDialog/Preview";

export interface ImportDialogPropsType<EntityDto extends BaseEntityDto>
  extends DialogPropsType {
  handleSubmit: () => void;
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
  const [processing, setProcessing] = useState<boolean>(false);

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
      setProcessing(false);
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
          setProcessing(false);
        }}
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            setFile(null);
            setPreviewItems(null);
            setParseError(null);
            setProcessing(false);
            return;
          }
          if (fileProcessor) {
            setProcessing(true);
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
              })
              .finally(() => setProcessing(false));
          }
          setFile(file);
        }}
        label={t("_accessibility:labels.file")}
      />
      <ImportDialogError message={parseError ?? undefined} />
      {processing && <ImportDialogLoading />}
      {!!previewItems && previewItems.length > 0 && (
        <ImportDialogPreview items={previewItems} />
      )}
      {children}
      <DialogActions
        primaryText={t("_accessibility:buttons.ok")}
        cancelText={t("_accessibility:buttons.cancel")}
        onPrimaryClick={() => {
          const canSubmit =
            !fileProcessor || (!!previewItems && previewItems.length > 0);
          if (canSubmit) handleSubmit();
        }}
        onCancel={handleClose}
        isLoading={isLoading}
        disabled={
          !!isLoading ||
          !!processing ||
          (!!fileProcessor && (!previewItems || previewItems.length === 0))
        }
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
