import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

interface IQuerystring {
  description: string
}

export async function transactionsRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: IQuerystring
  }>('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { description } = request.query
    const { sessionId } = request.cookies

    if (description) {
      return searchTransactions()
    }
    return getAllTransactions()

    async function getAllTransactions() {
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*')
      return { transactions }
    }

    async function searchTransactions() {
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .andWhereLike('description', `%${description}%`)
        .select('*')
      return { transactions }
    }
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
    async (request) => {
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
          domain: 'localhost',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
      }

      const transaction = await knex('transactions')
        .insert({
          id: crypto.randomUUID(),
          description,
          category,
          amount: type === 'income' ? amount : amount * -1,
          type,
          session_id: sessionId,
        })
        .returning('*')

      return reply.status(201).send({ transaction })
    } catch (err) {
      return reply.status(400).send(err)
    }
  })
}
