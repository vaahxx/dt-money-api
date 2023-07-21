// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      description: string
      category: string
      amount: number
      type: 'income' | 'outcome'
      created_at: string
      session_id?: string
    }
  }
}
