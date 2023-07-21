import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies
    console.log(sessionId)
    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select('*')
    return { transactions }
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { sessionId } = request.cookies
    const { id } = getTransactionParamsSchema.parse(request.params)
    const transaction = await knex('transactions')
      .where({
        session_id: sessionId,
        id,
      })
      .select('*')
      .first('*')
    return { transaction }
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()
      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    try {
      const createTransactionBodySchema = z.object({
        description: z.string(),
        category: z.string(),
        amount: z.number(),
        type: z.enum(['income', 'outcome']),
      })

      const { description, amount, type, category } =
        createTransactionBodySchema.parse(request.body)

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = crypto.randomUUID()
        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
      }

      await knex('transactions').insert({
        id: crypto.randomUUID(),
        description,
        category,
        amount: type === 'income' ? amount : amount * -1,
        session_id: sessionId,
      })

      return reply.status(201).send()
    } catch (err) {
      return reply.status(400).send({ error: err.message })
    }
  })
}
