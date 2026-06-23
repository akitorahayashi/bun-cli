import { AppError } from 'cli-kit';

export { AppError, CommandLineError } from 'cli-kit';

export class GreetingValidationError extends AppError {}
