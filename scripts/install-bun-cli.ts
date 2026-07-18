import { chmod, mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { describeError } from '../src/errors';

type InstallStdio = 'inherit' | 'ignore';

interface InstallInvocation {
  readonly args: readonly string[];
  readonly cwd: string;
  readonly stdio: InstallStdio;
}

interface InstallOptions {
  readonly projectRoot: string;
  readonly installDir?: string;
  readonly stdio?: InstallStdio;
  readonly runBuildCommand?: (invocation: InstallInvocation) => Promise<number>;
}

async function runBunBuild(invocation: InstallInvocation): Promise<number> {
  const proc = Bun.spawn(['bun', ...invocation.args], {
    cwd: invocation.cwd,
    stderr: invocation.stdio,
    stdout: invocation.stdio,
  });
  return proc.exited;
}

async function runBuildCommand(
  invocation: InstallInvocation,
  runCommand: (invocation: InstallInvocation) => Promise<number>,
): Promise<void> {
  const code = await runCommand(invocation);
  if (code !== 0) {
    throw new Error(`bun build failed with exit code ${code}`);
  }
}

function defaultInstallDir(): string {
  return process.env.BUN_CLI_INSTALL_DIR ?? join(homedir(), '.local', 'bin');
}

export async function installLocalBunCli(
  options: InstallOptions,
): Promise<string> {
  const installDir = options.installDir ?? defaultInstallDir();
  await mkdir(installDir, { recursive: true });
  const dest = join(installDir, 'bun-cli');
  const stageDir = await mkdtemp(join(installDir, '.bun-cli-up-'));
  const stageDest = join(stageDir, 'bun-cli');

  try {
    const runCommand = options.runBuildCommand ?? runBunBuild;
    const stdio = options.stdio ?? 'inherit';
    const projectRoot = options.projectRoot;

    await runBuildCommand(
      {
        args: [
          'build',
          resolve(projectRoot, 'src/main.ts'),
          '--target',
          'bun',
          '--outfile',
          stageDest,
        ],
        cwd: projectRoot,
        stdio,
      },
      runCommand,
    );

    await chmod(stageDest, 0o755);
    await rename(stageDest, dest);
  } finally {
    await rm(stageDir, { force: true, recursive: true });
  }

  return dest;
}

async function install(): Promise<void> {
  const projectRoot = join(import.meta.dir, '..');
  const dest = await installLocalBunCli({ projectRoot });

  console.log(`Installed to ${dest}`);
}

if (import.meta.main) {
  try {
    await install();
  } catch (error) {
    console.error(describeError(error));
    process.exit(1);
  }
}
