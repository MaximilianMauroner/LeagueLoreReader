// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify: true,
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
    output: "standalone",
    images: {
        domains: ['images.contentstack.io'],
    },
};
export default config;

// import {env} from "./src/env/server.mjs";
//
// import nextPWA from "next-pwa";
// import runtimeCaching from "next-pwa/cache.js";
//
// const withPWA = nextPWA({
//     dest: "public",
//     runtimeCaching,
// });
//
// /**
//  * @template {import('next').NextConfig} T
//  * @param {T} config - A generic parameter that flows through the return type
//  * @constraint {{import('next').NextConfig}}
//  */
// function defineNextConfig(config) {
//     return config;
// }
//
// export default withPWA(defineNextConfig({
//     reactStrictMode: true,
//     swcMinify: true,
//
//     i18n: {
//         locales: ["en"],
//         defaultLocale: "en",
//     },
// }));