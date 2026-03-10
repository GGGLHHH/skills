---
name: query-keys-and-options
description: Query key design, reusable option factories, lazy queries, and skipToken
---

# Query Keys and Options

Query keys are the cache identity of TanStack Query. Treat them like the dependency list for your `queryFn`.

## Design Query Keys from Data Shape

- Top-level query keys must be arrays.
- Include every variable the `queryFn` depends on.
- Keep them serializable.
- Object property order does not matter, array item order does.

```ts
useQuery({
  queryKey: ['todos', { status, page }],
  queryFn: () => fetchTodos({ status, page }),
})
```

These are equivalent:

```ts
['todos', { status, page }]
['todos', { page, status }]
```

These are different:

```ts
['todos', status, page]
['todos', page, status]
```

## Centralize Shared Query Definitions

Use `queryOptions` to colocate `queryKey`, `queryFn`, and stable defaults in one place.

```ts
import { queryOptions } from '@tanstack/react-query'

function todoOptions(id: string) {
  return queryOptions({
    queryKey: ['todo', id],
    queryFn: () => fetchTodo(id),
    staleTime: 60 * 1000,
  })
}

useQuery(todoOptions(todoId))
queryClient.prefetchQuery(todoOptions(todoId))
queryClient.getQueryData(todoOptions(todoId).queryKey)
```

For infinite lists, use `infiniteQueryOptions` the same way.

## Prefer Declarative Lazy Queries

If a query depends on user input or another value, keep the dependency in `queryKey` and gate execution with `enabled`:

```ts
useQuery({
  queryKey: ['todos', filter],
  queryFn: () => fetchTodos(filter),
  enabled: !!filter,
})
```

This preserves cache identity and background refetch behavior once the dependency becomes available.

## `skipToken` for Type-Safe Disabled Queries

If you want to disable a query without losing type safety, swap the `queryFn`:

```ts
import { skipToken, useQuery } from '@tanstack/react-query'

useQuery({
  queryKey: ['todos', filter],
  queryFn: filter ? () => fetchTodos(filter) : skipToken,
})
```

Use `enabled: false` when you need `refetch()`. `skipToken` intentionally does not support `refetch()`.

## Avoid Imperative Query Triggers by Default

Permanent `enabled: false` moves you out of TanStack Query's declarative model:

- no auto-fetch on mount
- no auto-refetch on focus/reconnect
- ignores invalidation-triggered refetches

Prefer expressing the dependency in `queryKey` and `enabled`.

<!--
Source references:
- https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
- https://tanstack.com/query/latest/docs/framework/react/guides/query-options
- https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries
- https://tanstack.com/query/latest/docs/eslint/exhaustive-deps
-->
