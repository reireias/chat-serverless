/* eslint standard/no-callback-literal: 0 */
/* eslint no-console: 0 */
const jwt = require('jsonwebtoken')

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
const AUTH0_CLIENT_PUBLIC_KEY = process.env.AUTH0_CLIENT_PUBLIC_KEY

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {}
  authResponse.principalId = principalId
  // authResponse.picture = picture
  // NOTE: allow /dev/*/api/*
  const split = resource.split('/')
  const allowArn = `${split[0]}/dev/*/api/*`
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = allowArn
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

exports.handler = (event, _context, callback) => {
  console.log('event', event)
  if (!event.authorizationToken) {
    return callback('Unauthorized')
  }

  const tokenParts = event.authorizationToken.split(' ')
  const tokenValue = tokenParts[1]

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // no auth token!
    return callback('Unauthorized')
  }
  const options = {
    audience: AUTH0_CLIENT_ID,
  }

  try {
    jwt.verify(
      tokenValue,
      AUTH0_CLIENT_PUBLIC_KEY,
      options,
      (verifyError, decoded) => {
        if (verifyError) {
          console.log('verifyError', verifyError)
          // 401 Unauthorized
          console.log(`Token invalid. ${verifyError}`)
          return callback('Unauthorized')
        }
        // is custom authorizer function
        console.log('valid from customAuthorizer', decoded)
        return callback(
          null,
          generatePolicy(decoded.sub, 'Allow', event.methodArn)
        )
      }
    )
  } catch (err) {
    console.log('catch error. Invalid token', err)
    return callback('Unauthorized')
  }
}
