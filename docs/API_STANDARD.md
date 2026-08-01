# API Standards & Client Signatures

Every network service client must follow a standard signature.

## Generic CRUD Signatures

```typescript
export interface BaseService<T> {
  list(filters?: any): Promise<T[]>;
  getById(id: string): Promise<T>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  export(format: "PDF" | "Excel" | "CSV"): Promise<Blob>;
}
```
All service clients must consume the `mockApi` delay driver in development.
