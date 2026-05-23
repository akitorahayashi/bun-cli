#!/usr/bin/env bun

import { runCommandLine } from './cli/greet';

if (import.meta.main) {
  runCommandLine()
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      process.stderr.write(`${message}\n`);
      process.exitCode = 1;
    });
}
