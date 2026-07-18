import { describe, expect, test } from 'bun:test';
import path from 'node:path';

interface CommandResult {
  exitCode: number;
  stderr: string;
  stdout: string;
}

function runCli(args: string[]): CommandResult {
  const command = Bun.spawnSync(['bun', 'src/main.ts', ...args], {
    cwd: path.join(import.meta.dir, '..'),
    stdout: 'pipe',
    stderr: 'pipe',
  });

  return {
    exitCode: command.exitCode ?? 1,
    stdout: command.stdout.toString().trim(),
    stderr: command.stderr.toString().trim(),
  };
}

describe('greet command', () => {
  test('prints help when no command is provided', () => {
    const result = runCli([]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('bun-cli <command>');
    expect(result.stdout).toContain('greet');
  });

  test('prints help when requested', () => {
    const result = runCli(['--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('bun-cli <command>');
    expect(result.stdout).toContain('greet');
  });

  test('prints command-specific help for greet --help', () => {
    const result = runCli(['greet', '--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('bun-cli greet');
    expect(result.stdout).toContain('--lang');
    expect(result.stdout).toContain('<name>');
  });

  test('greets in Japanese by default', () => {
    const result = runCli(['greet', 'Alice']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('こんにちは、Aliceさん！');
    expect(result.stderr).toBe('');
  });

  test('greets in Japanese when requested', () => {
    const result = runCli(['greet', 'Hanako', '--lang', 'ja']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('こんにちは、Hanakoさん！');
    expect(result.stderr).toBe('');
  });

  test('supports g alias for greet command', () => {
    const result = runCli(['g', 'Alice']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('こんにちは、Aliceさん！');
    expect(result.stderr).toBe('');
  });

  test('prints the package version', () => {
    const result = runCli(['--version']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('0.1.0');
  });

  test('fails when a required name is missing', () => {
    const result = runCli(['greet']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('Not enough positional arguments');
    expect(result.stdout).toContain('bun-cli greet');
  });

  test('fails for unknown options', () => {
    const result = runCli(['greet', 'Alice', '--lan', 'ja']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('Unsupported option name');
    expect(result.stdout).toContain('bun-cli greet');
  });

  test('fails for unexpected positional arguments', () => {
    const result = runCli(['greet', 'Alice', 'Bob']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('Extraneous positional argument');
    expect(result.stdout).toContain('bun-cli greet');
  });

  test('fails for unsupported languages', () => {
    const result = runCli(['greet', 'Alice', '--lang', 'fr']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain("Unsupported language 'fr'.");
    expect(result.stdout).toContain('bun-cli greet');
  });

  test('fails cleanly for blank names', () => {
    const result = runCli(['greet', '   ']);

    expect(result.exitCode).toBe(1);
    expect(result.stdout).toContain('Name is required.');
    expect(result.stdout).toContain('bun-cli greet');
    expect(result.stderr).toBe('');
  });
});
