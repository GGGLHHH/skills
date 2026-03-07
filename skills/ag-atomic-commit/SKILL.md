---
name: ag-atomic-commit
description: MUST invoke this skill BEFORE creating any git commit. Triggers proactively whenever you are about to run `git commit`, whether the user explicitly asks to commit or you decide to commit as part of a workflow. Also use when splitting a change set into multiple commits, reviewing diffs for commit grouping, drafting commit messages, or enforcing repository AGENTS.md commit rules. Follow the applicable AGENTS.md instructions, prefer atomic commits grouped by one coherent change, write commit messages in English, and require explicit user approval before any `git commit` or `git push`.
---

# AG Atomic Commit

Turn a working tree into a small set of reviewable commits that follow the repository's AGENTS.md rules.
Prefer the smallest coherent commit that preserves buildability and review clarity.

## Core Rules

- Read every applicable `AGENTS.md` before proposing commit boundaries. Apply the deepest matching scope.
- Treat `git commit` and `git push` as approval-gated actions. Ask every time and do not rely on prior consent.
- Require every commit message to be written in English, even when the discussion language or AGENTS instructions are not English.
- Draft the English commit message before requesting approval so the user can review wording and scope together.
- Prefer atomic commits grouped by one behavior change, fix, refactor, test addition, or generated artifact set.
- Keep unrelated edits out of the same commit even when they touch the same file.
- Explain the constraint when a perfectly atomic split would leave the tree uncompilable or obviously broken, then choose the smallest coherent batch.

## Workflow

1. Inspect the full change set.

   ```bash
   git status --short
   git diff --stat
   git diff
   git diff --cached
   ```

2. Identify commit candidates.
   - Separate by intent, not by file type.
   - Split mixed files by hunk when necessary.
   - Keep opportunistic cleanup out of feature or bug-fix commits.

3. Propose a commit plan before committing.
   For each planned commit, provide:
   - goal
   - included files or hunks
   - verification command
   - proposed English commit message

   Reject or rewrite any non-English commit title before asking for approval.

4. Stage the smallest correct scope.
   Prefer patch-based staging when files contain multiple concerns.

   ```bash
   git add -p
   git reset -p
   git restore --staged <path>
   ```

   Use whole-file staging only when the entire file belongs to the same commit.

5. Validate the staged content.
   - Re-read `git diff --cached`.
   - Run the narrowest relevant check first.
   - Avoid unrelated or excessively broad validation unless the repo requires it.

6. Ask for approval before running the commit.

   ```bash
   git commit -m "<message>"
   ```

7. Report the result after committing.

   ```bash
   git show --stat --summary HEAD
   ```

   Summarize what was committed, what remains unstaged, and the next recommended commit.

## Commit Splitting Heuristics

- Split by user-facing or reviewer-facing intent.
- Keep code and tests together when they describe the same behavior change.
- Keep migrations with the code that requires them unless the repository clearly prefers a separate migration commit and both intermediate states remain usable.
- Keep generated code or types in the same commit only when they are a direct consequence of the source change and reviewers benefit from seeing them together.
- Separate mechanical renames or formatting from logic changes unless the tool output makes separation impractical.
- Separate documentation-only updates unless the docs are required to explain the same change.

## Commit Message Guidance

Always write commit messages in English. Do not output Chinese commit titles or mixed Chinese-English subjects.
Prefer the repository's existing commit style when it is clear from recent history.
If the project style is unclear, use a short conventional format:

- `feat(scope): add ...`
- `fix(scope): handle ...`
- `refactor(scope): extract ...`
- `test(scope): cover ...`
- `docs(scope): clarify ...`
- `chore(scope): regenerate ...`

Write the subject line in imperative mood, keep it specific, and express only one intent.

Examples:

- `fix(auth): handle empty refresh token`
- `refactor(user): extract profile mapper`
- `test(api): cover invalid session response`
- `chore(types): regenerate api client types`

## Decision Rules

- Warn when the user asks for a single commit but the working tree contains unrelated changes.
- Propose a split when the user asks to commit everything and the diff contains multiple concerns.
- Explain the coupling when the diff is too tangled to split safely, then recommend the smallest acceptable grouped commit.
- Ask whether to exclude unrelated leftover changes before staging when the working tree appears to include edits from previous tasks.

## Response Pattern

When assisting with commits, respond in this order:

1. Give the conclusion.
2. Show the evidence and grouping rationale.
3. Compare alternatives when multiple split strategies are reasonable.
4. Recommend the commit plan.
5. Ask for the next approval-gated action, if any.
