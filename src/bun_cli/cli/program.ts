import { type CAC, runCli } from 'cli-kit';
import packageMetadata from '../../../package.json';
import { registerGreetCommand } from './greet';

export function runCommandLine(
  args: readonly string[] = Bun.argv.slice(2),
): Promise<number> {
  return runCli({
    bin: packageMetadata.name,
    version: packageMetadata.version,
    tagline: packageMetadata.description,
    register: (program: CAC) => {
      registerGreetCommand(program);
    },
    argv: args,
  });
}
