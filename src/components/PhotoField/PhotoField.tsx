import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUpload,
  faImage,
  faRotateLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button, TextInput } from "@sito/dashboard-app";

// lib
import { isExternalPhoto } from "lib";

// components
import { ProviderPhoto } from "../ProviderPhoto";

// constants
import { PHOTO_ACCEPT } from "./constants";

// types
import type { PhotoFieldPropsType } from "./types";

import "./styles.css";

export function PhotoField(props: PhotoFieldPropsType) {
  const { inputId, values, disabled, onChange } = props;
  const { photo, photoUrl, file, removePhoto } = values;
  const { t } = useTranslation();

  const filePreview = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const typedUrl = photoUrl.trim();
  const storedPhoto = removePhoto ? "" : photo;
  const previewPhoto = isExternalPhoto(typedUrl) ? typedUrl : storedPhoto;
  const hasPhoto = !!filePreview || !!previewPhoto;

  const openFileSelector = () => document.getElementById(inputId)?.click();

  const toggleRemove = () => {
    if (removePhoto) {
      onChange({ removePhoto: false });
      return;
    }
    onChange({ file: null, photoUrl: "", removePhoto: !!photo });
  };

  return (
    <div className="photo-field">
      <span className="photo-field-label">
        {t("_entities:base.photo.label")}
      </span>
      <div className="photo-field-row">
        <div className="photo-field-preview">
          {filePreview ? (
            <img className="photo-field-image" src={filePreview} alt="" />
          ) : previewPhoto ? (
            <ProviderPhoto className="photo-field-image" photo={previewPhoto} />
          ) : (
            <FontAwesomeIcon icon={faImage} className="text-text-muted" />
          )}
        </div>
        <div className="photo-field-actions">
          <Button
            type="button"
            variant="text"
            disabled={disabled}
            onClick={openFileSelector}
          >
            <FontAwesomeIcon icon={faCloudUpload} />{" "}
            {t(
              hasPhoto
                ? "_entities:base.photo.replace"
                : "_entities:base.photo.upload",
            )}
          </Button>
          {(hasPhoto || removePhoto) && (
            <Button
              type="button"
              variant="text"
              disabled={disabled}
              onClick={toggleRemove}
            >
              <FontAwesomeIcon icon={removePhoto ? faRotateLeft : faTrash} />{" "}
              {t(
                removePhoto
                  ? "_pages:common.actions.restore.text"
                  : "_entities:base.photo.delete",
              )}
            </Button>
          )}
          {file && (
            <span className="photo-field-hint">
              {t("_entities:base.photo.selectedFile", { name: file.name })}
            </span>
          )}
          {removePhoto && (
            <span className="photo-field-warning">
              {t("_entities:base.photo.deleteOnSave")}
            </span>
          )}
        </div>
      </div>
      <input
        id={inputId}
        className="photo-field-file-input"
        type="file"
        accept={PHOTO_ACCEPT}
        disabled={disabled}
        onChange={(event) => {
          const selected = event.currentTarget.files?.[0] ?? null;
          onChange({ file: selected, photoUrl: "", removePhoto: false });
          event.currentTarget.value = "";
        }}
      />
      <TextInput
        type="url"
        autoComplete="off"
        disabled={disabled}
        value={photoUrl}
        label={t("_entities:base.photo.url.label")}
        placeholder={t("_entities:base.photo.url.placeholder")}
        onChange={(event) =>
          onChange({
            photoUrl: event.currentTarget.value,
            file: null,
            removePhoto: false,
          })
        }
      />
    </div>
  );
}
