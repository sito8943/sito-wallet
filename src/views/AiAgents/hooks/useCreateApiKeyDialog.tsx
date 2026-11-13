import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// hooks
import { ApiKeysQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { AddApiKeyDto, CreatedApiKeyDto } from "lib";

// constants
import { CREATE_API_KEY_DEFAULT_VALUES } from "../constants";

// utils
import { createApiKeyFormToDto } from "../utils";

// types
import type { ApiKeyFormType, UseCreateApiKeyDialogReturnType } from "../types";

/** Name form + the created key, kept in memory only until dismissed. */
export function useCreateApiKeyDialog(): UseCreateApiKeyDialogReturnType {
  const { t } = useTranslation();
  const manager = useManager();
  const handleMutationError = useMutationErrorHandler();

  const [createdKey, setCreatedKey] = useState<CreatedApiKeyDto | null>(null);

  const formDialog = usePostDialog<
    AddApiKeyDto,
    CreatedApiKeyDto,
    ApiKeyFormType
  >({
    formToDto: createApiKeyFormToDto,
    defaultValues: CREATE_API_KEY_DEFAULT_VALUES,
    resetOnOpen: true,
    mutationFn: (data) => manager.ApiKeys.create(data),
    queryKey: ApiKeysQueryKeys.all().queryKey,
    onSuccess: (created) => setCreatedKey(created),
    onSuccessMessage: t("_pages:aiAgents.keys.dialog.successMessage"),
    onError: (error) =>
      handleMutationError(error, {
        badRequest: {
          fallbackKey: "_pages:aiAgents.keys.dialog.fallbackError",
        },
      }),
    title: t("_pages:aiAgents.keys.dialog.title"),
  });

  const clearCreatedKey = useCallback(() => setCreatedKey(null), []);

  return { ...formDialog, createdKey, clearCreatedKey };
}
