import {randomUUID} from 'node:crypto'
import dayjs from 'dayjs'
import type {CheckIn, Prisma} from 'generated/prisma'
import type {CheckInsRepository} from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
	private readonly items: CheckIn[] = []

	async findById(id: string) {
		return this.items.find((item) => item.id === id) ?? null
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf('day')
		const endOfTheDay = dayjs(date).endOf('day')

		const checkInOnSameDate = this.items.find((checkIn) => {
			const isSameUser = checkIn.user_id === userId
			const checkInDate = dayjs(checkIn.created_at)
			const isSameDay =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

			return isSameUser && isSameDay
		})

		return checkInOnSameDate ?? null
	}

	async findManyByUserId(userId: string, page: number) {
		return this.items
			.filter((item) => item.user_id === userId)
			.slice((page - 1) * 20, page * 20)
	}

	async countByUserId(userId: string) {
		return this.items.filter((item) => item.user_id === userId).length
	}

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn: CheckIn = {
			id: randomUUID(),
			created_at: new Date(),
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			user_id: data.user_id,
			gym_id: data.gym_id
		}

		this.items.push(checkIn)

		return checkIn
	}

	async save(checkIn: CheckIn) {
		const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

		if (checkInIndex > -1) {
			this.items[checkInIndex] = checkIn
		}

		return checkIn
	}
}
