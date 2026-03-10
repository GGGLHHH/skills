---
name: ssr-and-hydration
description: Server prefetching, dehydrate/hydrate, and request-scoped QueryClient patterns
---

# SSR and Hydration

SSR with TanStack Query has three steps:

1. create a server-side `QueryClient`
2. prefetch the queries you need
3. `dehydrate` on the server and `hydrate` on the client

## React SSR Pattern

Create a request-scoped client on the server and a stable client in the browser:

```tsx
import { QueryClient } from '@tanstack/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}
```

On the server:

```tsx
const queryClient = makeQueryClient()

await queryClient.prefetchQuery({
  queryKey: ['posts'],
  queryFn: getPosts,
})

const dehydratedState = dehydrate(queryClient)
```

At the route boundary:

```tsx
<HydrationBoundary state={dehydratedState}>
  <Posts />
</HydrationBoundary>
```

Inside hydrated client components, keep using `useQuery` normally:

```tsx
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: getPosts,
})
```

## Do Not Share Query Cache Across Requests

Never create a server `QueryClient` at module scope for SSR. That leaks cache between users and requests.

Per-request creation is the safe default.

## Set `staleTime` Above Zero for SSR

Without it, hydrated queries are stale immediately and usually refetch as soon as the browser mounts. A small `staleTime` often removes wasteful double-fetching.

## Suspense Requires Discipline

If you use suspenseful query APIs after SSR, make sure every suspenseful query is prefetched. Otherwise you can cause unexpected server fetches, client refetches, or hydration mismatch behavior.

After successful hydration, plain `useQuery` is usually the safer default for already-prefetched data.

## Vue SSR Pattern

In Vue/Nuxt/Vite SSR, the shape is the same:

- create a fresh `QueryClient` per request
- install `VueQueryPlugin`
- prefetch with `prefetchQuery` or `suspense()`
- serialize with `dehydrate`
- restore with `hydrate`

Nuxt 3 plugin shape:

```ts
import {
  QueryClient,
  VueQueryPlugin,
  dehydrate,
  hydrate,
} from '@tanstack/vue-query'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5000 } },
})

nuxt.vueApp.use(VueQueryPlugin, { queryClient })
```

Then in a component:

```ts
const { data, suspense } = useQuery({
  queryKey: ['test'],
  queryFn: fetcher,
})

onServerPrefetch(async () => {
  await suspense()
})
```

## SSR Caveats

- Only successful queries are dehydrated by default.
- Use `fetchQuery` and explicit error handling when you need server-rendered error states.
- On Vue SSR, large traffic plus long-lived server caches can increase memory usage. Clear or scope caches carefully if you override server `gcTime`.

<!--
Source references:
- https://tanstack.com/query/latest/docs/framework/react/guides/ssr
- https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr
- https://tanstack.com/query/latest/docs/framework/vue/guides/ssr
-->
