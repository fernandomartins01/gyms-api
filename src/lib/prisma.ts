import {env} from '@/env'
import {PrismaClient} from 'generated/prisma'

export const prisma = new PrismaClient({
	...(env.NODE_ENV === 'development' ? {log: ['query']} : {})
})
