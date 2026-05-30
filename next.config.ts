/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports if using static site generation
  output: 'export', // Optional: for fully static sites
  
  // Image optimization
  images: {
    unoptimized: true, // Required if using `output: 'export'`
    domains: ['example.com'], // Add your image domains
  },
  
  // Trailing slash for better SEO
  trailingSlash: true,
}

module.exports = nextConfig