const express = require('express')
const { DynamoDB } = require('aws-sdk')

const options = { region: 'ap-northeast-1' }
if (process.env.DYNAMODB_ENDPOINT) {
  options.endpoint = process.env.DYNAMODB_ENDPOINT
}
const docClient = new DynamoDB.DocumentClient(options)
const router = express.Router()

router.get('/rooms', async (_, res) => {
  const params = {
    ExpressionAttributeValues: {
      ':owner': '1',
    },
    ExpressionAttributeNames: {
      '#o': 'owner'
    },
    KeyConditionExpression: '#o = :owner',
    TableName: 'rooms',
  }
  const data = await docClient.query(params).promise()
  res.status(200).json(data.Items)
})

// TODO: remove debug code
router.get('/public', (_, res) => {
  res.status(200).json({ message: 'public' })
})

router.get('/private', (req, res) => {
  console.log(req)
  console.log(req.apiGateway.event.requestContext.authorizer)
  res.status(200).json({ message: 'private' })
})

module.exports = router
