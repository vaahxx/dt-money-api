import fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)

app.register(cors)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
