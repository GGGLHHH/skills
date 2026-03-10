---
name: mutations-and-cache-updates
description: useMutation, invalidation, direct cache writes, and optimistic updates
---

# Mutations and Cache Updates

Use `useMutation` for create/update/delete flows and any server-side side effect. The key design choice is how query cache should reflect the mutation outcome.

## Baseline Mutation

```tsx
const queryClient = useQueryClient()

const createTodo = useMutation({
  mutationFn: postTodo,
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

Mutation state mirrors the query model:

- `isIdle`
- `isPending`
- `isError`
- `isSuccess`

Use `mutateAsync` when mutation composition is easier as a promise chain:

```ts
const mutation = useMutation({ mutationFn: saveTodo })
const todo = await mutation.mutateAsync(input)
```

## Choose Between Invalidation and Direct Cache Writes

Use `invalidateQueries` when:

- the server is the source of truth
- the mutation affects list membership, counts, or unknown related queries
- refetching is simpler than reconstructing correct cache state

Use `setQueryData` when:

- the mutation response already contains the updated entity
- you want to avoid an extra network roundtrip
- the update target is a single known cache entry

```tsx
const updateTodo = useMutation({
  mutationFn: editTodo,
  onSuccess: (data, variables) => {
    queryClient.setQueryData(['todo', variables.id], data)
  },
})
```

## Cache Writes Must Be Immutable

Never mutate cached objects in place.

```ts
queryClient.setQueryData(['todo', id], (old) =>
  old
    ? {
        ...old,
        title: nextTitle,
      }
    : old,
)
```

## Optimistic UI: Two Valid Patterns

### 1. UI-only optimistic state

Use mutation `variables` if only one local view needs the pending item:

```tsx
const addTodo = useMutation({
  mutationFn: postTodo,
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
})

{todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
{addTodo.isPending && <li style={{ opacity: 0.5 }}>{addTodo.variables.title}</li>}
```

### 2. Cache-level optimistic state

Use `onMutate` when multiple subscribers must see the optimistic value:

```ts
useMutation({
  mutationFn: updateTodo,
  onMutate: async (draft, context) => {
    await context.client.cancelQueries({ queryKey: ['todos'] })

    const previousTodos = context.client.getQueryData<Todo[]>(['todos'])

    context.client.setQueryData<Todo[]>(['todos'], (old = []) => [
      ...old,
      draft,
    ])

    return { previousTodos }
  },
  onError: (_error, _draft, result, context) => {
    context.client.setQueryData(['todos'], result?.previousTodos)
  },
  onSettled: (_data, _error, _draft, _result, context) => {
    return context.client.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

Cancel the in-flight query first so a background refetch does not overwrite your optimistic patch.

## Cross-Component Optimistic Rendering

If the mutation and consuming UI live in different components, `useMutationState` plus `mutationKey` can expose pending variables elsewhere. Use this sparingly; prefer colocated UI-only optimistic rendering when possible.

<!--
Source references:
- https://tanstack.com/query/latest/docs/framework/react/guides/mutations
- https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations
- https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses
- https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates
-->
