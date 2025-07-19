import { PrismaClient, User, Booking, Prisma } from '@/prisma/index'
import { Logger } from 'winston'
import { TBookingQuery } from '@/types/artist'

interface IBookingService {
    getAll(userId: User['id'], queries: TBookingQuery): Promise<Booking[]>
    get(id: Booking['id']): Promise<Booking | null>
    update(id: Booking['id'], data: Prisma.BookingUncheckedUpdateInput): Promise<Booking>
}

interface Context {
    prisma: PrismaClient
    logger: Logger
}

export class BookingService implements IBookingService {
    constructor(private ctx: Context) {}

    public async getAll(userId: User['id'], queries: TBookingQuery) {
        const filters = []

        if (queries.status) {
            filters.push({ status: queries.status })
        }

        if (queries.startTimeFrom) {
            filters.push({ startTime: { gte: queries.startTimeFrom } })
        }

        if (queries.endTimeTo) {
            filters.push({ endTime: { lte: queries.endTimeTo } })
        }

        if (queries.date) {
            filters.push({ bookingDate: queries.date })
        }

        return await this.ctx.prisma.booking.findMany({
            where: {
                artistId: userId,
                AND: filters,
            },
        })
    }

    public async get(id: Booking['id']) {
        return await this.ctx.prisma.booking.findUnique({
            where: {
                id: id,
            },
        })
    }

    public async update(id: Booking['id'], data: Prisma.BookingUncheckedUpdateInput) {
        const booking = this.ctx.prisma.booking.update({
            where: {
                id: id,
            },
            data,
        })

        this.ctx.logger.info(`Updated booking id=${id}`)

        return booking
    }
}
