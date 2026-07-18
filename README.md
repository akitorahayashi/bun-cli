# bun-cli

A Bun + TypeScript CLI template using [clipanion](https://github.com/arcanis/clipanion).

## Setup

```sh
bun install
bun run up
```

`bun run up` builds a Bun-targeted single-file JavaScript bundle and installs it
as `bun-cli` into `BUN_CLI_INSTALL_DIR` or `~/.local/bin`.

## Usage

```sh
bun e --help
bun e greet Alice
bun e greet Hanako --lang ja
bun e --version
```
