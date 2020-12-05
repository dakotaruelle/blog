<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <article>
        <h1>{{ article.title }}</h1>
        <p>Last updated: {{ formatDate(article.updatedAt) }}</p>
        <nuxt-content :document="article" />
      </article>
    </v-col>
  </v-row>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    let article

    if (!params.slug) {
      article = await $content('posts', 'index').fetch()
    } else {
      article = await $content('posts', params.slug).fetch()
    }

    return { article }
  },

  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    },
  },
}
</script>
