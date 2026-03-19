import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

// @sito/dashboard-app
import { Dialog, TextInput, ParagraphInput } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";

// lib
import { AccountDto, AdjustBalanceDto } from "lib";

// components
import { Currency } from "views/Currencies/components/Currency";

interface AdjustBalanceFormType {
  newBalance: string;
  description: string;
}

export interface AdjustBalanceDialogPropsType {
  open: boolean;
  selectedAccount: AccountDto | null;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: AdjustBalanceDto) => void;
}

export function AdjustBalanceDialog(props: AdjustBalanceDialogPropsType) {
  const { open, selectedAccount, isLoading, onClose, onSubmit } = props;
  const { t } = useTranslation();

  const { control, handleSubmit, reset } = useForm<AdjustBalanceFormType>({
    defaultValues: {
      newBalance: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open && selectedAccount) {
      reset({
        newBalance: String(selectedAccount.balance),
        description: "",
      });
    }
  }, [open, selectedAccount, reset]);

  const handleFormSubmit = useCallback(
    (data: AdjustBalanceFormType) => {
      onSubmit({
        newBalance: Number(data.newBalance),
        description: data.description || undefined,
      });
    },
    [onSubmit]
  );

  return (
    <Dialog
      open={open}
      className="md:w-1/3 w-5/6"
      title={t("_pages:accounts.actions.adjustBalance.dialog.title")}
      handleClose={onClose}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4"
      >
        {selectedAccount && (
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <FontAwesomeIcon icon={faScaleBalanced} />
            <span>
              {t("_pages:accounts.actions.adjustBalance.dialog.currentBalance")}:{" "}
              <strong>
                {selectedAccount.balance}{" "}
                <Currency
                  name={selectedAccount.currency?.name}
                  symbol={selectedAccount.currency?.symbol}
                />
              </strong>
            </span>
          </div>
        )}
        <Controller
          control={control}
          name="newBalance"
          rules={{
            required: t("_entities:account.balance.required"),
          }}
          disabled={isLoading}
          render={({ field: { value, ...rest } }) => (
            <TextInput
              id="newBalance"
              required
              type="number"
              value={value ?? ""}
              label={t("_pages:accounts.actions.adjustBalance.dialog.newBalance")}
              placeholder={t("_entities:account.balance.placeholder")}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          disabled={isLoading}
          render={({ field: { value, ...rest } }) => (
            <ParagraphInput
              id="description"
              maxLength={60}
              value={value ?? ""}
              label={t("_entities:base.description.label")}
              placeholder={t("_entities:base.description.placeholder")}
              {...rest}
            />
          )}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="button submit primary mt-2"
        >
          {t("_pages:accounts.actions.adjustBalance.dialog.submit")}
        </button>
      </form>
    </Dialog>
  );
}
