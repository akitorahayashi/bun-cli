# Contributing

## Scope

This repository owns:

- `src/` — CLI entry point, commands, application logic, domain modules, and colocated unit tests
- `tests/` — CLI integration tests
- Unit tests live next to source files under `src/` and test pure transformations.
- Integration tests live under `tests/` and test filesystem, CLI, subprocess, or network behavior.
- `.github/workflows/` — CI automation

## Workflow

1. Run `bun run fix` before committing.
2. Run `bun run check` to verify lint and types.
3. Run `bun test` to verify behavior.

See [AGENTS.md](AGENTS.md) for development commands, architecture, and implementation rules.

## Runtime Version

The Bun version is fixed by the `packageManager` field in `package.json`. Local development and CI use the same version.
