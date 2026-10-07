import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseStoragePattern = (() => {
  if (!supabaseUrl) return [];

  try {
    const url = new URL(supabaseUrl);
    return [{
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/storage/v1/object/public/**",
      search: "",
    }];
  } catch {
    return [];
  }
})();

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5.1mb",
    },
  },
  images: {
    remotePatterns: supabaseStoragePattern,
  },
};

export default nextConfig;
