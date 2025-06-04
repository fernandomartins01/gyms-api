import type {PasswordHashProvider} from '@/providers/password-hash-provider'
import type {UsersRepository} from '@/repositories/users-repository'
import type {User} from 'generated/prisma'
import {InvalidCredentialsError} from './errors/invalid-credentials-error'

interface AuthenticateUseCaseRequest {
	email: string
	password: string
}

interface AuthenticateUseCaseResponse {
	user: User
}

export class AuthenticateUseCase {
	constructor(
		private readonly userRepository: UsersRepository,
		private readonly hashProvider: PasswordHashProvider
	) {}

	async handle({
		email,
		password
	}: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
		const user = await this.userRepository.findByEmail(email)

		if (!user) {
			throw new InvalidCredentialsError()
		}

		const doesPasswordMatch = await this.hashProvider.compare(
			password,
			user.password_hash
		)

		if (!doesPasswordMatch) {
			throw new InvalidCredentialsError()
		}

		return {
			user
		}
	}
}
