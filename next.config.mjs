/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NEXT_PUBLIC_ROOT_PATH || '',
    webpack: (config) => {
        config.resolve.alias.canvas = false;

        return config;
    },
};

export default nextConfig;
