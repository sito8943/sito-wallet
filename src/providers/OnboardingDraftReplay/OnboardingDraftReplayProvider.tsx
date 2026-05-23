import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth, useNotification } from "@sito/dashboard-app";

import { OnboardingDraftReplayDialog } from "components";
import {
  entityKeysToConfigs,
  fetchExistingDataSummary,
  hasExistingData,
  isAnonymousVisitorSession,
  countDraftItems,
  isDraftEmpty,
  replayDraft,
  resolveRequiredEntityKeys,
  type ReplayMode,
} from "lib";

import { useManager } from "../useSWManager";
import { useOnboardingDraft } from "../OnboardingDraft";
import type { BasicProviderPropTypes } from "../types";

export const OnboardingDraftReplayProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const { t } = useTranslation();
  const { account, isInGuestMode } = useAuth();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const manager = useManager();
  const { draft, clear, refreshFromStorage } = useOnboardingDraft();

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handledRef = useRef(false);
  const previousAccountIdRef = useRef<number | null | undefined>(account?.id);

  const isAnonymous = isAnonymousVisitorSession(account, isInGuestMode());

  const runReplay = useCallback(
    async (mode: ReplayMode) => {
      setIsLoading(true);
      try {
        const resolvedEntityKeys = resolveRequiredEntityKeys(
          draft.selectedEntityKeys,
        );
        const configs =
          resolvedEntityKeys.length > 0
            ? entityKeysToConfigs(resolvedEntityKeys)
            : undefined;

        await replayDraft(manager, draft, mode, configs);

        clear();
        showSuccessNotification({
          message: t("_pages:onboarding.replay.success"),
        });
      } catch {
        showErrorNotification({
          message: t("_pages:onboarding.replay.error"),
        });
      } finally {
        setIsLoading(false);
        setOpen(false);
      }
    },
    [clear, draft, manager, showErrorNotification, showSuccessNotification, t],
  );

  useEffect(() => {
    const previousId = previousAccountIdRef.current;
    const currentId = account?.id;
    previousAccountIdRef.current = currentId;

    if (handledRef.current) return;
    if (!currentId || previousId === currentId) return;
    if (isAnonymous) return;

    refreshFromStorage();
  }, [account?.id, isAnonymous, refreshFromStorage]);

  useEffect(() => {
    if (handledRef.current) return;
    if (!account?.id || isAnonymous) return;
    if (isDraftEmpty(draft)) return;
    if (countDraftItems(draft) === 0 && draft.selectedEntityKeys.length === 0) {
      return;
    }

    handledRef.current = true;

    let cancelled = false;

    void (async () => {
      try {
        const summary = await fetchExistingDataSummary(manager);
        if (cancelled) return;

        if (hasExistingData(summary)) {
          setOpen(true);
        } else {
          await runReplay("merge");
        }
      } catch {
        handledRef.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [account?.id, draft, isAnonymous, manager, runReplay]);

  return (
    <>
      {children}
      {open && (
        <OnboardingDraftReplayDialog
          open={open}
          draft={draft}
          isLoading={isLoading}
          onMerge={() => {
            void runReplay("merge");
          }}
          onDiscard={() => {
            clear();
            setOpen(false);
          }}
          onLater={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};
