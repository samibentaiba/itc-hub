// next.config.ts
import type { NextConfig } from "next";
type stateType = "local" | "preview" | "production"
const nextConfig: NextConfig = {
    productionBrowserSourceMaps: true,
    env: {
        NEXT_PUBLIC_APP_VERSION: "0.1.0",
        state: "production" as stateType,
        repository: "https://github.com/samibentaiba/itc-hub"
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/signup',
                destination: '/register',
                permanent: true,
            },
            {
                source: '/signin',
                destination: '/login',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
