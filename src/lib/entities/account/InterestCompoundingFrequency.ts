/** When credited interest joins the interest-earning balance. */
export enum InterestCompoundingFrequency {
  Daily = 0,
  Monthly = 1,
  Quarterly = 2,
  Annually = 3,
  /** Credited interest never earns interest. */
  None = 4,
}
