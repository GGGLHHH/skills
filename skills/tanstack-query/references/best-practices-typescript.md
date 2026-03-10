---
name: typescript
description: Type inference, queryOptions helpers, and global register patterns for TanStack Query
---

# TypeScript

TanStack Query v5 is strongly typed, but you get the best results only if your fetchers and option factories are typed well.

## Type the Fetcher, Not Every Hook Call

Avoid `any` from generic HTTP clients. Give the fetcher an explicit return type:

```ts
type Todo = {
  id: string
  title: string
}

async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch('/api/todos')
  if (!response.ok) throw new Error('Failed to fetch todos')
  return response.json() as Promise<Todo[]>
}

const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})
```

## Narrow on Status Flags

Status booleans are a discriminated union boundary:

```ts
const query = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

if (query.isSuccess) {
  query.data
}
```

## Prefer `queryOptions` and `mutationOptions`

These helpers preserve inference across:

- `useQuery`
- `useSuspenseQuery`
- `prefetchQuery`
- `getQueryData`
- `useMutation`
- `isMutating`

```ts
import { mutationOptions, queryOptions } from '@tanstack/react-query'

function todosOptions() {
  return queryOptions({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 30 * 1000,
  })
}

function saveTodoOptions() {
  return mutationOptions({
    mutationKey: ['saveTodo'],
    mutationFn: saveTodo,
  })
}
```

## Register Global Error, Meta, and Key Shapes

Use module augmentation to keep call sites ergonomic without sacrificing inference:

```ts
import '@tanstack/react-query'

type AppKey = ['dashboard' | 'marketing', ...ReadonlyArray<unknown>]

interface QueryMeta extends Record<string, unknown> {
  traceId?: string
}

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: unknown
    queryKey: AppKey
    mutationKey: AppKey
    queryMeta: QueryMeta
    mutationMeta: QueryMeta
  }
}
```

`defaultError: unknown` is a good default when you want every call site to narrow errors explicitly.

## `skipToken` Preserves Types for Conditional Queries

When a parameter is missing but the query shape should remain typed:

```ts
import { skipToken } from '@tanstack/react-query'

useQuery({
  queryKey: ['todo', todoId],
  queryFn: todoId ? () => fetchTodo(todoId) : skipToken,
})
```

## Vue Note

The Vue adapter shares the same type helpers, but returned values are refs. If you destructure and want discriminated narrowing, wrap the result in `reactive(...)` first.

<!--
Source references:
- https://tanstack.com/query/latest/docs/framework/react/typescript
- https://tanstack.com/query/latest/docs/framework/react/guides/query-options
- https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries
- https://tanstack.com/query/latest/docs/framework/vue/typescript
-->
