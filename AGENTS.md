
# Agent Guide

## Purpose

Template repository for dependency-free Bun and TypeScript CLIs.

## Runtime

- Use Bun commands only.
- Install dependencies with `bun install`.
- Run the CLI with `bun run exec -- greet <name>`.
- Build the standalone binary with `bun run build`.
- Run static validation with `bun run check`.
- Run tests with `bun run test`.
- Apply repository formatting with `bun run fix`.

## Development Rules

- Keep dependencies minimal and clearly justified.
- Keep the CLI surface small and explicit.
- Keep the structure aligned to `cli/`, `app/`, and feature-owned modules.
- Do not add silent fallback behavior.
- Keep tests focused on externally observable behavior.
- Do not read `.mx/*.md` unless explicitly requested by the user.
