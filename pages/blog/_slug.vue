<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <article>
        <div v-if="isIndexPage === false">
          <h1>{{ article.title }}</h1>
          <p>Last updated: {{ formatDate(article.updatedAt) }}</p>
        </div>
        <nuxt-content :document="article" />
      </article>
    </v-col>
  </v-row>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    let article
    let isIndexPage

    if (!params.slug) {
      article = await $content('posts', 'index').fetch()
      isIndexPage = true
    } else {
      article = await $content('posts', params.slug).fetch()
      isIndexPage = false
    }

    return { article, isIndexPage }
  },

  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    },
  },
}
</script>
