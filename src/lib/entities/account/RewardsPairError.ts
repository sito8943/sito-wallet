/** Why a spend unit / points per unit pair is rejected. */
export enum RewardsPairError {
  /** Only one of the two fields is set: both or none. */
  Incomplete = "incomplete",
  /** A set value is not > 0. */
  NotPositive = "notPositive",
}
