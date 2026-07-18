# bun-cli

`bun-cli` is a Bun and TypeScript CLI template built on clipanion. One command
class per subcommand registers behind a single `Cli` entry point, with commands
acting as thin adapters over framework-independent domain logic.

## Directory Structure

```
src/
  main.ts              Entry point — Cli setup, command registration, process.exitCode
  errors.ts            AppError and feature-specific domain error subclasses
  cli/
    <command>.ts       One Command class per subcommand
  app/
    <feature>.ts       Business logic, framework-independent
    <feature>.test.ts  Colocated unit tests for business logic
  <domain>/            Domain modules (e.g. greetings/): logic reused across app/ use cases, or logic that wraps an external dependency
    <file>.test.ts     Colocated unit tests for domain modules
tests/
  <command>.test.ts    CLI integration tests via Bun.spawnSync
  scripts/             Installer boundary tests
scripts/
  install-bun-cli.ts   Local self-update installer used by `bun run up`
```

## Architecture

### Entry point

`main.ts` owns the `Cli` instance. It sets `binaryName`, `binaryVersion`, `binaryLabel` from `package.json`, registers `Builtins.HelpCommand`, `Builtins.VersionCommand`, and each command class, then runs with `cli.run(Bun.argv.slice(2))`.

No intermediate program module exists. Command registration is done directly in `main.ts`.

### Commands

Each command is a class in `src/cli/` that extends clipanion's `Command`. Declare:
- `static override paths` — routing paths and aliases
- `static override usage` — `Command.Usage({ description })` for help text
- Fields via `Option.String()`, `Option.Boolean()`, `Option.Rest()`, etc.
- `async execute()` — writes output via `this.context.stdout.write()`

### Errors

`errors.ts` exports `AppError` (base class for domain errors) and feature-specific subclasses (e.g. `GreetingValidationError`, `UnsupportedGreetingLanguageError`). Domain modules (`app/`, `<domain>/`) throw only `AppError` subclasses and never import from clipanion, so they stay framework-independent.

`cli/` command classes import clipanion's types directly (`Command`, `Option`, `UsageError`, ...); there is no wrapper layer. A command that wants a caught domain error to render as a usage error (with its usage synopsis) catches it and re-throws `new UsageError(error.message)`; any other domain error is left to propagate and renders per the Output section below.

### Output

Commands write output via `this.context.stdout.write()`. `UsageError` — thrown directly or re-thrown by a command from a caught domain error — renders to stdout with the command's usage synopsis. Any other uncaught error, including an uncaught `AppError`, also renders to stdout as the error's name, message, and stack trace, without a usage synopsis. Exit code is 1 in both cases.

## Development Commands

```sh
bun run fix      # Biome autofix — run before check
bun run check    # biome lint + tsc --noEmit
bun test         # Run all tests
bun run build    # Bundle to dist/bun-cli for Bun
bun run up       # Install Bun-targeted bun-cli to BUN_CLI_INSTALL_DIR or ~/.local/bin
```

## Development Guidelines

- `bun run fix` before `bun run check`; never skip fix.
- Tests assert observable behavior only — not internal structure or wording of passing output.
- Domain logic lives in `app/` and domain modules; commands are thin adapters.
- Promote `app/` logic into a `<domain>/` module only when a second use case needs it, or when it wraps an external dependency (network, filesystem, third-party format); otherwise keep it inline in the use case's `app/` file.
- `static override` is required on `paths` and `usage` (TypeScript strict override checking).
- Testing policy (where unit vs. integration tests live) is defined in CONTRIBUTING.md.

## Documentation Rules

Documentation is written in a declarative style describing the current state of the system. Imperative or changelog-style descriptions are not used.
