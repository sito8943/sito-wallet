import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Error as ErrorView, Loading, Page, useAuth } from "@sito/dashboard-app";

// hooks
import { ProfileQueryKeys, useMyProfile, useMobileNavbar } from "hooks";

// components
import { ProfileForm } from "./components";

// utils
import { toRenderableError } from "./utils";

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
      isLoading={profileQuery.isLoading}
      queryKey={ProfileQueryKeys.all().queryKey}
    >
      {profileQuery.error ? (
        <ErrorView
          error={toRenderableError(
            profileQuery.error,
            t("_accessibility:errors.500"),
          )}
        />
      ) : !profile ? (
        <div className="w-full flex justify-center items-center py-10">
          <Loading />
        </div>
      ) : (
        <ProfileForm profile={profile} />
      )}
    </Page>
  );
}
