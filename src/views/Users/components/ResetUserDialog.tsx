import { useTranslation } from "react-i18next";

import { CheckInput, ConfirmationDialog, TextInput } from "@sito/dashboard-app";

import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { ResetUserDialogPropsType } from "../types";

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
  const showMismatch = hard && confirmText.length > 0 && confirmText !== username;

  return (
    <ConfirmationDialog
      open={open}
      title={title}
      isLoading={isLoading}
      handleClose={handleClose}
      handleSubmit={submitDisabled ? () => undefined : handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-muted">
          {t("_pages:users.reset.dialog.description", { user: username })}
        </p>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-base-light p-3">
          <div className="flex flex-col gap-1">
            <span id="reset-user-hard-label">
              {t("_pages:users.reset.dialog.hardLabel")}
            </span>
            <span className="text-sm text-text-muted">
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
            inputClassName="h-4 w-4 accent-bg-error"
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
          <div className="flex flex-col gap-2 rounded-xl bg-bg-error p-3 text-error">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              <span>{t("_pages:users.reset.dialog.hardHint")}</span>
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
              <span className="text-xs text-error">
                {t("_pages:users.reset.dialog.confirmMismatch")}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </ConfirmationDialog>
  );
}
