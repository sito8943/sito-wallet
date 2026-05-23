import { faRepeat } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { ImportDialog, useImportDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { SubscriptionProvidersQueryKeys } from "hooks";
import {
  useAddSubscriptionProviderDialog,
  useAddPrefabSubscriptionProvidersDialog,
} from "views/SubscriptionProviders/hooks";

// components
import {
  AddSubscriptionProviderDialog,
  AddPrefabSubscriptionProvidersDialog,
} from "views/SubscriptionProviders/components";

// lib
import type {
  ImportPreviewSubscriptionProviderDto,
  SubscriptionProviderDto,
} from "lib";
import { Tables } from "lib";

// components
import { OnboardingSetupStep } from "./OnboardingSetupStep";

export function SubscriptionsSetup() {
  const manager = useManager();
  const addSubscriptionProvider = useAddSubscriptionProviderDialog();
  const prefabSubscriptionProviders = useAddPrefabSubscriptionProvidersDialog();
  const subscriptionProvidersClient =
    "SubscriptionProviders" in manager ? manager.SubscriptionProviders : null;

  const importSubscriptionProviders = useImportDialog<
    SubscriptionProviderDto,
    ImportPreviewSubscriptionProviderDto
  >({
    entity: Tables.SubscriptionProviders,
    fileProcessor: (file, options) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }
      return subscriptionProvidersClient.processImport(file, options?.override);
    },
    mutationFn: (data) => {
      if (!subscriptionProvidersClient) {
        throw new Error("subscriptions.featureDisabled");
      }
      return subscriptionProvidersClient.import(data);
    },
    ...SubscriptionProvidersQueryKeys.all(),
  });

  return (
    <>
      <OnboardingSetupStep
        titleKey="_pages:onboarding.setup.subscriptions.title"
        descriptionKey="_pages:onboarding.setup.subscriptions.description"
        createIcon={faRepeat}
        onCreate={() => addSubscriptionProvider.openDialog()}
        onImport={() => importSubscriptionProviders.action().onClick()}
        onPrefab={() => prefabSubscriptionProviders.openDialog()}
      />
      <AddSubscriptionProviderDialog {...addSubscriptionProvider} />
      <ImportDialog {...importSubscriptionProviders} />
      <AddPrefabSubscriptionProvidersDialog {...prefabSubscriptionProviders} />
    </>
  );
}
