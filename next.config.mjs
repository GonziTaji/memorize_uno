/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'challenge-uno.vercel.app',
            },
        ],
    }
};

export default nextConfig;
