import { useCallback, useRef } from "react";
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
import { IconButton } from "@sito/dashboard-app";

// types
import { ProfilePhotoPropsType } from "../types";

// config
import { config } from "../../../config";

// components
import { Image } from "components";

export function ProfilePhoto({
  profile,
  isUploading,
  onUpload,
  onDelete,
}: ProfilePhotoPropsType) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
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

  const photoUrl = profile.photo ? `${config.serverUrl}${profile.photo}` : null;

  console.log(profile)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-base border-2 border-border flex items-center justify-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FontAwesomeIcon
              icon={faUser}
              className="text-4xl text-text-muted"
            />
          )}
          {isUploading && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faSpinner}
                className="text-2xl text-white rotate"
              />
            </div>
          )}
        </div>
        <IconButton
          icon={faCamera}
          onClick={handleFileSelect}
          disabled={isUploading}
          color="primary"
          data-tooltip-id="tooltip"
          data-tooltip-content={t("_pages:profile.photo.upload")}
          className="absolute vertical-center horizontal-center"
        />
        {profile.photo && (
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
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
