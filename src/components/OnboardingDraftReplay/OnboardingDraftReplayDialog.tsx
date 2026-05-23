import { useTranslation } from "react-i18next";

import { Dialog, DialogActions } from "@sito/dashboard-app";

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
    <Dialog
      open={open}
      title={t("_pages:onboarding.replay.title")}
      handleClose={onLater}
    >
      <p>{t("_pages:onboarding.replay.message", { count: total })}</p>
      <DialogActions
        primaryText={t("_pages:onboarding.replay.actions.merge")}
        cancelText={t("_pages:onboarding.replay.actions.later")}
        onPrimaryClick={onMerge}
        onCancel={onLater}
        isLoading={isLoading}
        disabled={isLoading}
        primaryType="button"
        containerClassName="mt-5"
        primaryName={t("_pages:onboarding.replay.actions.merge")}
        primaryAriaLabel={t("_pages:onboarding.replay.actions.merge")}
        cancelName={t("_pages:onboarding.replay.actions.later")}
        cancelAriaLabel={t("_pages:onboarding.replay.actions.later")}
        extraActions={extraActions}
      />
    </Dialog>
  );
}
