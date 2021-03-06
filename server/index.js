const express = require('express')
const asyncify = require('express-asyncify')
const { Nuxt } = require('nuxt')
const bodyParser = require('body-parser')
const config = require('../nuxt.config.js')
const { customDomainAdaptorMiddleware } = require('./middleware')
const apiRouter = require('./api')

const app = asyncify(express())
config.dev = process.env.NODE_ENV !== 'production'

const nuxt = new Nuxt(config)

let isNuxtReady = false
app.use(bodyParser.json())
app.use(customDomainAdaptorMiddleware)
if (!config.dev) {
  // TODO: add mock for local dev
  app.use(require('aws-serverless-express/middleware').eventContext())
}
app.use(`${config.router.base}/api`.replace('//', '/'), apiRouter)
app.use(
  `${config.router.base}/static`.replace('//', '/'),
  express.static('./static')
)
app.use(
  async (req, res) =>
    (isNuxtReady || ((await nuxt.ready()) && (isNuxtReady = true))) &&
    nuxt.render(req, res)
)

module.exports = {
  app,
  nuxt,
}
