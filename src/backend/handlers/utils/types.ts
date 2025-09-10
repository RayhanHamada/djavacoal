import { middlewares } from "@/backend/handlers/utils/middlewares";

type Middleware = typeof middlewares;
type Contexts = {
  [K in keyof Middleware]: Awaited<ReturnType<Middleware[K]>>["context"];
};

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

// Merge all nested objects into one
type MergeNested<T> = UnionToIntersection<T[keyof T]>;

export type RootContext = MergeNested<Contexts>;
