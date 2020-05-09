import axios from 'axios'
import cookieparser from 'cookieparser'

export const state = () => ({
  auth: null,
  loading: true,
  user: null,
  rooms: [],
  room: null,
})

export const mutations = {
  setAuth(state, auth) {
    state.auth = auth
  },
  resetAuth(state) {
    state.auth = null
  },
  setUser(state, user) {
    state.user = user
    state.loading = false
  },
  setRooms(state, rooms) {
    state.rooms = rooms
  },
  setRoom(state, room) {
    state.room = room
  },
}

export const actions = {
  async addRoom({ dispatch }, payload) {
    await axios.post('/api/rooms', { name: payload.name })
    dispatch('getRooms')
  },
  async deleteRoom({ dispatch }, payload) {
    await axios.delete(`/api/rooms/${payload.id}`)
    dispatch('getRooms')
  },
  async getRooms({ commit }) {
    const res = await axios.get('/api/rooms')
    const payload = res.data
    commit('setRooms', payload)
  },
  async getRoom({ commit }, payload) {
    const res = await axios.get(`/api/rooms/${payload.id}`)
    commit('setRoom', {
      name: res.data.name,
    })
  },
  nuxtServerInit({ commit }, { req }) {
    if (process.server && req.headers.cookie) {
      const cookies = cookieparser.parse(req.headers.cookie)
      const accessToken = cookies._tkn
      const idToken = cookies._itkn

      commit('setAuth', {
        accessToken,
        idToken,
      })
    }
  },
}

export const getters = {
  isAuth(state) {
    return state.auth && state.auth.accessToken && state.auth.idToken
  },
  user(state) {
    return state.user
  },
  loading(state) {
    return state.loading
  },
  rooms(state) {
    return state.rooms
  },
  room(state) {
    return state.room
  },
}
