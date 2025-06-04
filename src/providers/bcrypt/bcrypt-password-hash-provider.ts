import {compare, hash} from 'bcryptjs'
import type {PasswordHashProvider} from '../password-hash-provider'

export class BcryptPasswordHashProvider implements PasswordHashProvider {
	async hash(password: string): Promise<string> {
		const hashedPassword = await hash(password, 6)
		return hashedPassword
	}

	async compare(password: string, hashed: string): Promise<boolean> {
		const isPasswordCorrect = await compare(password, hashed)
		return isPasswordCorrect
	}
}
