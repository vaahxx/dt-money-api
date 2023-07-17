import fastify from 'fastify'
import crypto from 'node:crypto'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  const transaction = await knex('transactions')
    .insert({
      id: crypto.randomUUID(),
      title: 'teste',
      amount: 100,
    })
    .returning('*')
  return transaction
})

app.listen({ port: env.PORT }).then(() => {
  console.log('🚀 Server ready at http://localhost:3333')
})
