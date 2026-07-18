export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class GreetingValidationError extends AppError {}
export class UnsupportedGreetingLanguageError extends AppError {}

export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
