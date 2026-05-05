import type { NextConfig } from "next";
import path from "node:path";

// #region agent log
try {
  const turbopackRoot = path.resolve(__dirname);
  fetch("http://127.0.0.1:7902/ingest/f0c3747c-d83d-4612-ae2f-574b6ccfc3fa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "335b3a",
    },
    body: JSON.stringify({
      sessionId: "335b3a",
      runId: "pre-fix",
      hypothesisId: "H_config_loaded",
      location: "next.config.ts:pre",
      message: "Loaded next.config.ts",
      data: {
        __dirname,
        cwd: process.cwd(),
        turbopackRoot,
        initCwd: process.env.INIT_CWD,
        npmConfigDevdir: process.env.npm_config_devdir,
        npmConfigPrefix: process.env.npm_config_prefix,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
} catch {}
// #endregion agent log

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
