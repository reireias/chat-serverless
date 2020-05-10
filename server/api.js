const express = require('express')
const { v4: uuidv4 } = require('uuid')
const { DynamoDB } = require('aws-sdk')

const ROOMS_TABLE = 'rooms'
const ID_INDEX = 'rooms_id'

const options = { region: 'ap-northeast-1' }
if (process.env.DYNAMODB_ENDPOINT) {
  options.endpoint = process.env.DYNAMODB_ENDPOINT
}
const docClient = new DynamoDB.DocumentClient(options)
const router = express.Router()

const getUserInfo = (req) => {
  if (process.env.NODE_ENV === 'production') {
    return req.apiGateway.event.requestContext.authorizer
  } else {
    // NOTE: mock
    return { principalId: '1' }
  }
}

router.get('/rooms', async (req, res) => {
  const userInfo = getUserInfo(req)
  const params = {
    TableName: ROOMS_TABLE,
    ExpressionAttributeValues: {
      ':owner': userInfo.principalId,
    },
    ExpressionAttributeNames: {
      '#o': 'owner',
    },
    KeyConditionExpression: '#o = :owner',
  }
  const data = await docClient.query(params).promise()
  res.status(200).json(data.Items)
})

// NOTE: public api
router.get('/rooms/:id', async (req, res) => {
  const params = {
    TableName: ROOMS_TABLE,
    IndexName: ID_INDEX,
    ExpressionAttributeValues: {
      ':id': req.params.id,
    },
    ExpressionAttributeNames: {
      '#i': 'id',
    },
    KeyConditionExpression: '#i = :id',
  }
  const data = await docClient.query(params).promise()
  res.status(200).json(data.Items[0])
})

router.post('/rooms', async (req, res) => {
  const userInfo = getUserInfo(req)
  const id = uuidv4()
  const params = {
    TableName: ROOMS_TABLE,
    Item: {
      owner: userInfo.principalId,
      id,
      name: req.body.name,
    },
  }
  await docClient.put(params).promise()
  res.status(200).json({ id })
})

router.delete('/rooms/:id', async (req, res) => {
  const userInfo = getUserInfo(req)
  const params = {
    TableName: ROOMS_TABLE,
    Key: {
      owner: userInfo.principalId,
      id: req.params.id,
    }
  }
  await docClient.delete(params).promise()
  res.status(200).json({})
})

module.exports = router
