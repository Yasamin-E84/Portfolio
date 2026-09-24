import { spawn } from "node:child_process";
import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const backupRoot = path.join(root, ".pages-build-backup");
const disabled = [
  [path.join(root, "app", "api"), path.join(backupRoot, "api")],
  [
    path.join(root, "app", "[locale]", "[...missing]"),
    path.join(backupRoot, "missing"),
  ],
  [path.join(root, "proxy.ts"), path.join(backupRoot, "proxy.ts")],
];

async function exists(target) {
  try {
    await readFile(target);
    return true;
  } catch {
    try {
      await readdir(target);
      return true;
    } catch {
      return false;
    }
  }
}

async function run(command, args, env) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env,
      shell: true,
      stdio: "inherit",
    });
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} exited with ${code}`)),
    );
    child.on("error", reject);
  });
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target)));
    else files.push(target);
  }
  return files;
}

await rm(backupRoot, { recursive: true, force: true });
await mkdir(backupRoot, { recursive: true });

try {
  for (const [source, destination] of disabled) {
    if (await exists(source)) await rename(source, destination);
  }
  await rm(path.join(root, "out"), { recursive: true, force: true });
  await rm(path.join(root, ".next"), { recursive: true, force: true });
  await run("npm", ["run", "build"], {
    ...process.env,
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_BASE_PATH: "/Portfolio",
    NEXT_PUBLIC_SITE_URL: "https://yasamin-e84.github.io/Portfolio",
    NEXT_PUBLIC_STATIC_SITE: "1",
  });

  const outputRoot = path.join(root, "out");
  const textExtensions = new Set([
    ".css",
    ".html",
    ".js",
    ".json",
    ".txt",
    ".xml",
  ]);
  for (const file of await walk(outputRoot)) {
    if (!textExtensions.has(path.extname(file))) continue;
    const input = await readFile(file, "utf8");
    const output = input
      .replaceAll('url("/media/', 'url("/Portfolio/media/')
      .replaceAll("url('/media/", "url('/Portfolio/media/")
      .replaceAll("url(/media/", "url(/Portfolio/media/")
      .replaceAll('url("/fonts/', 'url("/Portfolio/fonts/')
      .replaceAll("url('/fonts/", "url('/Portfolio/fonts/")
      .replaceAll("url(/fonts/", "url(/Portfolio/fonts/");
    if (output !== input) await writeFile(file, output);
  }
  await writeFile(path.join(outputRoot, ".nojekyll"), "");
} finally {
  for (const [source, destination] of [...disabled].reverse()) {
    if (await exists(destination)) {
      await mkdir(path.dirname(source), { recursive: true });
      await rename(destination, source);
    }
  }
  await rm(backupRoot, { recursive: true, force: true });
}
