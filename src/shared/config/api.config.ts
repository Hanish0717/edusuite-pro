export const apiConfig = {
  baseUrl: process.env["NODE_ENV"] === "production" ? "/api/v2" : "http://localhost:8080/api/v2",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  mockLatencyMs: 800, // delay for mock network simulation
};
export default apiConfig;
