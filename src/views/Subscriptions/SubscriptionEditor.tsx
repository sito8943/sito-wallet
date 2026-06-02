import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Button,
  Error as ErrorView,
  FormContainer,
  isHttpError,
  Page,
  useMutationForm,
  useNotification,
} from "@sito/dashboard-app";

import { SubscriptionsQueryKeys, useMobileNavbar } from "hooks";
import { useManager } from "providers";

import type { SubscriptionDto } from "lib";
import { AppRoutes, FormMode } from "lib";

import {
  AddSubscriptionBillingLogDialog,
  SubscriptionActivitySidebar,
  SubscriptionForm,
} from "./components";
import {
  useAddSubscriptionBillingLogDialog,
} from "./hooks";
import type { SubscriptionFormType } from "./types";
import {
  emptySubscriptionForm,
  subscriptionDtoToForm,
  subscriptionFormToCreateDto,
  subscriptionFormToUpdateDto,
} from "./utils";
import "./styles.css";

const parseSubscriptionId = (value?: string): number | null => {
  if (!value) return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  return parsed;
};

const parseErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: string };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return fallback;
};

export function SubscriptionEditor() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const manager = useManager();
  const subscriptionsClient =
    "Subscriptions" in manager ? manager.Subscriptions : null;

  const { subscriptionId: subscriptionIdParam } = useParams();
  const subscriptionId = useMemo(
    () => parseSubscriptionId(subscriptionIdParam),
    [subscriptionIdParam],
  );

  const isEditMode = !!subscriptionIdParam;
  const invalidEditRoute = isEditMode && !subscriptionId;

  const title = isEditMode
    ? t("_pages:subscriptions.forms.edit")
    : t("_pages:subscriptions.forms.add");
  const addBillingLog = useAddSubscriptionBillingLogDialog();

  const {
    control,
    handleSubmit,
    isLoading: isSubmitting,
    onSubmit,
    reset,
    setValue,
  } = useMutationForm<
    SubscriptionFormType,
    SubscriptionFormType,
    SubscriptionDto,
    SubscriptionFormType
  >({
    defaultValues: emptySubscriptionForm,
    queryKey: SubscriptionsQueryKeys.all().queryKey,
    mutationFn: async (values: SubscriptionFormType) => {
      if (!subscriptionsClient) {
        throw new Error("subscriptions.featureDisabled");
      }

      if (isEditMode) {
        if (!subscriptionId) {
          throw new Error("Invalid subscription id");
        }

        return await subscriptionsClient.update(
          subscriptionFormToUpdateDto(values),
        );
      }

      return await subscriptionsClient.insert(
        subscriptionFormToCreateDto(values),
      );
    },
    onSuccess: async () => {
      showSuccessNotification({
        message: isEditMode
          ? t("_pages:common.actions.edit.successMessage")
          : t("_pages:common.actions.add.successMessage"),
      });

      navigate(AppRoutes.subscriptions);
    },
    onError: (error) => {
      if (isHttpError(error) && error.status === 400) {
        showErrorNotification({
          message: String(
            error.message ?? t("_pages:featureFlags.moduleUnavailable"),
          ),
        });
        return;
      }

      showErrorNotification({
        message: parseErrorMessage(error, t("_accessibility:errors.500")),
      });
    },
  });

  const subscriptionQuery = useQuery({
    queryKey: [
      ...SubscriptionsQueryKeys.all().queryKey,
      "detail",
      subscriptionId,
    ],
    enabled: !!subscriptionsClient && !!subscriptionId && !invalidEditRoute,
    queryFn: async () => {
      if (!subscriptionsClient || !subscriptionId) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionsClient.getById(subscriptionId);
    },
  });

  const subscriptionBillingLogsQuery = useQuery({
    queryKey: [
      ...SubscriptionsQueryKeys.all().queryKey,
      "billing-logs",
      subscriptionId,
    ],
    enabled:
      !!subscriptionsClient &&
      !!subscriptionId &&
      !invalidEditRoute &&
      isEditMode &&
      !!subscriptionQuery.data,
    queryFn: async () => {
      if (!subscriptionsClient || !subscriptionId) {
        throw new Error("subscriptions.featureDisabled");
      }

      return await subscriptionsClient.getBillingLogs(subscriptionId, {
        currentPage: 0,
        pageSize: 10,
      });
    },
  });

  useEffect(() => {
    if (!subscriptionQuery.data) return;
    reset?.(subscriptionDtoToForm(subscriptionQuery.data));
  }, [reset, subscriptionQuery.data]);

  useEffect(() => {
    if (isEditMode) return;
    reset?.(emptySubscriptionForm);
  }, [isEditMode, reset]);

  const editorActions = useMemo(() => {
    if (!isEditMode || !subscriptionQuery.data) return [];

    return [addBillingLog.action(subscriptionQuery.data)];
  }, [addBillingLog, isEditMode, subscriptionQuery.data]);

  useMobileNavbar(title, editorActions);

  const isLoading = isSubmitting || (isEditMode && subscriptionQuery.isLoading);

  return (
    <Page
      title={title}
      isLoading={isEditMode && subscriptionQuery.isLoading}
      actions={editorActions}
      queryKey={SubscriptionsQueryKeys.all().queryKey}
    >
      {invalidEditRoute ? (
        <ErrorView error={new Error(t("_accessibility:errors.404"))} />
      ) : subscriptionQuery.error ? (
        <ErrorView
          error={
            new Error(
              parseErrorMessage(
                subscriptionQuery.error,
                t("_accessibility:errors.500"),
              ),
            )
          }
        />
      ) : (
        <div className="subscription-editor-layout">
          <div className="subscription-editor-form">
            <FormContainer<SubscriptionFormType>
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              isLoading={isLoading}
              onCancel={() => navigate(AppRoutes.subscriptions)}
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
                <div className="subscription-editor-actions">
                  <Button
                    {...buttonProps.cancel}
                    variant="outlined"
                    onClick={onCancel}
                    className="subscription-editor-action-button"
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    {...buttonProps.submit}
                    variant="submit"
                    color="primary"
                    className="subscription-editor-action-button"
                  >
                    {submitLabel}
                  </Button>
                </div>
              )}
            >
              <div className="subscription-editor-form-content">
                <SubscriptionForm
                  control={control}
                  isLoading={isLoading}
                  setValue={setValue}
                  mode={isEditMode ? FormMode.Edit : FormMode.Add}
                />
              </div>
            </FormContainer>
          </div>
          {isEditMode && subscriptionId ? (
            <SubscriptionActivitySidebar
              startsAt={subscriptionQuery.data?.startsAt}
              lastPaidAt={subscriptionQuery.data?.lastPaidAt}
              billingLogs={subscriptionBillingLogsQuery.data?.items ?? []}
              billingLogsLoading={subscriptionBillingLogsQuery.isLoading}
              billingLogsError={subscriptionBillingLogsQuery.error}
            />
          ) : null}
          <AddSubscriptionBillingLogDialog {...addBillingLog} />
        </div>
      )}
    </Page>
  );
}
