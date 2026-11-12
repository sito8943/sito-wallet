/** How the "Adjust points" dialog changes the rewards balance. */
export enum AdjustRewardsMode {
  /** Add (or redeem, when negative) points: sent as `delta`. */
  Delta = "delta",
  /** Set the shown balance to the bank's value: sent as `balance`. */
  Balance = "balance",
}
