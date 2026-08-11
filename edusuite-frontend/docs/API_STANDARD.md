# API Standards & Client Signatures (Repository Pattern)

Every module must use the **Repository Pattern** to decouple the UI components and React custom hooks from the underlying data source (e.g., Mock Server, Supabase, or custom REST APIs).

---

## 1. Repository Interface Definition

Define a repository interface for each feature domain in `src/modules/[module]/repositories/`. The interface defines the type signature of all data operations:

```typescript
import type { AttendancePrediction } from "../types";
import type { DepartmentCode } from "@/config/roles";

export interface IAttendanceRepository {
  getPredictions(department?: DepartmentCode): Promise<AttendancePrediction[]>;
  sendAlert(studentId: string, recipient: string): Promise<boolean>;
}
```

---

## 2. Mock Repository Implementation

Always build the frontend-first mock implementation inside the same repository file or a `mock/` subfolder:

```typescript
import { api } from "../services/api";

export class MockAttendanceRepository implements IAttendanceRepository {
  getPredictions(department?: DepartmentCode): Promise<AttendancePrediction[]> {
    return api.get<AttendancePrediction[]>("/attendance/predictions", { department });
  }

  sendAlert(studentId: string, recipient: string): Promise<boolean> {
    return api.post<{ success: boolean }>("/attendance/alert", { studentId, recipient }).then((res) => res.success);
  }
}
```

---

## 3. Dynamic Selector & Export

Expose a single active instance from the repository file. A centralized toggle config determines the implementation strategy:

```typescript
// Define active implementation switch
const ACTIVE_IMPL: "mock" | "supabase" | "rest" = "mock";

export const attendanceRepository: IAttendanceRepository =
  ACTIVE_IMPL === "mock" 
    ? new MockAttendanceRepository() 
    : new SupabaseAttendanceRepository(); // placeholder for production backend

export default attendanceRepository;
```

---

## 4. Generic CRUD Template

For simple entity resources, use the generic repository contract standard:

```typescript
export interface IBaseRepository<T> {
  list(filters?: any): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}
```
