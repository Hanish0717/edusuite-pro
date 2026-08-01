// Lightweight API client with Request Interceptors & 401 handling using native fetch

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = "/") {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = typeof window !== "undefined" ? localStorage.getItem("cms_token") : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint.replace(/^\//, "")}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cms_token");
          localStorage.removeItem("cms_user");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }

      let data: any = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      return {
        data: [] as any,
        status: 500,
        statusText: "Internal Error",
      };
    }
  }

  public async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  public async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

const api = new ApiClient();
export default api;
