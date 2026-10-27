/** Day-count convention used to turn the nominal rate into a daily rate. */
export enum InterestDayCount {
  /** Always 365 days. */
  Act365 = 0,
  /** 365 or 366 days depending on the calendar year. */
  ActAct = 1,
  /** Always 360 days. */
  Act360 = 2,
}
