import {prisma} from '@/lib/prisma'
import {BcryptPasswordHashProvider} from '@/providers/bcrypt/bcrypt-password-hash-provider'
import type {FastifyInstance} from 'fastify'
import {Role} from 'generated/prisma'
import request from 'supertest'

interface CreateAndAuthenticateUserResponse {
	token: string
}

export async function createAndAuthenticateUser(
	app: FastifyInstance,
	isAdmin = false
): Promise<CreateAndAuthenticateUserResponse> {
	await prisma.user.create({
		data: {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await new BcryptPasswordHashProvider().hash('123456'),
			role: isAdmin ? Role.ADMIN : Role.MEMBER
		}
	})

	const authResponse = await request(app.server).post('/sessions').send({
		email: 'johndoe@example.com',
		password: '123456'
	})
	const {token} = authResponse.body

	return {token}
}
