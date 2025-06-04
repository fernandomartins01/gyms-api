import {app} from '@/app'
import {createAndAuthenticateUser} from '@/utils/test/create-and-authenticate-user'
import request from 'supertest'
import {afterAll, beforeAll, describe, expect, it} from 'vitest'

describe('Search Gyms (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to list nearby gyms', async () => {
		const {token} = await createAndAuthenticateUser(app, true)

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Near Gym',
				description: null,
				phone: null,
				latitude: -21.7346026,
				longitude: -43.3565842
			})

		await request(app.server)
			.post('/gyms')
			.set('Authorization', `Bearer ${token}`)
			.send({
				title: 'Far Gym',
				description: null,
				phone: null,
				latitude: -21.2707444,
				longitude: -43.3565842
			})

		const response = await request(app.server)
			.get('/gyms/nearby')
			.query({
				latitude: -21.7349033,
				longitude: -43.3568573
			})
			.set('Authorization', `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({
				title: 'Near Gym'
			})
		])
	})
})
