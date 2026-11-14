import type { DeleteDto } from "@sito/dashboard-app";

import type { AddGoalDto } from "./AddGoalDto";

export interface UpdateGoalDto extends AddGoalDto, DeleteDto {}
