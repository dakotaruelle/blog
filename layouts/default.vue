<template>
  <v-app>
    <v-app-bar fixed dense hide-on-scroll app>
      <v-btn depressed class="mr-2">Home</v-btn>
      <NuxtLink to="/blog"><v-btn depressed>Blog</v-btn></NuxtLink>
      <v-spacer />
      <v-btn icon @click.stop="toggleDarkTheme">
        <v-icon>mdi-brightness-6</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app></v-footer>
  </v-app>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      fixed: false,
      title: '',
    }
  },

  methods: {
    toggleDarkTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
  },
})
</script>
