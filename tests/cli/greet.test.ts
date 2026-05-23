import { describe, expect, test } from 'bun:test';
import path from 'node:path';

interface CommandResult {
  exitCode: number;
  stderr: string;
  stdout: string;
}

function runCli(args: string[]): CommandResult {
  const command = Bun.spawnSync(['bun', 'src/bun_cli/main.ts', ...args], {
    cwd: path.join(import.meta.dir, '..', '..'),
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
    expect(result.stdout).toContain('bun-cli greet <name> [--lang <en|ja>]');
  });

  test('greets in English by default', () => {
    const result = runCli(['greet', 'Alice']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('Hello, Alice!');
    expect(result.stderr).toBe('');
  });

  test('greets in Japanese when requested', () => {
    const result = runCli(['greet', 'Hanako', '--lang', 'ja']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('こんにちは、Hanakoさん！');
    expect(result.stderr).toBe('');
  });

  test('prints the package version', () => {
    const result = runCli(['--version']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('bun-cli 0.1.0');
  });

  test('fails for unsupported languages', () => {
    const result = runCli(['greet', 'Alice', '--lang', 'fr']);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("Unsupported language 'fr'.");
    expect(result.stdout).toContain('Usage:');
  });
});
