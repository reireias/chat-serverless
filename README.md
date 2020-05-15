# chat-serverless

## Features
- Auth with Google account
- Create/Delete chat room
- Room URL share
- Text chat in room

## Chat Architecture
![chat-architecture-serverless-framework](https://user-images.githubusercontent.com/24800246/82073666-86819200-9714-11ea-8f0d-80e247c3d15d.png)

## Authentication
[Auth0](https://auth0.com/)

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## DynamoDB for local

```console
$ sls dynamodb install
$ sls dynamodb start
```
