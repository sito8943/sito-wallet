import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faTrash,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { FileInput, IconButton } from "@sito/dashboard-app";

// types
import { ProfilePhotoPropsType } from "../types";

// components
import { Image } from "components";

const PhotoFallback = () => (
  <FontAwesomeIcon icon={faUser} className="text-4xl text-text-muted" />
);

export function ProfilePhoto({
  profile,
  isUploading,
  onUpload,
  onDelete,
}: ProfilePhotoPropsType) {
  const { t } = useTranslation();

  const handleFileSelect = useCallback(() => {
    const fileInput = document.getElementById("profile-photo-file-input");
    if (fileInput instanceof HTMLInputElement) fileInput.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onUpload(file);
        e.target.value = "";
      }
    },
    [onUpload],
  );

  const hasPhoto = !!profile.photo;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div
          className={`w-28 h-28 rounded-2xl overflow-hidden bg-base border-2 border-border flex items-center justify-center${hasPhoto ? " cursor-pointer" : ""}`}
          onClick={hasPhoto ? handleFileSelect : undefined}
          title={hasPhoto ? t("_pages:profile.photo.upload") : undefined}
        >
          {hasPhoto ? (
            <Image
              endpoint={profile.photo!}
              fallback={<PhotoFallback />}
              className="w-full h-full object-cover"
              alt={profile.name}
            />
          ) : (
            <PhotoFallback />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-2xl text-white rotate"
              />
            </div>
          )}
        </div>
        {!hasPhoto && (
          <IconButton
            icon={faCamera}
            onClick={handleFileSelect}
            disabled={isUploading}
            color="primary"
            data-tooltip-id="tooltip"
            data-tooltip-content={t("_pages:profile.photo.upload")}
            className="top-1 right-1 absolute"
          />
        )}
        {hasPhoto && (
          <IconButton
            icon={faTrash}
            onClick={onDelete}
            disabled={isUploading}
            color="error"
            data-tooltip-id="tooltip"
            data-tooltip-content={t("_pages:profile.photo.delete")}
            className="top-1 right-1 absolute"
          />
        )}
      </div>
      <FileInput
        id="profile-photo-file-input"
        unstyled
        accept="image/jpeg,image/png,image/webp"
        inputClassName="hidden"
        disabled={isUploading}
        onChange={handleFileChange}
      />
    </div>
  );
}
