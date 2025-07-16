import { PrismaClient, User, Booking, BookingStatus } from '@/prisma/index'
import { Logger } from 'winston'
import { TBookingQuery } from '@/types/artist'

interface IArtistService {
    getBooking(userId: User['id'], queries: TBookingQuery): Promise<Booking[]>
    // getBookingById(userId: User['id'], bookingId: Booking['id']): Promise<Booking>
}

interface Context {
    prisma: PrismaClient
    logger: Logger
}

export class ArtistService implements IArtistService {
    constructor(private ctx: Context) {}

    public async getBooking(userId: User['id'], queries: TBookingQuery) {
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

        if (queries.bookingDate) {
            filters.push({ bookingDate: queries.bookingDate })
        }

        return await this.ctx.prisma.booking.findMany({
            where: {
                artistId: userId,
                AND: filters,
            },
        })
    }

    public async getBookingById(userId: User['id'], bookingId: Booking['id']) {
        return await this.ctx.prisma.booking.findUnique({
            where: {
                id: bookingId,
                AND: {
                    artistId: userId,
                },
            },
        })
    }

    public async getBookingByStatus(userId: User['id'], status: BookingStatus) {
        return await this.ctx.prisma.booking.findMany({
            where: {
                artistId: userId,
                AND: {
                    status: status,
                },
            },
        })
    }

    public async updateBookingStatus(id: Booking['id'], status: BookingStatus) {
        const data = this.ctx.prisma.booking.update({
            where: {
                id: id,
            },
            data: {
                status: status,
            },
        })

        this.ctx.logger.info(`Updated booking id=${id}`)

        return data
    }
}
