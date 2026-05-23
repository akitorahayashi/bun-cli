import { parseArgs } from 'node:util';
import packageMetadata from '../../../package.json';
import { greet } from '../app/greet';
import { CommandLineError } from '../errors';

const usage = [
  'Usage:',
  '  bun-cli greet <name> [--lang <en|ja>]',
  '',
  'Commands:',
  '  greet   Print a greeting for one person.',
  '',
  'Options:',
  '  --lang <en|ja>  Greeting language. Defaults to en.',
  '  --help          Show help.',
  '  --version       Show version.',
].join('\n');

export async function runCommandLine(
  args: readonly string[] = Bun.argv.slice(2),
): Promise<number> {
  try {
    const parsed = parseCommandLine(args);

    if (parsed.type === 'help') {
      writeOutput(usage);
      return 0;
    }

    if (parsed.type === 'version') {
      writeOutput(`bun-cli ${packageMetadata.version}`);
      return 0;
    }

    const result = greet({
      lang: parsed.lang,
      name: parsed.name,
    });

    writeOutput(result.message);
    return 0;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    writeError(message);

    if (error instanceof CommandLineError) {
      writeOutput(usage);
    }

    return 1;
  }
}

type ParsedCommand =
  | { type: 'help' }
  | { type: 'version' }
  | { type: 'greet'; lang?: string; name: string };

function parseCommandLine(args: readonly string[]): ParsedCommand {
  const parsed = parseArgs({
    args: [...args],
    options: {
      help: { type: 'boolean' },
      lang: { type: 'string' },
      version: { type: 'boolean' },
    },
    allowPositionals: true,
    strict: true,
  });

  const { values, positionals } = parsed;

  if (values.version) {
    return { type: 'version' };
  }

  if (values.help || positionals.length === 0) {
    return { type: 'help' };
  }

  const [command, name, ...rest] = positionals;

  if (command !== 'greet') {
    throw new CommandLineError(`Unknown command '${command}'.`);
  }

  if (!name) {
    throw new CommandLineError("Missing required argument '<name>'.");
  }

  if (rest.length > 0) {
    throw new CommandLineError(
      `Unexpected positional arguments: ${rest.join(', ')}.`,
    );
  }

  return {
    type: 'greet',
    lang: values.lang,
    name,
  };
}

function writeError(message: string): void {
  process.stderr.write(`${message}\n`);
}

function writeOutput(message: string): void {
  process.stdout.write(`${message}\n`);
}
