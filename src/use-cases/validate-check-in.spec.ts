import type {CheckInsRepository} from '@/repositories/check-ins-repository'
import {InMemoryCheckInsRepository} from '@/repositories/in-memory/in-memory-check-ins-repository'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {CheckInHasAlreadyBeenValidatedError} from './errors/check-in-has-already-been-validated-error'
import {LateCheckInValidationError} from './errors/late-check-in-validation-error'
import {ResourceNotFoundError} from './errors/resource-not-found-error'
import {ValidateCheckInUseCase} from './validate-check-in'

let checkInsRepository: CheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate check-in use case', () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(checkInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should be able to validate the check-in', async () => {
		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		const {checkIn} = await sut.handle({
			checkInId: createdCheckIn.id
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
	})

	it('should not be able to validate an inexistent check-in', async () => {
		await expect(() =>
			sut.handle({
				checkInId: 'inexistent-check-in-id'
			})
		).rejects.toBeInstanceOf(ResourceNotFoundError)
	})

	it('should not be able to validate the check-in afiter 20 minutes of its creation', async () => {
		vi.setSystemTime(new Date(2025, 3, 28, 13, 40))

		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		await vi.advanceTimersByTime(1000 * 60 * 21)

		await expect(() =>
			sut.handle({
				checkInId: createdCheckIn.id
			})
		).rejects.toBeInstanceOf(LateCheckInValidationError)
	})

	it('should not be able to validate the check-in when the check-in is validated', async () => {
		const createdCheckIn = await checkInsRepository.create({
			gym_id: 'gym-01',
			user_id: 'user-01'
		})

		await sut.handle({
			checkInId: createdCheckIn.id
		})

		await expect(() =>
			sut.handle({
				checkInId: createdCheckIn.id
			})
		).rejects.toBeInstanceOf(CheckInHasAlreadyBeenValidatedError)
	})
})
