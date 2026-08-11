export interface ModuleRecord {
  id: string;
  code: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface ModuleFilters {
  search: string;
  status: string;
}

export interface StandardQueryParams {
  search?: string;
  filters?: Record<string, any>;
  sort?: { field: string; order: "asc" | "desc" };
  pagination?: { page: number; limit: number };
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
