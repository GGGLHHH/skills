export interface VendorSkillMeta {
  official?: boolean
  source: string
  skills: Record<string, string> // sourceSkillName -> outputSkillName
}

/**
 * Repositories to clone as submodules and generate skills from source
 */
export const submodules = {
  'react': 'https://github.com/reactjs/react.dev',
  'tanstack-query': 'https://github.com/TanStack/query',
  'tailwindcss': 'https://github.com/tailwindlabs/tailwindcss.com',
  'vue': 'https://github.com/vuejs/docs',
  'nuxt': 'https://github.com/nuxt/nuxt',
  'vite': 'https://github.com/vitejs/vite',
  'unocss': 'https://github.com/unocss/unocss',
  'pnpm': 'https://github.com/pnpm/pnpm.io',
  'pinia': 'https://github.com/vuejs/pinia',
  'vitest': 'https://github.com/vitest-dev/vitest',
  'vitepress': 'https://github.com/vuejs/vitepress',
}

/**
 * Already generated skills, sync with their `skills/` directory
 */
export const vendors: Record<string, VendorSkillMeta> = {
  'agent-browser': {
    official: true,
    source: 'https://github.com/vercel-labs/agent-browser',
    skills: {
      'agent-browser': 'agent-browser',
    },
  },
  'slidev': {
    official: true,
    source: 'https://github.com/slidevjs/slidev',
    skills: {
      slidev: 'slidev',
    },
  },
  'vueuse': {
    official: true,
    source: 'https://github.com/vueuse/skills',
    skills: {
      'vueuse-functions': 'vueuse-functions',
    },
  },
  'tsdown': {
    official: true,
    source: 'https://github.com/rolldown/tsdown',
    skills: {
      tsdown: 'tsdown',
    },
  },
  'shadcn': {
    official: true,
    source: 'https://github.com/shadcn-ui/ui',
    skills: {
      shadcn: 'shadcn',
    },
  },
  'superpowers': {
    official: true,
    source: 'https://github.com/obra/superpowers',
    skills: {
      'brainstorming': 'brainstorming',
      'dispatching-parallel-agents': 'dispatching-parallel-agents',
      'executing-plans': 'executing-plans',
      'finishing-a-development-branch': 'finishing-a-development-branch',
      'receiving-code-review': 'receiving-code-review',
      'requesting-code-review': 'requesting-code-review',
      'subagent-driven-development': 'subagent-driven-development',
      'systematic-debugging': 'systematic-debugging',
      'test-driven-development': 'test-driven-development',
      'using-git-worktrees': 'using-git-worktrees',
      'using-superpowers': 'using-superpowers',
      'verification-before-completion': 'verification-before-completion',
      'writing-plans': 'writing-plans',
      'writing-skills': 'writing-skills',
    },
  },
  'vuejs-ai': {
    source: 'https://github.com/vuejs-ai/skills',
    skills: {
      'vue-best-practices': 'vue-best-practices',
      'vue-router-best-practices': 'vue-router-best-practices',
      'vue-testing-best-practices': 'vue-testing-best-practices',
    },
  },
  'turborepo': {
    official: true,
    source: 'https://github.com/vercel/turborepo',
    skills: {
      turborepo: 'turborepo',
    },
  },
  'web-design-guidelines': {
    source: 'https://github.com/vercel-labs/agent-skills',
    skills: {
      'web-design-guidelines': 'web-design-guidelines',
    },
  },
}

/**
 * Hand-written skills with Anthony Fu's preferences/tastes/recommendations
 */
export const manual = [
  'antfu',
]
