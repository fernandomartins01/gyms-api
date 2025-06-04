import {BcryptPasswordHashProvider} from '@/providers/bcrypt/bcrypt-password-hash-provider'
import {PrismaUsersRepository} from '@/repositories/prisma/prisma-users-repository'
import {AuthenticateUseCase} from '../authenticate'

export function makeAuthenticateUseCase() {
	const userRepository = new PrismaUsersRepository()
	const hashProvider = new BcryptPasswordHashProvider()
	const useCase = new AuthenticateUseCase(userRepository, hashProvider)

	return useCase
}
