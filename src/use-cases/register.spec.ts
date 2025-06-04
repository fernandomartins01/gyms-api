import {BcryptPasswordHashProvider} from '@/providers/bcrypt/bcrypt-password-hash-provider'
import type {PasswordHashProvider} from '@/providers/password-hash-provider'
import {InMemoryUsersRepository} from '@/repositories/in-memory/in-memory-users-repository'
import type {UsersRepository} from '@/repositories/users-repository'
import {beforeEach, describe, expect, it} from 'vitest'
import {UserAlreadyExistsError} from './errors/user-already-exists-error'
import {RegisterUseCase} from './register'

let userRepository: UsersRepository
let hashProvider: PasswordHashProvider
let sut: RegisterUseCase

describe('Register use case', () => {
	beforeEach(() => {
		userRepository = new InMemoryUsersRepository()
		hashProvider = new BcryptPasswordHashProvider()
		sut = new RegisterUseCase(userRepository, hashProvider)
	})

	it('should be able to register', async () => {
		const {user} = await sut.handle({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: 'Password@123'
		})

		expect(user.id).toEqual(expect.any(String))
	})

	it('should hash user password upon registration', async () => {
		const password = 'Password@123'
		const {user} = await sut.handle({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password
		})
		const isPasswordCorrectlyHashed = await hashProvider.compare(
			password,
			user.password_hash
		)

		expect(isPasswordCorrectlyHashed).toBeTruthy()
	})

	it('should not be able to register with same email', async () => {
		const email = 'johndoe@example.com'

		await sut.handle({
			name: 'John Doe',
			email,
			password: 'Password@123'
		})

		await expect(() =>
			sut.handle({
				name: 'Joana Doe',
				email,
				password: '321@Password'
			})
		).rejects.toBeInstanceOf(UserAlreadyExistsError)
	})
})
