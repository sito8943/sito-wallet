import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePutDialog } from "@sito/dashboard-app";

// hooks
import { OAuthQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { OAuthGrantDto, OAuthUpdateGrantDto } from "lib";

// constants
import { CONNECTED_APP_DEFAULT_VALUES } from "../constants";

// utils
import { connectedAppFormToUpdateDto, grantToForm } from "../utils";

// types
import type {
  ConnectedAppFormType,
  UseEditConnectedAppDialogReturnType,
} from "../types";

/** Edits a connected app's access level and areas (sito-auth grant). */
export function useEditConnectedAppDialog(): UseEditConnectedAppDialogReturnType {
  const { t } = useTranslation();
  const manager = useManager();
  const handleMutationError = useMutationErrorHandler();

  const formDialog = usePutDialog<
    OAuthGrantDto,
    OAuthUpdateGrantDto,
    OAuthGrantDto,
    ConnectedAppFormType
  >({
    defaultValues: CONNECTED_APP_DEFAULT_VALUES,
    dtoToForm: grantToForm,
    formToDto: connectedAppFormToUpdateDto,
    // sito-auth has no GET /oauth/grants/{id}: find it in the user's list.
    getFunction: async (id) => {
      const grant = (await manager.OAuth.listGrants()).find(
        (item) => String(item.id) === String(id),
      );
      if (!grant) throw new Error("Grant not found");
      return grant;
    },
    mutationFn: (data) => manager.OAuth.updateGrant(data),
    queryKey: OAuthQueryKeys.grants().queryKey,
    onSuccessMessage: t("_pages:aiAgents.apps.edit.successMessage"),
    onError: (error) => handleMutationError(error),
    title: t("_pages:aiAgents.apps.edit.title"),
  });

  const { openDialog } = formDialog;
  const openForGrant = useCallback(
    (grant: OAuthGrantDto) => openDialog(Number(grant.id)),
    [openDialog],
  );

  return { ...formDialog, openForGrant };
}
