const AWS = require('aws-sdk')

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
    body: 'Connected or Disconnected',
  })
}
