import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Page, useAuth } from "@sito/dashboard-app";

// components
import { QueryError } from "components";

// hooks
import { ProfileQueryKeys, useMyProfile, useMobileNavbar } from "hooks";

// components
import {
  AiAgentsSettings,
  AppearanceSettings,
  ChangePasswordForm,
  PrivacySettings,
  ProfileForm,
} from "./components";

// utils
import { toRenderableError } from "./utils";

import "./components/styles.css";

export function Profile() {
  const { t } = useTranslation();
  const { account } = useAuth();

  const profileQuery = useMyProfile({
    ensure: true,
    defaultName: account?.username ?? account?.email ?? "Profile",
  });

  const profile = profileQuery.data;

  useMobileNavbar(t("_pages:profile.title"));

  return (
    <Page
      title={t("_pages:profile.title")}
      // Page's own loader also covers the gap before the profile arrives.
      isLoading={profileQuery.isLoading || (!profileQuery.error && !profile)}
      queryKey={ProfileQueryKeys.all().queryKey}
    >
      {profileQuery.error ? (
        <QueryError
          error={toRenderableError(
            profileQuery.error,
            t("_accessibility:errors.500"),
          )}
        />
      ) : !profile ? null : (
        <div className="profile-forms">
          <ProfileForm profile={profile} />
          <ChangePasswordForm />
          <AppearanceSettings />
          <PrivacySettings />
          <AiAgentsSettings />
        </div>
      )}
    </Page>
  );
}
