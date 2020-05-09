<template>
  <div>
    <h1>login</h1>
    <div id="auth0"></div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.commit('resetAuth')
    this.$auth0Lock.instance.on('authenticated', (authResult) => {
      this.$handleAuthResult(authResult)
      this.$auth0Lock.silentCheck(this.$handleAuthResult)
      this.$router.replace('/')
    })
    this.$auth0Lock.show()
  },
  destroyed() {
    this.$auth0Lock.hide()
  },
}
</script>
