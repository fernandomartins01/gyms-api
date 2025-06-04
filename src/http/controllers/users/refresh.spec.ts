import {app} from '@/app'
import request from 'supertest'
import {afterAll, beforeAll, describe, expect, it} from 'vitest'

describe('Refresh token (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to refresh token', async () => {
		await request(app.server).post('/users').send({
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: '123456'
		})
		const authResponse = await request(app.server).post('/sessions').send({
			email: 'johndoe@example.com',
			password: '123456'
		})
		const cookies = <string[]>authResponse.get('Set-Cookie')
		const refreshResponse = await request(app.server)
			.patch('/token/refresh')
			.set('Cookie', cookies)
			.send()

		expect(refreshResponse.statusCode).toEqual(200)
		expect(refreshResponse.body).toEqual({
			token: expect.any(String)
		})
		expect(refreshResponse.get('Set-Cookie')).toEqual([
			expect.stringContaining('refreshToken=')
		])
	})
})
