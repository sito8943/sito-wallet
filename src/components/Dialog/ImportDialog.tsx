import { useCallback, useEffect, useRef, useState } from "react";

// @sito-dashboard
import {
  useTranslation,
  Dialog,
  DialogActions,
  DialogPropsType,
} from "@sito/dashboard-app";

// components
import { FileInput } from "../FileInput/FileInput";
import { ImportDialogLoading } from "./ImportDialog/Loading";
import { ImportDialogError } from "./ImportDialog/Error";
import { ImportDialogPreview } from "./ImportDialog/Preview";

// lib
import { ImportPreviewDto } from "lib";

export interface ImportDialogPropsType<EntityDto extends ImportPreviewDto>
  extends DialogPropsType {
  handleSubmit: () => void;
  isLoading?: boolean;
  fileProcessor?: (
    file: File,
    options?: { override?: boolean }
  ) => Promise<EntityDto[]>;
  onFileProcessed?: (items: EntityDto[]) => void;
  onOverrideChange?: (override: boolean) => void;
}

export const ImportDialog = <EntityDto extends ImportPreviewDto>(
  props: ImportDialogPropsType<EntityDto>
) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [previewItems, setPreviewItems] = useState<EntityDto[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [overrideExisting, setOverrideExisting] = useState<boolean>(false);

  const {
    children,
    handleSubmit,
    handleClose,
    isLoading = false,
    fileProcessor,
    onFileProcessed,
    onOverrideChange,
    open,
    ...rest
  } = props;

  console.log(handleClose);

  const [inputKey, setInputKey] = useState(0);
  const processedCallbackRef = useRef(onFileProcessed);
  const fileProcessorRef = useRef(fileProcessor);

  useEffect(() => {
    processedCallbackRef.current = onFileProcessed;
  }, [onFileProcessed]);

  useEffect(() => {
    fileProcessorRef.current = fileProcessor;
  }, [fileProcessor]);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setPreviewItems(null);
      setParseError(null);
      setProcessing(false);
      setOverrideExisting(false);
      setInputKey((k) => k + 1);
    }
  }, [open]);

  const handleFileProcessed = useCallback(async () => {
    if (fileProcessorRef.current && file) {
      setProcessing(true);
      try {
        const items = await fileProcessorRef.current(file, {
          override: overrideExisting,
        });
        setPreviewItems(items ?? []);
        setParseError(null);
        processedCallbackRef.current?.(items ?? []);
      } catch (err) {
        console.error(err);
        setPreviewItems(null);
        const message =
          err instanceof Error ? err.message : "Failed to parse file";
        setParseError(message);
      }
      setProcessing(false);
    }
  }, [file, overrideExisting]);

  useEffect(() => {
    handleFileProcessed();
  }, [handleFileProcessed]);

  return (
    <Dialog {...rest} open={open} handleClose={handleClose}>
      <FileInput
        key={inputKey}
        onClear={() => {
          setFile(null);
          setPreviewItems(null);
          setParseError(null);
          setProcessing(false);
          processedCallbackRef.current?.([]);
        }}
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            setFile(null);
            setPreviewItems(null);
            setParseError(null);
            setProcessing(false);
            processedCallbackRef.current?.([]);
            return;
          }
          setFile(file);
        }}
        label={t("_accessibility:labels.file")}
      />
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={overrideExisting}
          onChange={(e) => {
            const value = e.target.checked;
            setOverrideExisting(value);
            onOverrideChange?.(value);
          }}
        />
        <span>
          {t("_pages:common.actions.import.override", {
            defaultValue: "Override existing items",
          })}
        </span>
      </label>
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
          else {
            // throw error notification of required file o items to process
          }
        }}
        onCancel={handleClose}
        isLoading={isLoading}
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
