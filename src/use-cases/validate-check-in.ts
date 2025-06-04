import type {CheckInsRepository} from '@/repositories/check-ins-repository'
import dayjs from 'dayjs'
import type {CheckIn} from 'generated/prisma'
import {CheckInHasAlreadyBeenValidatedError} from './errors/check-in-has-already-been-validated-error'
import {LateCheckInValidationError} from './errors/late-check-in-validation-error'
import {ResourceNotFoundError} from './errors/resource-not-found-error'

interface ValidateCheckInUseCaseRequest {
	checkInId: string
}

interface ValidateCheckInUseCaseResponse {
	checkIn: CheckIn
}

export class ValidateCheckInUseCase {
	constructor(private readonly checkInsRepository: CheckInsRepository) {}

	async handle({
		checkInId
	}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
		const checkIn = await this.checkInsRepository.findById(checkInId)

		if (!checkIn) {
			throw new ResourceNotFoundError()
		}

		if (checkIn.validated_at) {
			throw new CheckInHasAlreadyBeenValidatedError()
		}

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.created_at,
			'minutes'
		)

		if (distanceInMinutesFromCheckInCreation > 20) {
			throw new LateCheckInValidationError()
		}

		checkIn.validated_at = new Date()

		await this.checkInsRepository.save(checkIn)

		return {
			checkIn
		}
	}
}
