import type { NextConfig } from "next";
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isStaticExport =
  isGitHubPages || process.env.STATIC_EXPORT === "true";
const basePath = isGitHubPages ? "/Portfolio" : "";
const config: NextConfig = {
  poweredByHeader: false,
  ...(isStaticExport
    ? {
        output: "export" as const,
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
        trailingSlash: true,
      }
    : {}),
  images: { unoptimized: true },
  ...(!isStaticExport
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },
                { key: "X-Frame-Options", value: "DENY" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=()",
                },
              ],
            },
          ];
        },
      }
    : {}),
};
export default config;
