import type { FeatureOf } from "@sito/feature-usage";

import type { WALLET_FEATURES } from "./constants";

export type WalletFeature = FeatureOf<typeof WALLET_FEATURES>;
