import {randomUUID} from 'node:crypto'
import {getDistanceBetweenCoordinates} from '@/utils/get-distance-between-coordinates'
import type {Gym, Prisma} from 'generated/prisma'
import {Decimal} from 'generated/prisma/runtime/library'
import type {FindManyNearbyParams, GymsRepository} from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
	readonly items: Gym[] = []

	async findById(id: string) {
		return this.items.find((gym) => gym.id === id) ?? null
	}

	async findManyNearby({latitude, longitude}: FindManyNearbyParams) {
		return this.items.filter((item) => {
			const distance = getDistanceBetweenCoordinates(
				{latitude, longitude},
				{
					latitude: item.latitude.toNumber(),
					longitude: item.longitude.toNumber()
				}
			)

			return distance < 10
		})
	}

	async searchMany(query: string, page: number) {
		return this.items
			.filter((item) => item.title.includes(query))
			.slice((page - 1) * 20, page * 20)
	}

	async create(data: Prisma.GymCreateInput) {
		const gym: Gym = {
			id: data.id ?? randomUUID(),
			title: data.title,
			description: data.description ?? null,
			phone: data.phone ?? null,
			latitude: new Decimal(data.latitude.toString()),
			longitude: new Decimal(data.longitude.toString())
		}

		this.items.push(gym)

		return gym
	}
}
