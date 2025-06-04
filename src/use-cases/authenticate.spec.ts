import {BcryptPasswordHashProvider} from '@/providers/bcrypt/bcrypt-password-hash-provider'
import type {PasswordHashProvider} from '@/providers/password-hash-provider'
import {InMemoryUsersRepository} from '@/repositories/in-memory/in-memory-users-repository'
import type {UsersRepository} from '@/repositories/users-repository'
import {beforeEach, describe, expect, it} from 'vitest'
import {AuthenticateUseCase} from './authenticate'
import {InvalidCredentialsError} from './errors/invalid-credentials-error'

let usersRepository: UsersRepository
let hashProvider: PasswordHashProvider
let sut: AuthenticateUseCase

describe('Authenticate use case', () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository()
		hashProvider = new BcryptPasswordHashProvider()
		sut = new AuthenticateUseCase(usersRepository, hashProvider)
	})

	it('should be able to authenticate', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hashProvider.hash('Password@123')
		})

		const {user} = await sut.handle({
			email: 'johndoe@example.com',
			password: 'Password@123'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should not be able to authenticate with wrong email', async () => {
		await expect(
			sut.handle({
				email: 'johndoe@example.com',
				password: 'Password@123'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})

	it('should not be able to authenticate with wrong password', async () => {
		await usersRepository.create({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password_hash: await hashProvider.hash('Password@123')
		})

		await expect(
			sut.handle({
				email: 'johndoe@example.com',
				password: 'TEST_PASSWORD'
			})
		).rejects.toBeInstanceOf(InvalidCredentialsError)
	})
})
