import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Button,
  Error as ErrorView,
  isHttpError,
  Page,
  useNotification,
} from "@sito/dashboard-app";

import { SubscriptionsQueryKeys, useMobileNavbar } from "hooks";
import { useManager } from "providers";

import { AppRoutes } from "lib";

import { SubscriptionForm } from "./components";
import { SubscriptionFormType } from "./types";
import {
  emptySubscriptionForm,
  subscriptionDtoToForm,
  subscriptionFormToCreateDto,
  subscriptionFormToUpdateDto,
} from "./utils";

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
  const queryClient = useQueryClient();
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

  useMobileNavbar(title);

  const { control, formState, handleSubmit, reset, setValue } =
    useForm<SubscriptionFormType>({
      defaultValues: emptySubscriptionForm,
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

  useEffect(() => {
    if (!subscriptionQuery.data) return;
    reset(subscriptionDtoToForm(subscriptionQuery.data));
  }, [reset, subscriptionQuery.data]);

  useEffect(() => {
    if (isEditMode) return;
    reset(emptySubscriptionForm);
  }, [isEditMode, reset]);

  const saveMutation = useMutation({
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

      return await subscriptionsClient.insert(subscriptionFormToCreateDto(values));
    },
  });

  const isSubmitting = saveMutation.isPending || formState.isSubmitting;
  const isLoading = isSubmitting || (isEditMode && subscriptionQuery.isLoading);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await saveMutation.mutateAsync(values);
      await queryClient.invalidateQueries({ ...SubscriptionsQueryKeys.all() });

      showSuccessNotification({
        message: isEditMode
          ? t("_pages:common.actions.edit.successMessage")
          : t("_pages:common.actions.add.successMessage"),
      });

      navigate(AppRoutes.subscriptions);
    } catch (error) {
      if (isHttpError(error) && error.status === 400) {
        return showErrorNotification({
          message: String(
            error.message ?? t("_pages:featureFlags.moduleUnavailable"),
          ),
        });
      }

      return showErrorNotification({
        message: parseErrorMessage(error, t("_accessibility:errors.500")),
      });
    }
  });

  return (
    <Page
      title={title}
      isLoading={isEditMode && subscriptionQuery.isLoading}
      queryKey={SubscriptionsQueryKeys.all().queryKey}
    >
      {invalidEditRoute ? (
        <ErrorView error={new Error(t("_accessibility:errors.404"))} />
      ) : subscriptionQuery.error ? (
        <ErrorView
          error={new Error(
            parseErrorMessage(subscriptionQuery.error, t("_accessibility:errors.500")),
          )}
        />
      ) : (
        <div className="w-full max-w-5xl self-center rounded-2xl base-border p-3 sm:p-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit(event);
            }}
          >
            <SubscriptionForm
              control={control}
              isLoading={isLoading}
              setValue={setValue}
            />

            <div className="flex gap-2 max-sm:flex-col-reverse">
              <Button
                type="button"
                variant="outlined"
                disabled={isLoading}
                onClick={() => navigate(AppRoutes.subscriptions)}
                className="max-sm:w-full"
              >
                {t("_pages:subscriptions.actions.cancel")}
              </Button>
              <Button
                type="submit"
                variant="submit"
                color="primary"
                disabled={isLoading}
                className="max-sm:w-full"
              >
                {isEditMode
                  ? t("_pages:common.actions.edit.text")
                  : t("_pages:common.actions.add.text")}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Page>
  );
}
