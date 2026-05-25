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
import type { ProfilePhotoPropsType } from "../types";

// components
import { Image } from "components";

import "./styles.css";

const profilePhotoFallback = (
  <FontAwesomeIcon icon={faUser} className="profile-photo-fallback" />
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
    <div className="profile-photo">
      <div className="profile-photo-frame">
        <div
          className={`profile-photo-preview${hasPhoto ? " profile-photo-preview--clickable" : ""}`}
          onClick={hasPhoto ? handleFileSelect : undefined}
          title={hasPhoto ? t("_pages:profile.photo.upload") : undefined}
        >
          {hasPhoto ? (
            <Image
              endpoint={profile.photo!}
              fallback={profilePhotoFallback}
              className="profile-photo-image"
              alt={profile.name}
            />
          ) : (
            profilePhotoFallback
          )}
          {isUploading && (
            <div className="profile-photo-overlay">
              <FontAwesomeIcon
                icon={faSpinner}
                className="profile-photo-spinner"
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
            className="profile-photo-action"
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
            className="profile-photo-action"
          />
        )}
      </div>
      <FileInput
        id="profile-photo-file-input"
        unstyled
        accept="image/jpeg,image/png,image/webp"
        inputClassName="profile-photo-file-input"
        disabled={isUploading}
        onChange={handleFileChange}
      />
    </div>
  );
}
