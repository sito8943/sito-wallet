import { useCallback, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Button,
  Error as ErrorView,
  FormContainer,
  Page,
  useMutationForm,
  useNotification,
} from "@sito/dashboard-app";

import {
  DebtsQueryKeys,
  useMobileNavbar,
  useMutationErrorHandler,
} from "hooks";
import { useManager } from "providers";

import type { DebtDto, DebtPaymentDto } from "lib";
import { AppRoutes, FormMode, parseErrorMessage } from "lib";

import {
  AddDebtPaymentDialog,
  DebtActivitySidebar,
  DebtForm,
} from "./components";
import { useAddDebtPaymentDialog } from "./hooks";
import type { DebtFormType } from "./types";
import {
  debtDtoToForm,
  debtFormToCreateDto,
  debtFormToUpdateDto,
  emptyDebtForm,
} from "./utils";
import "./styles.css";

const parseDebtId = (value?: string): number | null => {
  if (!value) return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  return parsed;
};

export function DebtEditor() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const handleMutationError = useMutationErrorHandler();

  const manager = useManager();
  const debtsClient = "Debts" in manager ? manager.Debts : null;

  const { debtId: debtIdParam } = useParams();
  const debtId = useMemo(() => parseDebtId(debtIdParam), [debtIdParam]);

  const isEditMode = !!debtIdParam;
  const invalidEditRoute = isEditMode && !debtId;

  const title = isEditMode
    ? t("_pages:debts.forms.edit")
    : t("_pages:debts.forms.add");

  const addPayment = useAddDebtPaymentDialog();

  const {
    control,
    handleSubmit,
    isLoading: isSubmitting,
    onSubmit,
    reset,
    setValue,
  } = useMutationForm<DebtFormType, DebtFormType, DebtDto, DebtFormType>({
    defaultValues: emptyDebtForm,
    queryKey: DebtsQueryKeys.all().queryKey,
    mutationFn: async (values: DebtFormType) => {
      if (!debtsClient) {
        throw new Error("debts.featureDisabled");
      }

      if (isEditMode) {
        if (!debtId) {
          throw new Error("Invalid debt id");
        }

        return await debtsClient.update(debtFormToUpdateDto(values));
      }

      return await debtsClient.insert(debtFormToCreateDto(values));
    },
    onSuccess: async () => {
      showSuccessNotification({
        message: isEditMode
          ? t("_pages:common.actions.edit.successMessage")
          : t("_pages:common.actions.add.successMessage"),
      });

      navigate(AppRoutes.debts);
    },
    onError: (error) =>
      handleMutationError(error, {
        badRequest: { fallbackKey: "_pages:featureFlags.moduleUnavailable" },
      }),
  });

  const debtQuery = useQuery({
    queryKey: [...DebtsQueryKeys.all().queryKey, "detail", debtId],
    enabled: !!debtsClient && !!debtId && !invalidEditRoute,
    queryFn: async () => {
      if (!debtsClient || !debtId) {
        throw new Error("debts.featureDisabled");
      }

      return await debtsClient.getById(debtId);
    },
  });

  const debtPaymentsQuery = useQuery({
    ...DebtsQueryKeys.payments(debtId),
    enabled:
      !!debtsClient &&
      !!debtId &&
      !invalidEditRoute &&
      isEditMode &&
      !!debtQuery.data,
    queryFn: async () => {
      if (!debtsClient || !debtId) {
        throw new Error("debts.featureDisabled");
      }

      return await debtsClient.getPayments(debtId, {
        currentPage: 0,
        pageSize: 50,
      });
    },
  });

  useEffect(() => {
    if (!debtQuery.data) return;
    reset?.(debtDtoToForm(debtQuery.data));
  }, [reset, debtQuery.data]);

  useEffect(() => {
    if (isEditMode) return;
    reset?.(emptyDebtForm);
  }, [isEditMode, reset]);

  const handleDeletePayment = useCallback(
    async (payment: DebtPaymentDto) => {
      if (!debtsClient || !debtId) return;

      try {
        await debtsClient.deletePayment(debtId, payment.id);
        showSuccessNotification({
          message: t("_pages:debts.actions.deletePayment.successMessage"),
        });
        await queryClient.invalidateQueries({ ...DebtsQueryKeys.all() });
      } catch (error) {
        showErrorNotification({
          message: parseErrorMessage(error, t("_accessibility:errors.500")),
        });
      }
    },
    [
      debtsClient,
      debtId,
      queryClient,
      showErrorNotification,
      showSuccessNotification,
      t,
    ],
  );

  const editorActions = useMemo(() => {
    if (!isEditMode || !debtQuery.data) return [];

    return [addPayment.action(debtQuery.data)];
  }, [addPayment, isEditMode, debtQuery.data]);

  useMobileNavbar(title, editorActions);

  const isLoading = isSubmitting || (isEditMode && debtQuery.isLoading);

  return (
    <Page
      title={title}
      isLoading={isEditMode && debtQuery.isLoading}
      actions={editorActions}
      queryKey={DebtsQueryKeys.all().queryKey}
    >
      {invalidEditRoute ? (
        <ErrorView error={new Error(t("_accessibility:errors.404"))} />
      ) : debtQuery.error ? (
        <ErrorView
          error={
            new Error(
              parseErrorMessage(
                debtQuery.error,
                t("_accessibility:errors.500"),
              ),
            )
          }
        />
      ) : (
        <div className="debt-editor-layout">
          <div className="debt-editor-form">
            <FormContainer<DebtFormType>
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              isLoading={isLoading}
              onCancel={() => navigate(AppRoutes.debts)}
              submitLabel={t("_accessibility:buttons.save")}
              cancelLabel={t("_accessibility:buttons.cancel")}
              submitDisabled={isLoading}
              cancelDisabled={isLoading}
              renderActions={({
                buttonProps,
                cancelLabel,
                onCancel,
                submitLabel,
              }) => (
                <div className="debt-editor-actions">
                  <Button
                    {...buttonProps.cancel}
                    variant="outlined"
                    onClick={onCancel}
                    className="debt-editor-action-button"
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    {...buttonProps.submit}
                    variant="submit"
                    color="primary"
                    className="debt-editor-action-button"
                  >
                    {submitLabel}
                  </Button>
                </div>
              )}
            >
              <div className="debt-editor-form-content">
                <DebtForm
                  control={control}
                  isLoading={isLoading}
                  setValue={setValue}
                  mode={isEditMode ? FormMode.Edit : FormMode.Add}
                />
              </div>
            </FormContainer>
          </div>
          {isEditMode && debtId ? (
            <DebtActivitySidebar
              issuedAt={debtQuery.data?.issuedAt}
              dueAt={debtQuery.data?.dueAt}
              originalAmount={debtQuery.data?.originalAmount}
              pendingAmount={debtQuery.data?.pendingAmount}
              currency={debtQuery.data?.currency}
              payments={debtPaymentsQuery.data?.items ?? []}
              paymentsLoading={debtPaymentsQuery.isLoading}
              paymentsError={debtPaymentsQuery.error}
              onDeletePayment={(payment) => {
                void handleDeletePayment(payment);
              }}
            />
          ) : null}
          <AddDebtPaymentDialog {...addPayment} />
        </div>
      )}
    </Page>
  );
}
