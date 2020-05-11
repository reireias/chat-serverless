const AWS = require('aws-sdk')

const CONNECTIONS_TABLE = 'connections'

const docClient = new AWS.DynamoDB.DocumentClient()

const sendMessageToClient = (url, connectionId, payload) =>
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: url,
    })
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log('err is', err)
          reject(err)
        }
        resolve(data)
      }
    )
  })

// TODO: remove
module.exports.defaultHandler = async (event, context) => {
  const domain = event.requestContext.domainName
  const stage = event.requestContext.stage
  const connectionId = event.requestContext.connectionId
  const callbackUrlForAWS = `https://${domain}/${stage}`
  await sendMessageToClient(callbackUrlForAWS, connectionId, event)

  return {
    statusCode: 200,
  }
}

module.exports.connectHandler = (event, context, callback) => {
  console.log(event.requestContext.connectionId)
  console.log(event)
  console.log(context)
  callback(null, {
    statusCode: 200,
    body: 'Connected',
  })
}

module.exports.disconnectHandler = (_event, _context, callback) => {
  callback(null, {
    statusCode: 200,
    body: 'Disconnected',
  })
}

module.exports.joinHandler = async (event, context, callback) => {
  console.log(event.body)
  const body = JSON.parse(event.body)
  const params = {
    TableName: CONNECTIONS_TABLE,
    Item: {
      roomId: body.roomId,
      id: event.requestContext.connectionId,
    },
  }
  await docClient.put(params).promise()
  callback(null, {
    statusCode: 200,
    body: 'joined',
  })
}

module.exports.postHandler = async (event, context, callback) => {
  console.log(event.body)
  console.log(typeof event.body)
  const body = JSON.parse(event.body)
  const roomId = body.roomId
  const params = {
    TableName: CONNECTIONS_TABLE,
    ExpressionAttributeValues: {
      ':room': roomId,
    },
    ExpressionAttributeNames: {
      '#r': 'roomId',
    },
    KeyConditionExpression: '#r = :room',
  }
  console.log(params)
  const data = await docClient.query(params).promise()
  const domain = event.requestContext.domainName
  const stage = event.requestContext.stage
  // const connectionId = event.requestContext.connectionId
  const url = `https://${domain}/${stage}`
  const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: url,
  })
  for (let item of data.Items) {
    const apiParams = {
      ConnectionId: item.id,
      Data: JSON.stringify({ message: body.message }),
    }
    try {
      await apigatewaymanagementapi.postToConnection(apiParams).promise()
    } catch (err) {
      if (err.statusCode === 410) {
        const params = {
          TableName: CONNECTIONS_TABLE,
          Key: {
            roomId,
            id: item.id,
          },
        }
        await docClient.delete(params).promise()
      }
    }
  }
  callback(null, {
    statusCode: 200,
    body: 'posted',
  })
}
