const express = require('express')

const router = express.Router()

router.get('/rooms', (_, res) => {
  res.status(200).json({ message: 'debug' })
})

router.get('/public', (_, res) => {
  res.status(200).json({ message: 'public' })
})

router.get('/private', (req, res) => {
  console.log(req)
  console.log(req.apiGateway.event)
  console.log(req.apiGateway.event.requestContext)
  console.log(req.apiGateway.event.requestContext.authorizer)
  res.status(200).json({ message: 'private' })
})

module.exports = router
