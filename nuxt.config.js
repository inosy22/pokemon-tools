import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  srcDir: './src',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + 'ポケモンツール',
    title: 'ポケモン素早さ比較 for 剣盾',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: '速攻計算！ポケモン剣盾用素早さ比較ツール by @inosy22'
      },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', content: '@inosy22' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'ポケモン素早さ比較 for 剣盾'
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://pokemon-tools.netlify.com'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '速攻計算！ポケモン剣盾用素早さ比較ツール by @inosy22'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://pokemon-tools.netlify.com/img/speed-ball.png'
      },
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'ポケモン素早さ比較 for 剣盾'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/composition-api'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
