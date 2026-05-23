import { useTranslation } from "react-i18next";

import { ConfirmationDialog } from "@sito/dashboard-app";

import { countDraftItems } from "lib";

import type { OnboardingDraftReplayDialogPropsType } from "./types";

export function OnboardingDraftReplayDialog(
  props: OnboardingDraftReplayDialogPropsType,
) {
  const { open, draft, isLoading, onMerge, onDiscard, onLater } = props;
  const { t } = useTranslation();

  const total = countDraftItems(draft);

  const extraActions = [
    {
      id: "onboarding-replay-discard",
      type: "button" as const,
      variant: "outlined" as const,
      color: "error" as const,
      onClick: onDiscard,
      disabled: isLoading,
      children: t("_pages:onboarding.replay.actions.discard"),
      name: t("_pages:onboarding.replay.actions.discard"),
      "aria-label": t("_pages:onboarding.replay.actions.discard"),
    },
  ];

  return (
    <ConfirmationDialog
      open={open}
      title={t("_pages:onboarding.replay.title")}
      handleClose={onLater}
      handleSubmit={onMerge}
      isLoading={isLoading}
      extraActions={extraActions}
    >
      <p>{t("_pages:onboarding.replay.message", { count: total })}</p>
    </ConfirmationDialog>
  );
}
