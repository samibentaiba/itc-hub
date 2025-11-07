// next.config.ts
import type { NextConfig } from "next";
type stateType = "local" | "preview" | "production"
const nextConfig: NextConfig = {
    productionBrowserSourceMaps: true,
    env: {
        NEXT_PUBLIC_APP_VERSION: "0.1.0",
        state: "local" as stateType,
        repository: "https://github.com/samibentaiba/itc-hub"
    },
};

export default nextConfig;
