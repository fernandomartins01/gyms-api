import type {GymsRepository} from '@/repositories/gyms-repository'
import {InMemoryGymsRepository} from '@/repositories/in-memory/in-memory-gyms-repository'
import {beforeEach, describe, expect, it} from 'vitest'
import {SearchGymsUseCase} from './search-gyms'

let gymsRepository: GymsRepository
let sut: SearchGymsUseCase

describe('Search gyms use case', () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymsUseCase(gymsRepository)
	})

	it('should be able to search for gyms', async () => {
		await gymsRepository.create({
			title: 'JavaScript Gym',
			description: null,
			phone: null,
			latitude: -21.7346026,
			longitude: -43.3565842
		})

		await gymsRepository.create({
			title: 'TypeScript Gym',
			description: null,
			phone: null,
			latitude: -21.7346026,
			longitude: -43.3565842
		})

		const {gyms} = await sut.handle({
			query: 'JavaScript',
			page: 1
		})

		expect(gyms).toHaveLength(1)
	})

	it('should be able to fetched paginated gyms search', async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `JavaScript Gym ${i}`,
				description: null,
				phone: null,
				latitude: -21.7346026,
				longitude: -43.3565842
			})
		}

		const {gyms} = await sut.handle({
			query: 'JavaScript',
			page: 2
		})

		expect(gyms).toHaveLength(2)
		expect(gyms).toEqual([
			expect.objectContaining({title: 'JavaScript Gym 21'}),
			expect.objectContaining({title: 'JavaScript Gym 22'})
		])
	})
})
