import type { AddProductDto } from "./AddProductDto";
import type { DeleteDto } from "@sito/dashboard-app";

export interface UpdateProductDto extends AddProductDto, DeleteDto {}
