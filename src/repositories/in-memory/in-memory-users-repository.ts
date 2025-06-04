import {randomUUID} from 'node:crypto'
import type {Prisma, User} from 'generated/prisma'
import type {UsersRepository} from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
	private readonly items: User[] = []

	async findById(id: string) {
		return this.items.find((user) => user.id === id) ?? null
	}

	async findByEmail(email: string) {
		return this.items.find((user) => user.email === email) ?? null
	}

	async create(data: Prisma.UserCreateInput) {
		const user: User = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
			password_hash: data.password_hash,
			created_at: new Date()
		}

		this.items.push(user)

		return user
	}
}
