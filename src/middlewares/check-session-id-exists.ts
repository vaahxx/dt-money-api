import { FastifyReply, FastifyRequest } from 'fastify'

export function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) {
  // if (!request.cookies.sessionId) {
  //   return reply.status(401).send({ error: 'Unauthorized' })
  // }
  done()
}
