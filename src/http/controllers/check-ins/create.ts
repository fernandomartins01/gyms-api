import {MaxDistanceError} from '@/use-cases/errors/max-distance-error'
import {MaxNumberOfCheckInsError} from '@/use-cases/errors/max-number-of-check-ins-error'
import {ResourceNotFoundError} from '@/use-cases/errors/resource-not-found-error'
import {makeCheckInUseCase} from '@/use-cases/factories/make-check-in-use-case'
import type {FastifyReply, FastifyRequest} from 'fastify'
import {z} from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createCheckInParamsSchema = z.object({
		gymId: z.string().uuid()
	})
	const createCheckInBodySchema = z.object({
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 180
		})
	})
	const {gymId} = createCheckInParamsSchema.parse(request.params)
	const {latitude, longitude} = createCheckInBodySchema.parse(request.body)
	const checkInUseCase = makeCheckInUseCase()

	try {
		const {checkIn} = await checkInUseCase.handle({
			gymId,
			userId: request.user.sub,
			userLatitude: latitude,
			userLongitude: longitude
		})

		return reply.status(201).send({checkIn})
	} catch (error) {
		console.log(error)
		if (
			error instanceof Error &&
			(error instanceof ResourceNotFoundError ||
				error instanceof MaxNumberOfCheckInsError ||
				error instanceof MaxDistanceError)
		) {
			return reply.status(409).send({message: error.message})
		}

		return reply.status(500).send()
	}
}
