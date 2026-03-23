import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// lib
import { ProfileDto } from "lib";

export function useProfilePhoto(
  profileId: number,
  onSuccess: (updated?: ProfileDto) => void,
) {
  const { t } = useTranslation();
  const manager = useManager();
  const { showSuccessNotification, showErrorNotification } = useNotification();

  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!profileId) return;
      setIsUploading(true);
      try {
        const updated = await manager.Profiles.updatePhoto(profileId, file);
        onSuccess(updated);
        showSuccessNotification({
          message: t("_pages:profile.photo.uploadSuccess"),
        });
      } catch {
        showErrorNotification({
          message: t("_pages:profile.photo.uploadError"),
        });
      } finally {
        setIsUploading(false);
      }
    },
    [
      profileId,
      manager,
      onSuccess,
      showSuccessNotification,
      showErrorNotification,
      t,
    ],
  );

  const deletePhoto = useCallback(async () => {
    if (!profileId) return;
    setIsUploading(true);
    try {
      const updated = await manager.Profiles.deletePhoto(profileId);
      onSuccess(updated);
      showSuccessNotification({
        message: t("_pages:profile.photo.deleteSuccess"),
      });
    } catch {
      showErrorNotification({
        message: t("_pages:profile.photo.deleteError"),
      });
    } finally {
      setIsUploading(false);
    }
  }, [
    profileId,
    manager,
    onSuccess,
    showSuccessNotification,
    showErrorNotification,
    t,
  ]);

  return { isUploading, uploadPhoto, deletePhoto };
}
