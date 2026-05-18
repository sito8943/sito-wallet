import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@sito/dashboard-app";

import { useMyProfile } from "hooks";

import { normalizeSupportedLanguage } from "../i18";

import type { BasicProviderPropTypes } from "./types";

export const ProfileLanguageSyncProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const { i18n } = useTranslation();
  const { account, isInGuestMode } = useAuth();
  const profileQuery = useMyProfile();

  const isGuestMode = isInGuestMode();
  const profileLanguage = profileQuery.data?.language;

  useEffect(() => {
    if (!account?.id || isGuestMode || !profileLanguage) return;

    const nextLanguage = normalizeSupportedLanguage(profileLanguage);
    const currentLanguage = normalizeSupportedLanguage(
      i18n.resolvedLanguage ?? i18n.language,
    );

    if (currentLanguage === nextLanguage) return;

    void i18n.changeLanguage(nextLanguage);
  }, [account?.id, i18n, isGuestMode, profileLanguage]);

  return <>{children}</>;
};
