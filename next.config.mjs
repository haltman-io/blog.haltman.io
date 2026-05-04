const isStaticExport = process.env.NEXT_OUTPUT === "export"

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  ...(isStaticExport
    ? {
        output: "export",
        images: {
          unoptimized: true,
        },
      }
    : {}),
}

export default nextConfig
