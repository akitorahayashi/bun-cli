# bun-cli

`bun-cli` is a Bun and TypeScript template repository for command-line tools.

The repository demonstrates a small CLI with a framework-backed command
boundary, one command, `greet <name> [--lang <en|ja>]`, repository-owned checks,
tests, and a compiled binary build.

## Setup

```bash
bun install
```

## Usage

```bash
bun run bun-cli greet Alice
bun run bun-cli greet Hanako --lang ja
bun run bun-cli --version
```
