import { PrismaClient, AvailabilityStatus, Availability } from '@/prisma/index'
import { Logger } from 'winston'
import { TAvailabilityData } from '@/types/availability'

interface Context {
    prisma: PrismaClient
    logger: Logger
}

export class AvailabilityService {
    constructor(private ctx: Context) {}

    public async createRecurringAvailability(data: {
        artistId: string
        dayOfWeek: number // 1-7 (Monday-Sunday)
        startTime: string // "09:00"
        endTime: string // "17:00"
        timezone?: string
    }) {
        const startTime = new Date(`1970-01-01T${data.startTime}:00.000Z`).toISOString()
        const endTime = new Date(`1970-01-01T${data.endTime}:00.000Z`).toISOString()

        return await this.ctx.prisma.recurringAvailability.create({
            data: {
                artistId: data.artistId,
                dayOfWeek: data.dayOfWeek,
                startTime,
                endTime,
                timezone: data.timezone || 'UTC',
            },
            include: {
                artist: true,
            },
        })
    }

    public async getRecurringAvailability(artistId: string) {
        return await this.ctx.prisma.recurringAvailability.findMany({
            where: {
                artistId,
                isActive: true,
            },
            orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
        })
    }

    public async updateRecurringAvailability(id: number, data: TAvailabilityData) {
        const updateData: TAvailabilityData = {}

        if (data.startTime) {
            updateData.startTime = new Date(`1970-01-01T${data.startTime}:00.000Z`).toISOString()
        }
        if (data.endTime) {
            updateData.endTime = new Date(`1970-01-01T${data.endTime}:00.000Z`).toISOString()
        }
        if (data.dayOfWeek) updateData.dayOfWeek = data.dayOfWeek
        if (data.isActive !== undefined) updateData.isActive = data.isActive

        return await this.ctx.prisma.recurringAvailability.update({
            where: { id },
            data: updateData,
        })
    }

    public async deleteRecurringAvailability(id: number) {
        return await this.ctx.prisma.recurringAvailability.delete({
            where: { id },
        })
    }

    public async bulkUpdateRecurringAvailability(
        artistId: string,
        schedules: Array<TAvailabilityData>
    ) {
        const operations = schedules.map((schedule) => {
            const data: {
                dayOfWeek: number
                startTime: string
                endTime: string
                isActive: boolean
            } = {
                dayOfWeek: schedule.dayOfWeek as number,
                isActive: schedule.isActive as boolean,
                startTime: new Date(`1970-01-01T${schedule.startTime}:00.000Z`).toISOString(),
                endTime: new Date(`1970-01-01T${schedule.endTime}:00.000Z`).toISOString(),
            }

            // if (schedule.startTime) {
            //     data.startTime = new Date(`1970-01-01T${schedule.startTime}:00.000Z`).toISOString()
            // }
            // if (schedule.endTime) {
            //     data.endTime = new Date(`1970-01-01T${schedule.endTime}:00.000Z`).toISOString()
            // }

            return this.ctx.prisma.recurringAvailability.upsert({
                where: {
                    artistId_dayOfWeek: {
                        artistId,
                        dayOfWeek: schedule.dayOfWeek as number,
                    },
                },
                create: {
                    artistId,
                    ...data,
                },
                update: data,
            })
        })

        const tr = await this.ctx.prisma.$transaction(operations)

        this.ctx.logger.info(`Updated recurring availability with artistId=${artistId}`)

        return tr
    }

    /**
     *
     * Dates like use in calendar, use for specific availability
     *
     */
    public async createAvailability(data: {
        artistId: string
        date: string // "2025-08-15"
        startTime: string
        endTime: string
        status?: AvailabilityStatus
        notes?: string
    }) {
        const startTime = new Date(`1970-01-01T${data.startTime}:00.000Z`).toISOString()
        const endTime = new Date(`1970-01-01T${data.endTime}:00.000Z`).toISOString()

        return await this.ctx.prisma.availability.create({
            data: {
                artistId: data.artistId,
                date: new Date(data.date),
                startTime,
                endTime,
                status: data.status || 'available',
                notes: data.notes,
            },
        })
    }

    public async getAvailability(artistId: string, startDate: string, endDate: string) {
        return await this.ctx.prisma.availability.findMany({
            where: {
                artistId,
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        })
    }

    public async updateAvailability(
        id: Availability['id'],
        data: {
            startTime?: string
            endTime?: string
            status?: AvailabilityStatus
            notes?: string
        }
    ) {
        const updateData: {
            startTime?: string
            endTime?: string
            status?: AvailabilityStatus
            notes?: string
        } = {}

        if (data.startTime) {
            updateData.startTime = new Date(`1970-01-01T${data.startTime}:00.000Z`).toDateString()
        }
        if (data.endTime) {
            updateData.endTime = new Date(`1970-01-01T${data.endTime}:00.000Z`).toDateString()
        }
        if (data.status) updateData.status = data.status
        if (data.notes !== undefined) updateData.notes = data.notes

        return await this.ctx.prisma.availability.update({
            where: { id },
            data: updateData,
        })
    }

    public async deleteAvailability(id: Availability['id']) {
        return await this.ctx.prisma.availability.delete({
            where: { id },
        })
    }
}
