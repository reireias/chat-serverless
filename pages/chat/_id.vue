<template>
  <v-container class="chat-page">
    <v-row justify="center">
      <v-col>
        <center>
          <div v-if="room" class="display-1">Room: {{ room.name }}</div>
        </center>
      </v-col>
    </v-row>
    <v-row v-for="message in messages" :key="message.id" justify="center">
      <v-col
        :class="user.sub == message.author ? 'my-message' : 'other-message'"
        cols="12"
        md="8"
        xl="5"
      >
        <v-avatar v-if="user.sub != message.author">
          <img :src="message.authorIcon" />
        </v-avatar>
        <v-card
          class="message-card"
          :color="user.sub == message.author ? '#AED581' : 'white'"
        >
          <v-card-title v-text="message.text"></v-card-title>
        </v-card>
        <v-avatar v-if="user.sub == message.author">
          <img :src="message.authorIcon" />
        </v-avatar>
      </v-col>
    </v-row>
    <v-app-bar app bottom fixed height="80">
      <v-container style="padding: 0; margine: 0;">
        <v-row justify="center" align="center">
          <v-col cols="11" md="7" xl="4">
            <v-text-field
              v-model="text"
              solo
              hide-details
              placeholder="message"
              @keyup.enter="onPost"
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-btn fab elevation="3" color="primary" @click="onPost">
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      text: null,
      socket: null,
      messages: [],
      ws: null,
    }
  },
  computed: {
    ...mapGetters(['user', 'room']),
  },
  mounted() {
    this.getRoom({ id: this.$nuxt.$route.params.id })
    const ws = new WebSocket(
      'wss://579ghywo75.execute-api.ap-northeast-1.amazonaws.com/dev'
    )
    this.ws = ws
    ws.onopen = this.onOpen
    ws.onmessage = this.onMessage
  },
  methods: {
    onPost() {
      this.ws.send(
        JSON.stringify({
          action: 'post',
          roomId: this.$nuxt.$route.params.id,
          message: this.text,
          author: this.user.sub,
          authorIcon: this.user.picture,
        })
      )
      this.text = ''
    },
    format(timestamp) {
      return moment(timestamp.seconds * 1000).format('YYYY/MM/DD HH:mm:ss')
    },
    ...mapActions(['getRoom']),
    onOpen(event) {
      this.ws.send(
        JSON.stringify({
          action: 'join',
          roomId: this.$nuxt.$route.params.id,
        })
      )
    },
    onMessage(event) {
      const data = JSON.parse(event.data)
      this.messages.push({
        text: data.message,
        author: data.author,
        authorIcon: data.authorIcon,
      })
      console.log(event)
    },
  },
}
</script>

<style lang="scss">
.chat-page {
  .my-message {
    display: flex;
    align-items: center;
    .message-card {
      margin-left: auto;
    }
  }
  .other-message {
    display: flex;
    align-items: center;
  }
  .message-card {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>
