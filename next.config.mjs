// import {env} from "./src/env/server.mjs";

// import pkg from '@next/bundle-analyzer'

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
    // return pkg({config});
    return config;
}


export default defineNextConfig({
    reactStrictMode: true,
    output: 'standalone',
    swcMinify: true,
    images: {
        domains: ['images.contentstack.io'],
    },
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
    },
});