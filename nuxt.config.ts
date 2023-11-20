// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: false},
    ssr: false,
    modules: [
        'nuxt-primevue',
        '@nuxtjs/supabase',
        '@vueuse/nuxt',
    ],
    css: [
        '~/assets/css/main.css',
        'primevue/resources/themes/lara-light-blue/theme.css',
        'primeicons/primeicons.css',
    ],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    primevue: {
        cssLayerOrder: 'tailwind-base, primevue, tailwind-utilities'
    }
})
