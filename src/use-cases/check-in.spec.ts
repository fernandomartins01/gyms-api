import type {CheckInsRepository} from '@/repositories/check-ins-repository'
import type {GymsRepository} from '@/repositories/gyms-repository'
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/in-memory-check-ins-repository'
import {InMemoryGymsRepository} from '@/repositories/in-memory/in-memory-gyms-repository'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {CheckInUseCase} from './check-in'
import {MaxDistanceError} from './errors/max-distance-error'
import {MaxNumberOfCheckInsError} from './errors/max-number-of-check-ins-error'

let checkInsRepository: CheckInsRepository
let gymsRepository: GymsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		await gymsRepository.create({
			id: 'gym-01',
			title: 'Academia',
			description: null,
			phone: null,
			latitude: -21.7346026,
			longitude: -43.3565842
		})

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to check in', async () => {
		const {checkIn} = await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: -21.7346026,
			userLongitude: -43.3565842
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in twice in the same day', async () => {
		vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

		await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: -21.7346026,
			userLongitude: -43.3565842
		})

		await expect(() =>
			sut.handle({
				userId: 'user-01',
				gymId: 'gym-01',
				userLatitude: -21.7346026,
				userLongitude: -43.3565842
			})
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
	})

	it('should be able to check in twice in different days', async () => {
		vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0))

		await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: -21.7346026,
			userLongitude: -43.3565842
		})

		vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0))

		const {checkIn} = await sut.handle({
			userId: 'user-01',
			gymId: 'gym-01',
			userLatitude: -21.7346026,
			userLongitude: -43.3565842
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it('should not be able to check in on distant gym', async () => {
		await gymsRepository.create({
			id: 'gym-02',
			title: 'Academia',
			description: null,
			phone: null,
			latitude: -21.73214,
			longitude: -43.357338
		})

		await expect(() =>
			sut.handle({
				userId: 'user-01',
				gymId: 'gym-02',
				userLatitude: -21.7346026,
				userLongitude: -43.3565842
			})
		).rejects.toBeInstanceOf(MaxDistanceError)
	})
})
