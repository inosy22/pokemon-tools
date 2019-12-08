<template>
  <v-app dark>
    <v-content>
      <v-container>
        <div :style="{ margin: '0 10px' }">
          <nuxt />
        </div>
        <v-flex :style="{ height: '80px', 'text-align': 'center' }" xs12>
          <span>
            &copy; 2019 created by
            <a href="https://twitter.com/inosy22_">@inosy22</a>
          </span>
        </v-flex>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
