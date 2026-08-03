import type { ApiResponse } from "../types/api.types";

export interface IBaseRepository<T> {
  list(filters?: any): Promise<ApiResponse<T[]>>;
  getById(id: string): Promise<ApiResponse<T>>;
  create(data: Omit<T, "id">): Promise<ApiResponse<T>>;
  update(id: string, data: Partial<T>): Promise<ApiResponse<T>>;
  delete(id: string): Promise<ApiResponse<boolean>>;
}
