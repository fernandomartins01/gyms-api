import {makeValidateCheckInUseCase} from '@/use-cases/factories/make-validate-check-in-use-case'
import type {FastifyReply, FastifyRequest} from 'fastify'
import {z} from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
	const checkInHistoryParamsSchema = z.object({
		checkInId: z.string()
	})
	const {checkInId} = checkInHistoryParamsSchema.parse(request.params)
	const validateCheckInUseCase = makeValidateCheckInUseCase()

	await validateCheckInUseCase.handle({
		checkInId
	})

	return reply.status(204).send()
}
