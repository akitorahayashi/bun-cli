
# Agent Guide

## Purpose

Template repository for Bun and TypeScript CLIs.

## Runtime

- Use Bun commands only.
- Keep the package as ESM with `type: "module"` in `package.json`.
- Install dependencies with `bun install`.
- Run the CLI with `bun run bun-cli greet <name>`.
- Build the standalone binary with `bun run build`.
- Run static validation with `bun run check`.
- Run tests with `bun run test`.
- Apply repository formatting with `bun run fix`.

## Development Rules

- Keep dependencies minimal and clearly justified.
- Delegate the command-line boundary to `cli-kit`'s `runCli` (help rendering, routing, version, exit-code mapping). `program.ts` only supplies metadata and registers commands; it imports the `CAC` type from `cli-kit`, not `cac` directly.
- Command files declare commands on the `CAC` program via cac's API (`command`/`option`/`alias`/`action`); cac is a transitive dependency through `cli-kit`.
- Domain errors extend `AppError` from `cli-kit`; `errors.ts` re-exports the base classes.
- Keep the CLI surface small and explicit.
- Keep the structure aligned to `cli/`, `app/`, and feature-owned modules.
- Do not add silent fallback behavior.
- Keep tests focused on externally observable behavior.
- Do not read `.mx/*.md` unless explicitly requested by the user.
