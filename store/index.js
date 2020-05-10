import axios from 'axios'
import cookieparser from 'cookieparser'
import nuxtConfig from '~/nuxt.config.js'

const base = nuxtConfig.router.base
const getHeaders = (idToken) => {
  return { Authorization: `Bearer ${idToken}` }
}

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
  async addRoom({ dispatch, state }, payload) {
    const headers = getHeaders(state.auth.idToken)
    await axios.post(`${base}/api/rooms`, { name: payload.name }, { headers })
    dispatch('getRooms')
  },
  async deleteRoom({ dispatch, state }, payload) {
    const headers = getHeaders(state.auth.idToken)
    await axios.delete(`${base}/api/rooms/${payload.id}`, { headers })
    dispatch('getRooms')
  },
  async getRooms({ commit, state }) {
    const headers = getHeaders(state.auth.idToken)
    const res = await axios.get(`${base}/api/rooms`, { headers })
    const payload = res.data
    commit('setRooms', payload)
  },
  async getRoom({ commit, state }, payload) {
    const headers = getHeaders(state.auth.idToken)
    const res = await axios.get(`${base}/api/rooms/${payload.id}`, { headers })
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
