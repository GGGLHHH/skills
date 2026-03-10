---
name: ai-tooling
description: Nuxt MCP server and llms.txt routes for agent-friendly documentation access
---

# AI Tooling

Nuxt now publishes AI-oriented documentation entry points that are directly useful for coding agents. Use them when an agent needs authoritative Nuxt guidance without scraping the whole docs site.

## Nuxt MCP Server

Nuxt exposes a remote MCP server at `https://nuxt.com/mcp`.

This is useful when your agent runtime supports MCP and you want:

- structured documentation lookup instead of raw web search
- deploy-provider discovery
- version-aware documentation browsing
- guided prompts for migration and deployment flows

### Available resource types

- documentation pages
- blog posts
- deployment providers

### High-value tools

- `list_documentation_pages`
- `get_documentation_page`
- `get_getting_started_guide`
- `list_deploy_providers`
- `get_deploy_provider`

Use MCP first when the task is Nuxt-specific and your agent can call external tools. It is a better fit than copying large chunks of docs into prompts.

## `llms.txt` Routes

Nuxt also publishes two LLM-oriented text endpoints:

- `https://nuxt.com/llms.txt`
  A compact overview of docs links and structure. Prefer this first.
- `https://nuxt.com/llms-full.txt`
  A much larger export with detailed documentation, API references, blog posts, and deployment guides.

Prefer `llms.txt` for normal coding assistance. Reach for `llms-full.txt` only when you need broader implementation detail and the model context budget can handle it.

## Practical Agent Workflow

1. Use MCP if the agent supports it.
2. Otherwise load `llms.txt` for broad orientation.
3. Only use the full export or full docs pages when the task needs implementation detail.

## When to Use This Reference

Use this reference when the task involves:

- configuring Nuxt-aware AI workflows
- connecting Claude Code / Cursor / VS Code / ChatGPT to Nuxt docs
- bootstrapping repository-level guidance for Nuxt assistants
- choosing between MCP access and `llms.txt` ingestion

<!--
Source references:
- https://nuxt.com/docs/guide/ai/mcp
- https://nuxt.com/docs/guide/ai/llms-txt
-->
