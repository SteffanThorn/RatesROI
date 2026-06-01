/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongoose', 'mongodb', 'cheerio', 'bcryptjs'],
};

export default nextConfig;
