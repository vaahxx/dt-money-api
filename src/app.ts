import fastify from 'fastify'
import cookie from '@fastify/cookie'
import fastifyCors from 'fastify-cors'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)

app.register(fastifyCors, {
  origin: true,
  credentials: true,
})

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
