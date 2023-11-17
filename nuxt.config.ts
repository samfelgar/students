// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: false},
    modules: [
        'nuxt-primevue',
        '@nuxtjs/supabase'
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
