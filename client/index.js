process.env.TZ = 'UTC'

require('isomorphic-fetch')

const express = require('express')
const proxy = require('express-http-proxy')
const next = require('next')

const IS_DEV = process.env.NODE_ENV !== 'production'
const PORT = process.env.PORT || 3000
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api'

const nextApp = next({ dev: IS_DEV })
const nextHandle = nextApp.getRequestHandler()

nextApp
  .prepare()
  .then(() => {
    // Create a new express app
    const app = express()

    // add request logging
    app.use((request, response, next) => {
      if (request.originalUrl !== '/healthcheck') {
        console.log(new Date(), request.method, request.originalUrl)
      }
      next()
    })

    // add Proxy
    app.use(
      '/api',
      proxy(BACKEND_URL, {
        proxyReqPathResolver: request => request.originalUrl
      })
    )

    // Add health check endpoint
    app.get('/healthcheck', (request, response) =>
      response.send({ uptime: process.uptime() })
    )

    // add next.js
    app.get('*', (request, response) => {
      return nextHandle(request, response)
    })

    // Start the server
    app.listen(PORT, error => {
      if (error) {
        console.error('Servicer init error (listen)', error)
        process.exit(1)
      }

      process.emit('SERVER_STARTED')
      console.log(
        `Service listening (port: ${PORT}, env: ${
          process.env.NODE_ENV
        }, apiEnv: ${BACKEND_URL}, processId: ${process.pid})`
      )
    })
  })
  .catch(error => {
    console.error('Servicer init error (nextApp.prepare)', error)
    process.exit(1)
  })
