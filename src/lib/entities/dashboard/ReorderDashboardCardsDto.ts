export interface ReorderDashboardCardPositionDto {
  id: number;
  position: number;
}

export interface ReorderDashboardCardsDto {
  userId: number;
  cards: ReorderDashboardCardPositionDto[];
}
