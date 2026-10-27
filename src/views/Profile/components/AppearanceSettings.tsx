import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import { SelectInput } from "@sito/dashboard-app";

// providers
import { useTheme } from "providers";

// lib
import { THEME_MODES, isThemeMode } from "lib";

import "./styles.css";

// Device-local preference (localStorage), applied instantly: no save button.
export function AppearanceSettings() {
  const { t } = useTranslation();
  const { mode, setMode } = useTheme();

  const themeOptions = useMemo(
    () =>
      THEME_MODES.map((id) => ({
        id,
        name: t(`_pages:profile.values.theme.${id}`),
      })) as Option[],
    [t],
  );

  return (
    <div className="profile-form-shell base-border">
      <section id="appearance" className="profile-section-appearance">
        <div className="profile-section-heading">
          <h3 className="profile-section-title">
            {t("_pages:profile.sections.appearance")}
          </h3>
        </div>
        <SelectInput
          id="profile-theme"
          label={t("_pages:profile.labels.theme")}
          options={themeOptions}
          value={mode}
          helperText={t("_pages:profile.helper.theme")}
          onChange={(event) => {
            const next = event.target.value;
            if (isThemeMode(next)) setMode(next);
          }}
        />
      </section>
    </div>
  );
}
