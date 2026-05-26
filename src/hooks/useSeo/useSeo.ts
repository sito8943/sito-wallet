import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { normalizeSupportedLanguage } from "../../i18";

import { applySeoMetadata, resolveSeoMetadata } from "./utils";

export const useSeo = () => {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const language = normalizeSupportedLanguage(i18n.resolvedLanguage);
    const metadata = resolveSeoMetadata(pathname, t);

    applySeoMetadata(pathname, language, metadata);
  }, [i18n.resolvedLanguage, pathname, t]);
};
