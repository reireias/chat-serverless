<template>
  <v-app>
    <v-app-bar app fixed max-height="64">
      <v-toolbar-title
        >Example Chat Application with Serverless Framework</v-toolbar-title
      >
      <v-spacer></v-spacer>
      <v-btn
        v-if="!['/', '/login'].includes($route.path)"
        class="toolbar-button"
        outlined
        nuxt
        to="/"
        >top</v-btn
      >
      <v-btn v-if="user" class="toolbar-button" outlined @click="onLogout"
        >logout</v-btn
      >
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['user', 'auth']),
  },
  mounted() {
    if (!this.user && this.auth && this.auth.accessToken) {
      this.setUser()
    }
  },
  methods: {
    onLogout() {
      this.logout()
      this.$auth0Lock.logout()
    },
    ...mapActions(['setUser', 'logout']),
  },
}
</script>

<style lang="scss">
.toolbar-button {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
