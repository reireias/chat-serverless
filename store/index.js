import axios from 'axios'
import cookieparser from 'cookieparser'
import Cookie from 'js-cookie'
import nuxtConfig from '~/nuxt.config.js'

const base = nuxtConfig.router.base
const getHeaders = (idToken) => {
  return { Authorization: `Bearer ${idToken}` }
}

export const state = () => ({
  auth: null,
  user: null,
  rooms: [],
  room: null,
})

export const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setAuth(state, auth) {
    state.auth = auth
  },
  resetAuth(state) {
    state.auth = null
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
  async setUser({ dispatch, commit, state }) {
    // NOTE: if getProfile failed, accessToken is expired
    try {
      const profile = await this.$auth0Lock.getProfile(state.auth.accessToken)
      commit('setUser', profile)
    } catch {
      dispatch('logout')
      this.$auth0Lock.logout()
    }
  },
  logout({ commit }) {
    Cookie.remove('_tkn')
    Cookie.remove('_itkn')
    commit('resetAuth')
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
  auth(state) {
    return state.auth
  },
  rooms(state) {
    return state.rooms
  },
  room(state) {
    return state.room
  },
}
