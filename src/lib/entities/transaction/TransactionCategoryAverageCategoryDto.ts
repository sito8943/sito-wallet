export interface TransactionCategoryAverageCategoryDto {
  id: number;
  name: string;
  color: string | null;
  total: number;
  transactionCount: number;
  averagePerPeriod: number;
}
