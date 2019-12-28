// test/setup.js

import Vue from 'vue'
import Vuetify from '@nuxtjs/vuetify'
import CompositionAPI from '@vue/composition-api'

// Vuetify (Configを入れないと `Cannot read property 't' of undefined` が出る)
const vuetifyConfig = {
  lang: {
    locales: {},
    current: 'ja'
  }
}
Vue.use(Vuetify, vuetifyConfig)

// CompsitionAPI
Vue.use(CompositionAPI)
