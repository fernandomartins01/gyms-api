import type {FastifyReply, FastifyRequest} from 'fastify'
import type {Role} from 'generated/prisma'

export function verifyUserRole(roleToVerify: Role) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const {role} = request.user

		if (role !== roleToVerify) {
			return reply.status(401).send({
				message: 'Unauthorized.'
			})
		}
	}
}
