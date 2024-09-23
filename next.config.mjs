/** @type {import('next').NextConfig} */

const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        //ppr: 'incremental',
    },
};

export default nextConfig;
