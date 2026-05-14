import type { NextConfig } from "next";

const basePath = normalizeBasePath(process.env.NEXT_BASE_PATH);

function normalizeBasePath(value: string | undefined) {
  if (!value || value === "/") {
    return "";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.replace(/\/+$/, "");
}

const nextConfig: NextConfig = {
  basePath,
  output: "standalone",
};

export default nextConfig;
