import type {GymsRepository} from '@/repositories/gyms-repository'
import {InMemoryGymsRepository} from '@/repositories/in-memory/in-memory-gyms-repository'
import {beforeEach, describe, expect, it} from 'vitest'
import {CreateGymUseCase} from './create-gym'

let gymsRepository: GymsRepository
let sut: CreateGymUseCase

describe('Create gym use case', () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new CreateGymUseCase(gymsRepository)
	})

	it('should be able to register', async () => {
		const {gym} = await sut.handle({
			title: 'Dynamo',
			description: null,
			phone: null,
			latitude: -21.7346026,
			longitude: -43.3565842
		})

		expect(gym.id).toEqual(expect.any(String))
	})
})
