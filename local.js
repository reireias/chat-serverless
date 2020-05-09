const { Builder } = require('nuxt')
const { app, nuxt } = require('./server/index')

const IS_PROD = process.env.NODE_ENV === 'production'
const PORT = IS_PROD ? 80 : 3000

;(async function main() {
  if (!IS_PROD) {
    await new Builder(nuxt).build()
  }

  app.listen(PORT)
})()
