import type {CheckInsRepository} from '@/repositories/check-ins-repository'
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/in-memory-check-ins-repository'
import {beforeEach, describe, expect, it} from 'vitest'
import {GetUserMetricsUseCase} from './get-user-metrics'

let checkInsRepository: CheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get user metrics use case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new GetUserMetricsUseCase(checkInsRepository)
	})

	it('should be able to get user metrics', async () => {
		await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		await checkInsRepository.create({
			gym_id: 'gym-02',
			user_id: 'user-01'
		})

		const {checkInsCount} = await sut.handle({
			userId: 'user-01'
		})

		expect(checkInsCount).toEqual(2)
	})
})
