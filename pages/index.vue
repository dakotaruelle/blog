<template>
  <div></div>
</template>

<script>
export default {
  middleware({ store, redirect }) {
    return redirect('/blog')
  },
}
</script>
