# bun-cli

`bun-cli` is a Bun and TypeScript CLI template built on clipanion. One command
class per subcommand registers behind a single `Cli` entry point, with commands
acting as thin adapters over framework-independent domain logic.

## Directory Structure

```
src/
  main.ts              Entry point — Cli setup, command registration, process.exitCode
  errors.ts            CommandLineError (= clipanion UsageError), AppError, domain error base classes
  cli/
    <command>.ts       One Command class per subcommand
  app/
    <feature>.ts       Business logic, framework-independent
    <feature>.test.ts  Colocated unit tests for business logic
  <domain>/            Domain modules (e.g. greetings/) owned by the feature
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

`errors.ts` exports:
- `CommandLineError` — alias for clipanion's `UsageError`; triggers usage display on throw
- `AppError` — base class for domain errors; does not trigger usage display
- Feature-specific error classes extend `AppError`

Domain modules import from `errors.ts`, never from clipanion directly.

### Output

Commands write output via `this.context.stdout.write()`. clipanion routes `UsageError` and help text to stdout; unhandled `Error` instances (including `AppError`) are routed to stderr.

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
- Unit tests live next to source files under `src/` and test pure transformations.
- Integration tests live under `tests/` and test filesystem, CLI, subprocess, or network behavior.
- Tests assert observable behavior only — not internal structure or wording of passing output.
- Domain logic lives in `app/` and domain modules; commands are thin adapters.
- `static override` is required on `paths` and `usage` (TypeScript strict override checking).

## Documentation Rules

Documentation is written in a declarative style describing the current state of the system. Imperative or changelog-style descriptions are not used.
