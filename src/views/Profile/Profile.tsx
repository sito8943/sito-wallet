import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  Button,
  Error as ErrorView,
  Loading,
  Page,
  queryClient,
  State,
  TextInput,
  useAuth,
  useNotification,
} from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { ProfileQueryKeys, useMyProfile, useMobileNavbar } from "hooks";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: string };
    if (typeof maybeError.message === "string") return maybeError.message;
  }

  return fallback;
};

const toRenderableError = (error: unknown, fallback: string): Error => {
  if (error instanceof Error) return error;
  return new Error(getErrorMessage(error, fallback));
};

const toDateLabel = (value: Date | string | null | undefined): string => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (!parts.length) return "P";
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
};

export function Profile() {
  const { t } = useTranslation();

  const manager = useManager();
  const { account } = useAuth();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [nameDraft, setNameDraft] = useState<string | null>(null);

  const profileQuery = useMyProfile({
    ensure: true,
    defaultName: account?.username ?? account?.email ?? "Profile",
  });

  const profile = profileQuery.data;
  const name = nameDraft ?? profile?.name ?? "";

  const saveName = useMutation<void, unknown, { id: number; name: string }>({
    mutationFn: async ({ id, name: profileName }) => {
      await manager.Profiles.update({ id, name: profileName });
    },
    onSuccess: async () => {
      setNameDraft(null);
      await queryClient.invalidateQueries({ ...ProfileQueryKeys.all() });
      showSuccessNotification({
        message: t("_pages:profile.messages.updated"),
      });
    },
    onError: (error) => {
      showErrorNotification({
        message: getErrorMessage(error, t("_accessibility:errors.500")),
      });
    },
  });

  const normalizedName = name.trim();

  const nameError = useMemo(() => {
    if (!normalizedName.length) return t("_pages:profile.errors.nameRequired");
    if (normalizedName.length > 120) return t("_pages:profile.errors.nameMax");
    return "";
  }, [normalizedName, t]);

  const busy = profileQuery.isLoading || saveName.isPending;

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
        <div className="w-full max-w-2xl self-center sm:base-border sm:bg-base sm:p-6 rounded-2xl flex flex-col gap-6">
          <section className="flex max-sm:flex-col max-sm:items-start items-center gap-4">
            <div className="h-16 sm:w-16 w-full sm:rounded-full rounded-xl max-sm:m-auto bg-primary text-base flex items-center justify-center text-xl">
              {getInitials(profile.name)}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl">{profile.name}</h3>
              <p className="text-sm text-text-muted">
                {t("_pages:profile.labels.username")}:{" "}
                {profile.user?.username ?? "-"}
              </p>
              <p className="text-sm text-text-muted">
                {t("_pages:profile.labels.updatedAt")}:{" "}
                {toDateLabel(profile.updatedAt)}
              </p>
            </div>
          </section>

          <div className="flex flex-col gap-3">
            <TextInput
              id="profile-name"
              required
              maxLength={120}
              label={t("_entities:base.name.label")}
              value={name}
              helperText={nameError}
              state={nameError ? State.error : State.default}
              disabled={busy}
              onChange={(e) =>
                setNameDraft((e.target as HTMLInputElement).value)
              }
            />

            <div className="flex">
              <Button
                type="button"
                variant="submit"
                color="primary"
                className="max-sm:w-full"
                disabled={busy}
                onClick={() =>
                  saveName.mutate({
                    id: profile.id,
                    name: normalizedName,
                  })
                }
              >
                {t("_pages:profile.actions.save")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}
