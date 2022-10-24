// import {env} from "./src/env/server.mjs";

import nextPWA from "next-pwa";
import runtimeCaching from "next-pwa/cache.js";

const withPWA = nextPWA({
    dest: "public",
    runtimeCaching,
});

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
    return config;
}

export default withPWA(defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    output: "standalone",
    images: {
        domains: ['images.contentstack.io'],
    },
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
}));