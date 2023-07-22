import fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

app.register(cookie)

app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
})

// app.register(cors, {
//   origin: true,
//   credentials: true,
// })

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
