---
name: pagination-and-prefetching
description: Paginated queries, infinite queries, and cache prefetch patterns
---

# Pagination and Prefetching

TanStack Query supports both page-based queries and cursor-based infinite lists. The goal is to keep navigation responsive while reducing request waterfalls.

## Paginated Queries with `placeholderData`

Each page should be encoded in the query key. Then keep the previous page visible while the next one loads:

```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const result = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  placeholderData: keepPreviousData,
})
```

This avoids the UI flickering back to a full loading state every time the page changes.

Key signals:

- `isPlaceholderData`: currently rendering stale carry-over data
- `isFetching`: background fetch still in flight

## Infinite Queries Need Explicit Page Plumbing

Use `useInfiniteQuery` when the API returns cursor or page information.

```tsx
const projects = useInfiniteQuery({
  queryKey: ['projects'],
  queryFn: ({ pageParam }) => fetchProjects(pageParam),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  maxPages: 3,
})
```

Important differences from `useQuery`:

- `data.pages` contains each fetched page
- `data.pageParams` tracks page params
- `fetchNextPage` / `fetchPreviousPage` load more data
- `isFetchingNextPage` is separate from general background `isFetching`

## Guard `fetchNextPage`

There is only one cache entry for the entire infinite query. Avoid firing `fetchNextPage()` while another fetch is already running unless you intentionally change `cancelRefetch`.

```tsx
if (projects.hasNextPage && !projects.isFetching) {
  projects.fetchNextPage()
}
```

## Prefetch Queries Before the User Needs Them

### Event-driven prefetch

```tsx
const prefetchDetails = () =>
  queryClient.prefetchQuery({
    queryKey: ['todo', todoId],
    queryFn: () => fetchTodo(todoId),
    staleTime: 60 * 1000,
  })
```

Good for hover, focus, or route-intent scenarios.

### Component-driven prefetch

Prefetch a likely descendant query to flatten waterfalls:

```tsx
useQuery({
  queryKey: ['article-comments', articleId],
  queryFn: () => fetchComments(articleId),
  notifyOnChangeProps: [],
})
```

### Server prefetch

Use `prefetchQuery` or `prefetchInfiniteQuery` in loaders / server components, then dehydrate. See the SSR reference for the full pattern.

## `prefetchQuery` vs `fetchQuery` vs `ensureQueryData`

- `prefetchQuery`: warms cache, returns `Promise<void>`, never throws
- `fetchQuery`: resolves actual data, throws on errors
- `ensureQueryData`: returns cached data if present even when stale, otherwise fetches

Use `prefetchQuery` for speculative work and `fetchQuery`/`ensureQueryData` when the caller actually needs data immediately.

<!--
Source references:
- https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries
- https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries
- https://tanstack.com/query/latest/docs/framework/react/guides/prefetching
-->
