console.log("CONFIG LOADED");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wfykgioqceyjslbdpjht.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        canvas: false,
        jsdom: false,
        undici: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
