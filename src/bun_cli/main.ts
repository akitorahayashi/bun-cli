#!/usr/bin/env bun

import { runCommandLine } from './cli/greet';

if (import.meta.main) {
  runCommandLine().then((exitCode) => {
    process.exitCode = exitCode;
  });
}
