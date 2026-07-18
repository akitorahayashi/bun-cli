import { UsageError } from 'clipanion';

export { UsageError as CommandLineError };

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class GreetingValidationError extends AppError {}

export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
