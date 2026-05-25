import { useTranslation } from "react-i18next";

import {
  CheckInput,
  ConfirmationDialog,
  TextInput,
} from "@sito/dashboard-app";

import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { ResetUserDialogPropsType } from "../types";

import "./styles.css";

export function ResetUserDialog(props: ResetUserDialogPropsType) {
  const { t } = useTranslation();

  const {
    open,
    title,
    isLoading,
    handleSubmit,
    handleClose,
    target,
    hard,
    setHard,
    confirmText,
    setConfirmText,
    submitDisabled,
  } = props;

  const username = target?.username ?? "";
  const showMismatch =
    hard && confirmText.length > 0 && confirmText !== username;

  return (
    <ConfirmationDialog
      open={open}
      title={title}
      isLoading={isLoading}
      handleClose={handleClose}
      handleSubmit={submitDisabled ? () => undefined : handleSubmit}
    >
      <div className="reset-user-dialog-body">
        <p className="reset-user-dialog-description">
          {t("_pages:users.reset.dialog.description", { user: username })}
        </p>

        <div className="reset-user-dialog-toggle">
          <div className="reset-user-dialog-toggle-copy">
            <span id="reset-user-hard-label">
              {t("_pages:users.reset.dialog.hardLabel")}
            </span>
            <span className="reset-user-dialog-toggle-hint">
              {hard
                ? t("_pages:users.reset.dialog.hardHint")
                : t("_pages:users.reset.dialog.softHint")}
            </span>
          </div>
          <CheckInput
            id="reset-user-hard"
            name="hard"
            label=""
            labelClassName="hidden"
            containerClassName="shrink-0"
            inputClassName="reset-user-dialog-toggle-input"
            aria-labelledby="reset-user-hard-label"
            checked={hard}
            disabled={isLoading}
            onChange={(event) => {
              setHard(event.currentTarget.checked);
              if (!event.currentTarget.checked) setConfirmText("");
            }}
          />
        </div>

        {hard ? (
          <div className="reset-user-dialog-hard">
            <div className="reset-user-dialog-hard-summary">
              <FontAwesomeIcon
                className="reset-user-dialog-hard-icon"
                icon={faTriangleExclamation}
              />
              <span className="reset-user-dialog-hard-text">
                {t("_pages:users.reset.dialog.hardHint")}
              </span>
            </div>
            <TextInput
              required
              value={confirmText}
              disabled={isLoading}
              label={t("_pages:users.reset.dialog.confirmHard")}
              placeholder={username}
              onChange={(event) => setConfirmText(event.currentTarget.value)}
            />
            {showMismatch ? (
              <span className="reset-user-dialog-mismatch">
                {t("_pages:users.reset.dialog.confirmMismatch")}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </ConfirmationDialog>
  );
}
