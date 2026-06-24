#!/usr/bin/env bun

import { Builtins, Cli } from 'clipanion';
import packageMetadata from '../package.json';
import { GreetCommand } from './cli/greet';

const cli = new Cli({
  binaryLabel: packageMetadata.description,
  binaryName: packageMetadata.name,
  binaryVersion: packageMetadata.version,
});

cli.register(Builtins.HelpCommand);
cli.register(Builtins.VersionCommand);
cli.register(GreetCommand);

process.exitCode = await cli.run(Bun.argv.slice(2));
