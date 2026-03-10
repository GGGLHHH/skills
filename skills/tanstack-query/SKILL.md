---
name: tanstack-query
description: TanStack Query v5 server-state management for React and Vue. Use when fetching, caching, invalidating, paginating, prefetching, or hydrating async server data with QueryClient, useQuery, or useMutation.
metadata:
  author: Anthony Fu
  version: "2026.3.10"
  source: Generated from https://github.com/TanStack/query, scripts located at https://github.com/antfu/skills
---

# TanStack Query

TanStack Query manages server state with declarative queries, cache-aware mutations, background refetching, pagination, and SSR hydration. This skill focuses on v5 object-syntax APIs and the React/Vue adapters that are most relevant in this repository.

> The skill is based on TanStack Query v5 docs, generated at 2026-03-10, using react-query v5.90.21 and vue-query v5.92.9.

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Queries and Client | Stable `QueryClient`, provider/plugin setup, `useQuery`, query states, cancellation | [core-queries-and-client](references/core-queries-and-client.md) |
| Query Keys and Options | Query key design, reusable option factories, lazy queries, `skipToken` | [core-query-keys-and-options](references/core-query-keys-and-options.md) |

## Features

| Topic | Description | Reference |
|-------|-------------|-----------|
| Mutations and Cache Updates | `useMutation`, invalidation, `setQueryData`, optimistic updates | [features-mutations-and-cache-updates](references/features-mutations-and-cache-updates.md) |
| Pagination and Prefetching | `placeholderData`, `useInfiniteQuery`, `prefetchQuery`, waterfall reduction | [features-pagination-and-prefetching](references/features-pagination-and-prefetching.md) |

## Best Practices

| Topic | Description | Reference |
|-------|-------------|-----------|
| Defaults and Linting | Staleness, retries, garbage collection, ESLint rules, stable clients | [best-practices-defaults-and-linting](references/best-practices-defaults-and-linting.md) |
| TypeScript | Typed fetchers, `queryOptions`, `mutationOptions`, global register patterns | [best-practices-typescript](references/best-practices-typescript.md) |

## Framework Notes

| Topic | Description | Reference |
|-------|-------------|-----------|
| Vue Reactivity | Passing refs/getters into `queryKey`, reactive `enabled`, immutable results | [framework-vue-reactivity](references/framework-vue-reactivity.md) |

## Advanced

| Topic | Description | Reference |
|-------|-------------|-----------|
| SSR and Hydration | Prefetching, `dehydrate`/`hydrate`, `HydrationBoundary`, per-request clients | [advanced-ssr-and-hydration](references/advanced-ssr-and-hydration.md) |

## Key Recommendations

- Prefer `staleTime` tuning over ad-hoc `enabled: false` patterns.
- Keep `QueryClient` stable for the whole app lifecycle, or per request on the server.
- Put every query dependency into `queryKey`; treat it like a dependency array for `queryFn`.
- Share query definitions with `queryOptions` instead of duplicating `queryKey` and `queryFn`.
- Use `invalidateQueries` when the server is the source of truth, and `setQueryData` when the mutation response already contains the updated record.
- In Vue, pass refs or getters directly to query options instead of stripping reactivity with `.value`.
