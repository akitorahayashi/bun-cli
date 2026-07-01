export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export class GreetingValidationError extends AppError {}
export class UnsupportedGreetingLanguageError extends AppError {}
