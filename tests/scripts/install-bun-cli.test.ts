import { expect, test } from 'bun:test';
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { installLocalBunCli } from '../../scripts/install-bun-cli';

async function withTemporaryDirectory(
  prefix: string,
  run: (dir: string) => Promise<void>,
): Promise<void> {
  const dir = await mkdtemp(join(tmpdir(), prefix));
  try {
    await run(dir);
  } finally {
    await rm(dir, { force: true, recursive: true });
  }
}

test('installLocalBunCli installs a Bun-targeted JavaScript bundle', async () => {
  await withTemporaryDirectory('bun-cli-install-js-', async (dir) => {
    const installDir = join(dir, 'bin');
    const invocations: Array<{
      args: readonly string[];
      cwd: string;
      stdio: string;
    }> = [];

    const dest = await installLocalBunCli({
      projectRoot: process.cwd(),
      installDir,
      stdio: 'ignore',
      async runBuildCommand(invocation) {
        invocations.push(invocation);
        const outfileIndex = invocation.args.indexOf('--outfile');
        const outfile = invocation.args[outfileIndex + 1];
        if (outfileIndex >= 0 && outfile !== undefined) {
          await writeFile(
            outfile,
            '#!/usr/bin/env bun\nconsole.log("bun-cli")\n',
          );
        }
        return 0;
      },
    });

    expect(dest).toBe(join(installDir, 'bun-cli'));
    expect(invocations).toHaveLength(1);
    expect(invocations[0]?.cwd).toBe(process.cwd());
    expect(invocations[0]?.stdio).toBe('ignore');
    expect(invocations[0]?.args).toContain('--target');
    expect(invocations[0]?.args).toContain('bun');
    expect(invocations[0]?.args).not.toContain('--compile');
    expect(invocations[0]?.args).toContain(
      resolve(process.cwd(), 'src/main.ts'),
    );
    expect(await readFile(dest, 'utf8')).toBe(
      '#!/usr/bin/env bun\nconsole.log("bun-cli")\n',
    );
    expect((await stat(dest)).mode & 0o777).toBe(0o755);
    expect(await readdir(installDir)).toEqual(['bun-cli']);
  });
});

test('installLocalBunCli preserves the installed command when bundle build fails', async () => {
  await withTemporaryDirectory('bun-cli-install-failure-', async (dir) => {
    const installDir = join(dir, 'bin');
    const dest = join(installDir, 'bun-cli');
    await mkdir(installDir, { recursive: true });
    await writeFile(dest, 'installed command');

    await expect(
      installLocalBunCli({
        projectRoot: process.cwd(),
        installDir,
        stdio: 'ignore',
        async runBuildCommand() {
          return 1;
        },
      }),
    ).rejects.toThrow('bun build failed with exit code 1');

    expect(await readFile(dest, 'utf8')).toBe('installed command');
    expect(await readdir(installDir)).toEqual(['bun-cli']);
  });
});
