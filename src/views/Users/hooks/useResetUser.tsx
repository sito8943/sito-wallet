import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth, useNotification } from "@sito/dashboard-app";

import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UsersQueryKeys } from "hooks";
import { useManager } from "providers";

import type { UserDto } from "lib";

import type { UseResetUserReturnType, ResetUserTarget } from "../types";

export function useResetUser(): UseResetUserReturnType {
  const { t } = useTranslation();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const queryClient = useQueryClient();
  const { account } = useAuth();

  const manager = useManager();
  const usersClient = "Users" in manager ? manager.Users : null;

  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<ResetUserTarget | null>(null);
  const [hard, setHard] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const close = useCallback(() => {
    setOpen(false);
    setTarget(null);
    setHard(false);
    setConfirmText("");
  }, []);

  const mutation = useMutation({
    mutationFn: async (payload: { id: number; hard: boolean }) => {
      if (!usersClient) throw new Error("users.featureDisabled");
      await usersClient.reset(payload.id, payload.hard);
      return payload.id;
    },
    onSuccess: async (resetId) => {
      showSuccessNotification({
        message: t("_pages:users.reset.successMessage"),
      });
      close();

      if (account?.id === resetId) {
        await queryClient.invalidateQueries();
        return;
      }

      await queryClient.invalidateQueries({ ...UsersQueryKeys.all() });
    },
    onError: () => {
      showErrorNotification({
        message: t("_pages:users.reset.errorMessage"),
      });
    },
  });

  const handleSubmit = useCallback(() => {
    if (!target) return;
    if (hard && confirmText !== target.username) return;
    mutation.mutate({ id: target.id, hard });
  }, [target, hard, confirmText, mutation]);

  const action = useCallback(
    (record: UserDto) => ({
      id: "reset",
      icon: <FontAwesomeIcon icon={faRotateLeft} />,
      tooltip: t("_pages:users.reset.action"),
      disabled: !usersClient,
      hidden: !!record.deletedAt,
      onClick: (entity?: UserDto) => {
        const user = entity ?? record;
        setTarget({ id: user.id, username: user.username || user.email });
        setHard(false);
        setConfirmText("");
        setOpen(true);
      },
    }),
    [t, usersClient],
  );

  const submitDisabled = useMemo(() => {
    if (!target) return true;
    if (mutation.isPending) return true;
    if (hard && confirmText !== target.username) return true;
    return false;
  }, [target, hard, confirmText, mutation.isPending]);

  return {
    open,
    title: t("_pages:users.reset.dialog.title"),
    isLoading: mutation.isPending,
    handleSubmit,
    handleClose: close,
    target,
    hard,
    setHard,
    confirmText,
    setConfirmText,
    submitDisabled,
    action,
  };
}
