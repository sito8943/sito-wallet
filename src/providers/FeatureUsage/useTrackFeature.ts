// @sito/feature-usage
import { useTrack } from "@sito/feature-usage/react";

// lib
import type { WalletFeature } from "lib";

/** `const track = useTrackFeature(); track("page.home")`: typed to the wallet catalogue. */
export const useTrackFeature = () => useTrack<WalletFeature>();
