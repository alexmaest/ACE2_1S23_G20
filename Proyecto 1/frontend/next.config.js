/** @type {import('next').NextConfig} */

import { WithPWA } from 'next-pwa'
import runtimeCaching from 'next-pwa/cache.js'

const config = {
  reactStrictMode: true,
}

const nextConfig = WithPWA({
  dest: 'public',
  disable: !isProduction,
  runtimeCaching
})(config)

module.exports = nextConfig
