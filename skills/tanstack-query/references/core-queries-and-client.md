---
name: queries-and-client
description: Stable QueryClient setup, useQuery basics, query states, and cancellation
---

# Queries and Client

Start by creating exactly one `QueryClient` per app lifecycle on the client, or one per request on the server. Every query and mutation hangs off that client.

## React Setup

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

## Vue Setup

```ts
import { createApp } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

const app = createApp(App)
const queryClient = new QueryClient()

app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
```

## Basic Query Pattern

`useQuery` is a declarative subscription to async server data. The minimum contract is:

- `queryKey`: unique, serializable cache identity
- `queryFn`: promise-returning fetcher that resolves data or throws

```tsx
import { useQuery } from '@tanstack/react-query'

function TodoList() {
  const { isPending, isError, error, data, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  if (isPending) return <p>Loading...</p>
  if (isError) return <p>{error.message}</p>

  return (
    <>
      <ul>{data.map(todo => <li key={todo.id}>{todo.title}</li>)}</ul>
      {isFetching && <small>Refreshing...</small>}
    </>
  )
}
```

In Vue the API shape is the same, but returned fields are refs:

```vue
<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

const { data, isPending, isError, error } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})
</script>
```

## Query State Semantics

- `status` / `isPending`: whether data exists yet
- `status` / `isError`: the fetch failed
- `status` / `isSuccess`: data is available
- `fetchStatus` / `isFetching`: whether a fetch is currently running

This distinction matters because a query can be `success` and still be `fetching` during a background refresh.

## Query Functions Should Throw on Failure

`fetch` does not throw for non-2xx responses, so normalize errors inside `queryFn`:

```ts
async function fetchTodo(id: string) {
  const response = await fetch(`/api/todos/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch todo ${id}`)
  }
  return response.json() as Promise<Todo>
}
```

## Use QueryFunctionContext Instead of Capturing Everything

When useful, read parameters from the `queryKey` and use the built-in `AbortSignal`:

```ts
useQuery({
  queryKey: ['todo', todoId],
  queryFn: ({ queryKey, signal }) => {
    const [, id] = queryKey as ['todo', string]
    return fetch(`/api/todos/${id}`, { signal }).then((res) => {
      if (!res.ok) throw new Error('Request failed')
      return res.json() as Promise<Todo>
    })
  },
})
```

## Cancellation Is Opt-In

TanStack Query passes `signal` to every query function. If you forward it to `fetch`, `axios`, or GraphQL clients, stale or manually cancelled requests can abort early.

```ts
const query = useQuery({
  queryKey: ['todos'],
  queryFn: ({ signal }) => fetch('/api/todos', { signal }).then(r => r.json()),
})

queryClient.cancelQueries({ queryKey: ['todos'] })
```

If you do not consume `signal`, the request usually completes and its result can still populate the cache.

<!--
Source references:
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://tanstack.com/query/latest/docs/framework/react/quick-start
- https://tanstack.com/query/latest/docs/framework/react/guides/queries
- https://tanstack.com/query/latest/docs/framework/react/guides/query-functions
- https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation
- https://tanstack.com/query/latest/docs/framework/vue/installation
- https://tanstack.com/query/latest/docs/framework/vue/quick-start
-->
