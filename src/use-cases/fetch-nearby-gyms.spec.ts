import type {GymsRepository} from '@/repositories/gyms-repository'
import {InMemoryGymsRepository} from '@/repositories/in-memory/in-memory-gyms-repository'
import {beforeEach, describe, expect, it} from 'vitest'
import {FetchNearbyGymsUseCase} from './fetch-nearby-gyms'

let gymsRepository: GymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby gyms use case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it('should be able to fetch nearby gyms', async () => {
		await gymsRepository.create({
			title: 'Near Gym',
			description: null,
			phone: null,
			latitude: -21.7346026,
			longitude: -43.3565842
		})

		await gymsRepository.create({
			title: 'Far Gym',
			description: null,
			phone: null,
			latitude: -21.2707444,
			longitude: -43.3565842
		})

		const {gyms} = await sut.handle({
			userLatitude: -21.7349033,
			userLongitude: -43.3568573
		})

		expect(gyms).toHaveLength(1)
	})
})
