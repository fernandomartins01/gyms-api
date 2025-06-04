import '@fastify/jwt'
import type {Role} from 'generated/prisma'

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: {
			sub: string
			role: Role
		}
	}
}
