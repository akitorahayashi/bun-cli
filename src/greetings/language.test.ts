import { describe, expect, test } from 'bun:test';
import { resolveGreetingLanguage } from './language';

describe('resolveGreetingLanguage', () => {
  test('defaults to Japanese when no value is given', () => {
    expect(resolveGreetingLanguage(undefined)).toBe('ja');
  });

  test('accepts English', () => {
    expect(resolveGreetingLanguage('en')).toBe('en');
  });

  test('accepts Japanese', () => {
    expect(resolveGreetingLanguage('ja')).toBe('ja');
  });

  test('rejects an unsupported language', () => {
    expect(() => resolveGreetingLanguage('fr')).toThrow(
      "Unsupported language 'fr'. Expected one of: en, ja.",
    );
  });
});
