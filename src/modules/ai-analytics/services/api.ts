import { mockApi } from "./mockApi";

export const api = {
  get: <T>(url: string, params?: any): Promise<T> => {
    return mockApi.get<T>(url, params);
  },
  post: <T>(url: string, data?: any): Promise<T> => {
    return mockApi.post<T>(url, data);
  },
  put: <T>(url: string, data?: any): Promise<T> => {
    return mockApi.put<T>(url, data);
  },
  delete: <T>(url: string): Promise<T> => {
    return mockApi.delete<T>(url);
  },
};
