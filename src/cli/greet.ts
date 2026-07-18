import { Command, Option, UsageError } from 'clipanion';
import { greet } from '../app/greet';
import {
  GreetingValidationError,
  UnsupportedGreetingLanguageError,
} from '../errors';

export class GreetCommand extends Command {
  static override paths = [['greet'], ['g']];
  static override usage = Command.Usage({
    description: 'Print a greeting for one person. [aliases: g]',
  });

  name = Option.String({ required: true });
  lang = Option.String('--lang');

  async execute(): Promise<void> {
    try {
      const result = greet({ name: this.name, lang: this.lang });
      this.context.stdout.write(`${result.message}\n`);
    } catch (error) {
      if (
        error instanceof UnsupportedGreetingLanguageError ||
        error instanceof GreetingValidationError
      ) {
        throw new UsageError(error.message);
      }
      throw error;
    }
  }
}
