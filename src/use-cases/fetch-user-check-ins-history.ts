import type {CheckInsRepository} from '@/repositories/check-ins-repository'
import type {CheckIn} from 'generated/prisma'

interface FetchUserCheckInsHistoryUseCaseRequest {
	userId: string
	page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
	checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
	constructor(private readonly checkInsRepository: CheckInsRepository) {}

	async handle({
		userId,
		page
	}: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page
		)

		return {
			checkIns
		}
	}
}
