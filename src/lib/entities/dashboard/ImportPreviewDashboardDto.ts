import type { ImportPreviewDto } from "../ImportPreviewDto";
import type { DashboardDto } from "./DashboardDto";

export interface ImportPreviewDashboardDto
  extends Omit<DashboardDto, "user">, ImportPreviewDto {}
