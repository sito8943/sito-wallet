import { ImportPreviewDto } from "../ImportPreviewDto";
import { DashboardDto } from "./DashboardDto";

export interface ImportPreviewDashboardDto
  extends Omit<DashboardDto, "user">,
    ImportPreviewDto {}

