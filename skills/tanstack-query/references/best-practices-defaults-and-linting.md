---
name: defaults-and-linting
description: Important defaults, staleTime strategy, cache lifecycle, and TanStack Query ESLint rules
---

# Defaults and Linting

Most TanStack Query surprises come from not knowing the defaults. Tune them intentionally before layering custom abstractions.

## Important Defaults

By default:

- query data is considered stale immediately
- stale queries refetch when a new observer mounts
- stale queries refetch on window focus
- stale queries refetch on network reconnect
- inactive queries stay in cache for 5 minutes (`gcTime`)
- failed queries retry 3 times with exponential backoff
- structural sharing keeps stable object references when JSON-compatible data is unchanged

## `staleTime` Is the Main Lever

If TanStack Query feels too eager, raise `staleTime` before disabling refetch triggers one by one.

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})
```

Useful meanings:

- `0`: stale immediately
- `Infinity`: never refetch unless invalidated manually
- `'static'`: never refetch, even when invalidated manually

## Keep the Query Client Stable

Do not create `new QueryClient()` during every render. Use React state, module scope for pure client apps, or per-request construction on the server.

```tsx
function App() {
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>{/* ... */}</QueryClientProvider>
}
```

## Use the ESLint Plugin

```js
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  ...pluginQuery.configs['flat/recommended'],
]
```

The most valuable rules:

- `@tanstack/query/exhaustive-deps`
  Every variable used by `queryFn` must also be present in `queryKey`.
- `@tanstack/query/stable-query-client`
  Prevents recreating `QueryClient` on every render.
- `@tanstack/query/no-unstable-deps`
  Do not put the whole query or mutation result object into React hook dependency arrays.

Instead of this:

```tsx
const mutation = useMutation({ mutationFn: saveTodo })
const onClick = useCallback(() => mutation.mutate(todo), [mutation])
```

Do this:

```tsx
const { mutate } = useMutation({ mutationFn: saveTodo })
const onClick = useCallback(() => mutate(todo), [mutate])
```

## Prefer Declarative Queries

Reaching for `enabled: false` everywhere usually means query dependencies are not modeled well yet. Encode dependencies in `queryKey`, `enabled`, or framework-level loaders first.

<!--
Source references:
- https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query
- https://tanstack.com/query/latest/docs/eslint/stable-query-client
- https://tanstack.com/query/latest/docs/eslint/no-unstable-deps
- https://tanstack.com/query/latest/docs/eslint/exhaustive-deps
-->
