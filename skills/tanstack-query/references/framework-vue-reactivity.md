---
name: vue-reactivity
description: Preserve Vue reactivity in query keys and enabled conditions
---

# Vue Reactivity

Vue Query tracks reactive values inside query options. If you strip reactivity too early, the query will stop updating when inputs change.

## Do Not Pass `.value` If the Query Should Track Changes

This loses reactivity:

```ts
export function useUserProjects(userId: string) {
  return useQuery({
    queryKey: ['userProjects', userId],
    queryFn: () => api.fetchUserProjects(userId),
  })
}

const userId = ref('1')
useUserProjects(userId.value)
```

Pass the ref or getter directly instead:

```ts
import { toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'

export function useUserProjects(userId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['userProjects', userId],
    queryFn: () => api.fetchUserProjects(toValue(userId)),
  })
}

const userId = ref('1')
useUserProjects(userId)
```

## Prefer `MaybeRefOrGetter` in Reusable Composables

This keeps the composable flexible:

- plain value for one-off fetches
- ref for reactive inputs
- getter for derived reactive values

## Props Need a Getter or Computed Wrapper

Direct property access loses reactivity:

```ts
const props = defineProps<{ userId: string }>()

useUserProjects(() => props.userId)
```

For trivial property access, a getter is usually simpler than creating a `computed`.

## `enabled` Can Be Reactive Too

```ts
export function useUserProjects(userId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['userProjects', userId],
    queryFn: () => api.fetchUserProjects(toValue(userId)),
    enabled: () => !!toValue(userId),
  })
}
```

Use this for dependent queries instead of imperative `refetch` flows.

## Query Results Are Immutable

Values returned from `useQuery` are not for in-place mutation or `v-model`.

If the UI needs a writable draft:

```ts
const form = ref<TodoForm | null>(null)

watchEffect(() => {
  form.value = todo.value ? { ...todo.value } : null
})
```

Copy query data into local editable state before mutating it.

<!--
Source references:
- https://tanstack.com/query/latest/docs/framework/vue/reactivity
- https://tanstack.com/query/latest/docs/framework/vue/quick-start
-->
