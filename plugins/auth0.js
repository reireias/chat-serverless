import Auth0Lock from 'auth0-lock'

const lock = new Auth0Lock(
  process.env.AUTH0_CLIENT_ID,
  process.env.AUTH0_DOMAIN,
  {
    container: 'auth0',
    auth: {
      responseType: 'token id_token',
      params: {
        scope: 'openid profile email', // Learn about scopes: https://auth0.com/docs/scopes
      },
    },
  }
)

export default (_, inject) => {
  let silentCheck = null

  inject('auth0Lock', {
    instance: lock,

    show() {
      lock.show()
    },

    hide() {
      lock.hide()
    },

    checkSession(options) {
      return new Promise((resolve, reject) => {
        lock.checkSession(options || {}, (err, authResult) => {
          if (err || !authResult)
            return reject(err || new Error('No auth result'))

          resolve(authResult)
        })
      })
    },

    silentCheck(next, time) {
      if (silentCheck) clearTimeout(silentCheck)

      silentCheck = setTimeout(() => {
        this.checkSession()
          .then((authResult) => {
            if (next) next(authResult)

            this.silentCheck(next, time)
          })
          .catch((_err) => {
            // nothing
          })
      }, time || 15 * 60 * 1000)
    },

    getProfile(accessToken) {
      return new Promise((resolve, reject) => {
        lock.getUserInfo(accessToken, (err, profile) => {
          if (err) return reject(err)

          resolve(profile)
        })
      })
    },

    logout() {
      if (silentCheck) clearTimeout(silentCheck)

      lock.logout({
        returnTo:
          process.env.NODE_ENV === 'production'
            ? 'https://fdqm2ixxh4.execute-api.ap-northeast-1.amazonaws.com/dev'
            : 'http://localhost:3000/dev',
      })
    },
  })
}
