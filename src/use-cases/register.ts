import type {PasswordHashProvider} from '@/providers/password-hash-provider'
import type {UsersRepository} from '@/repositories/users-repository'
import type {User} from 'generated/prisma'
import {UserAlreadyExistsError} from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
	name: string
	email: string
	password: string
}

interface RegisterUseCaseResponse {
	user: User
}

export class RegisterUseCase {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly hashProvider: PasswordHashProvider
	) {}

	async handle({
		name,
		email,
		password
	}: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email)

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError()
		}

		const password_hash = await this.hashProvider.hash(password)
		const user = await this.usersRepository.create({
			name,
			email,
			password_hash
		})

		return {user}
	}
}
