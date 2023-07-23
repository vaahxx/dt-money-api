import fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)

app.addHook('onSend', (request, reply, payload, done) => {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  )
  reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  done(null, payload)
})

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
