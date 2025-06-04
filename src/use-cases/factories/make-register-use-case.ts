import {BcryptPasswordHashProvider} from '@/providers/bcrypt/bcrypt-password-hash-provider'
import {PrismaUsersRepository} from '@/repositories/prisma/prisma-users-repository'
import {RegisterUseCase} from '../register'

export function makeRegisterUseCase() {
	const userRepository = new PrismaUsersRepository()
	const hashProvider = new BcryptPasswordHashProvider()
	const useCase = new RegisterUseCase(userRepository, hashProvider)

	return useCase
}
