import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// #region agent log
try {
  await fetch("http://127.0.0.1:7902/ingest/f0c3747c-d83d-4612-ae2f-574b6ccfc3fa", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "335b3a" },
    body: JSON.stringify({
      sessionId: "335b3a",
      runId: "pre-fix",
      hypothesisId: "H_force_dir",
      location: "scripts/dev.mjs:1",
      message: "Spawn next dev with explicit directory",
      data: { projectRoot, cwd: process.cwd(), initCwd: process.env.INIT_CWD },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
} catch {}
// #endregion agent log

const nextBin = path.join(projectRoot, "node_modules", ".bin", "next");
const nextCmd = path.join(projectRoot, "node_modules", ".bin", "next.cmd");

const isWindows = process.platform === "win32";
const command = isWindows ? "powershell.exe" : nextBin;
const args = isWindows
  ? [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      `& "${nextCmd}" dev "${projectRoot}" --turbo`,
    ]
  : ["dev", projectRoot, "--turbo"];

const child = spawn(command, args, {
  stdio: "inherit",
  cwd: projectRoot,
  env: process.env,
});

child.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});

