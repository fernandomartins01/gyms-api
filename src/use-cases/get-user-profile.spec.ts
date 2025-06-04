import {BcryptPasswordHashProvider} from '@/providers/bcrypt/bcrypt-password-hash-provider'
import type {PasswordHashProvider} from '@/providers/password-hash-provider'
import {InMemoryUsersRepository} from '@/repositories/in-memory/in-memory-users-repository'
import type {UsersRepository} from '@/repositories/users-repository'
import {beforeEach, describe, expect, it} from 'vitest'
import {ResourceNotFoundError} from './errors/resource-not-found-error'
import {GetUserProfileUseCase} from './get-user-profile'

let usersRepository: UsersRepository
let hashProvider: PasswordHashProvider
let sut: GetUserProfileUseCase

describe('Get user profile use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		hashProvider = new BcryptPasswordHashProvider()
		sut = new GetUserProfileUseCase(usersRepository)
	})

	it('should be able to get user profile', async () => {
		const createdUser = await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hashProvider.hash('Password@123')
		})

		const {user} = await sut.handle({
			userId: createdUser.id
		})

		expect(user.name).toEqual('John Doe')
	})

	it('should not be able to get user profile with wrong id', async () => {
		await expect(
			sut.handle({
				userId: 'non-existing-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})
})
