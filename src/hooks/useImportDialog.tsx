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
  ImportDto,
  ActionType,
} from "@sito/dashboard-app";
import { ImportDialogPropsType } from "../components/Dialog/ImportDialog";

export type NewUseImportDialogPropsType<
  EntityDto extends BaseEntityDto,
  EntityImportDto extends ImportDto
> = Omit<UseImportDialogPropsType, "mutationFn"> & {
  mutationFn: MutationFunction<number, EntityImportDto>;
  fileProcessor?: (file: File) => Promise<EntityDto[]>;
};

export type UseImportDialogReturnType<EntityDto extends BaseEntityDto> =
  ImportDialogPropsType<EntityDto> & {
    action: () => ActionType<EntityDto>;
  };

export function useImportDialog<
  EntityDto extends BaseEntityDto,
  EntityImportDto extends ImportDto
>(
  props: NewUseImportDialogPropsType<EntityDto, EntityImportDto>
): UseImportDialogReturnType<EntityDto> {
  const { t } = useTranslation();

  const { queryKey, mutationFn, entity, fileProcessor } = props;

  const [showDialog, setShowDialog] = useState(false);
  const [items, setItems] = useState<EntityDto[] | null>(null);

  const importMutation = useMutation<number, ValidationError, EntityImportDto>({
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
      // Only submit if there are parsed items
      if (!items || items.length === 0) return;
      try {
        await importMutation.mutateAsync({ items } as unknown as EntityImportDto);
        setShowDialog(false);
        setItems(null);
      } catch (e) {
        console.error(e);
      }
    },
    isLoading: importMutation.isPending,
    fileProcessor,
    onFileProcessed: (parsed: EntityDto[]) => setItems(parsed),
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
