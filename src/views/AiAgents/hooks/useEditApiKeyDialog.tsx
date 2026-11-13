import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePutDialog } from "@sito/dashboard-app";

// hooks
import { ApiKeysQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { ApiKeyDto, UpdateApiKeyDto } from "lib";

// constants
import { CREATE_API_KEY_DEFAULT_VALUES } from "../constants";

// utils
import { apiKeyDtoToForm, apiKeyFormToUpdateDto } from "../utils";

// types
import type { ApiKeyFormType, UseEditApiKeyDialogReturnType } from "../types";

/** Edits a key's name, access level and areas. */
export function useEditApiKeyDialog(): UseEditApiKeyDialogReturnType {
  const { t } = useTranslation();
  const manager = useManager();
  const handleMutationError = useMutationErrorHandler();

  const formDialog = usePutDialog<
    ApiKeyDto,
    UpdateApiKeyDto,
    ApiKeyDto,
    ApiKeyFormType
  >({
    defaultValues: CREATE_API_KEY_DEFAULT_VALUES,
    dtoToForm: apiKeyDtoToForm,
    formToDto: apiKeyFormToUpdateDto,
    // There is no GET /api-keys/{id}: the list is small (10 keys at most).
    getFunction: async (id) => {
      const apiKey = (await manager.ApiKeys.list()).find(
        (item) => item.id === id,
      );
      if (!apiKey) throw new Error("ApiKey not found");
      return apiKey;
    },
    mutationFn: (data) => manager.ApiKeys.update(data),
    queryKey: ApiKeysQueryKeys.all().queryKey,
    onSuccessMessage: t("_pages:aiAgents.keys.edit.successMessage"),
    onError: (error) =>
      handleMutationError(error, {
        badRequest: {
          fallbackKey: "_pages:aiAgents.keys.dialog.fallbackError",
        },
      }),
    title: t("_pages:aiAgents.keys.edit.title"),
  });

  const { openDialog } = formDialog;
  const openForKey = useCallback(
    (apiKey: ApiKeyDto) => openDialog(apiKey.id),
    [openDialog],
  );

  return { ...formDialog, openForKey };
}
