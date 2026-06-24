import { Command, Option } from 'clipanion';
import { greet } from '../app/greet';

export class GreetCommand extends Command {
  static override paths = [['greet'], ['g']];
  static override usage = Command.Usage({
    description: 'Print a greeting for one person.',
  });

  name = Option.String({ required: true });
  lang = Option.String('--lang');

  async execute(): Promise<void> {
    const result = greet({ name: this.name, lang: this.lang });
    this.context.stdout.write(`${result.message}\n`);
  }
}
