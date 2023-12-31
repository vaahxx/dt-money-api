import { it, beforeAll, afterAll, beforeEach, describe, expect } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Should create a transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        description: 'new transaction',
        amount: 100,
        category: 'outcome',
        type: 'outcome',
      })
      .expect(201)
  })

  it('Should not create a transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        description: 'new transaction',
        amount: 100,
        type: 'deposit',
      })
      .expect(400)
  })

  it('Should list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        description: 'new transaction',
        category: 'outcome',
        amount: 100,
        type: 'outcome',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        amount: -100,
        description: 'new transaction',
        category: 'outcomes',
      }),
    ])
  })

  it('Should get a specific transaction', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        description: 'new transaction',
        category: 'outcomes',
        amount: 100,
        type: 'outcome',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        id: transactionId,
        amount: -100,
        description: 'new transaction',
        category: 'outcomes',
      }),
    )
  })

  it('Should get summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        description: 'outcome transaction',
        category: 'outcomes',
        amount: 100,
        type: 'outcome',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        description: 'income transaction',
        category: 'incomes',
        amount: 500,
        type: 'income',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(summaryResponse.body.summary).toEqual({
      amount: 400,
    })
  })
})
