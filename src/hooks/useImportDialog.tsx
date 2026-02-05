import { useState } from "react";
import { MutationFunction, useMutation } from "@tanstack/react-query";

// @sito-dashboard
import {
  useTranslation,
  UseImportDialogPropsType,
  useImportAction,
  queryClient,
  ValidationError,
  BaseEntityDto,
  ActionType,
} from "@sito/dashboard-app";
import { ImportDto, ImportPreviewDto } from "lib";

// componentes
import { ImportDialogPropsType } from "../components/Dialog/ImportDialog";

export type NewUseImportDialogPropsType<
  PreviewEntityDto extends ImportPreviewDto
> = Omit<UseImportDialogPropsType, "mutationFn"> & {
  mutationFn: MutationFunction<number, ImportDto<PreviewEntityDto>>;
  fileProcessor?: (
    file: File,
    options?: { override?: boolean }
  ) => Promise<PreviewEntityDto[]>;
};

export type UseImportDialogReturnType<
  EntityDto extends BaseEntityDto,
  PreviewEntityDto extends ImportPreviewDto
> = ImportDialogPropsType<PreviewEntityDto> & {
  action: () => ActionType<EntityDto>;
};

export function useImportDialog<
  EntityDto extends BaseEntityDto,
  PreviewEntityDto extends ImportPreviewDto
>(
  props: NewUseImportDialogPropsType<PreviewEntityDto>
): UseImportDialogReturnType<EntityDto, PreviewEntityDto> {
  const { t } = useTranslation();

  const { queryKey, mutationFn, entity, fileProcessor } = props;

  const [showDialog, setShowDialog] = useState(false);
  const [items, setItems] = useState<PreviewEntityDto[] | null>(null);
  const [override, setOverride] = useState<boolean>(false);

  const importMutation = useMutation<
    number,
    ValidationError,
    ImportDto<PreviewEntityDto>
  >({
    mutationFn,
    onError: (error: ValidationError) => {
      console.error(error);
    },
    onSuccess: async () => {
      if (queryClient) await queryClient.invalidateQueries({ queryKey });
    },
  });

  const { action } = useImportAction({
    onClick: () => setShowDialog(true),
  });

  return {
    handleSubmit: async () => {
      if (!items || items.length === 0) return;
      try {
        await importMutation.mutateAsync({
          items,
          override,
        } as unknown as ImportDto<PreviewEntityDto>);
        setShowDialog(false);
        setItems(null);
        setOverride(false);
      } catch (e) {
        console.error(e);
      }
    },
    isLoading: importMutation.isPending,
    fileProcessor,
    onFileProcessed: (parsed: PreviewEntityDto[]) => setItems(parsed),
    onOverrideChange: (value: boolean) => setOverride(value),
    open: showDialog,
    title: t("_pages:common.actions.import.dialog.title", {
      entity: t(`_pages:${entity}.title`),
    }),
    handleClose: () => {
      setShowDialog(false);
      setItems(null);
    },
    action,
  };
}
