import { PrismaClient, Booking, ArtistBlockedDate } from '@/prisma/index'
import { Logger } from 'winston'

export type CalendarQuery = {
    artistId: string
    startDate?: Date
    endDate?: Date
}

interface Context {
    prisma: PrismaClient
    logger: Logger
}

export class CalendarService {
    constructor(private ctx: Context) {}

    public async getCalendar(query: CalendarQuery): Promise<{
        bookings: Booking[]
        blockedDates: ArtistBlockedDate[]
    }> {
        const { artistId, startDate, endDate } = query

        const dateFilter =
            startDate && endDate
                ? { gte: startDate, lte: endDate }
                : startDate
                  ? { gte: startDate }
                  : endDate
                    ? { lte: endDate }
                    : undefined

        const [bookings, blockedDates] = await Promise.all([
            this.ctx.prisma.booking.findMany({
                where: {
                    artistId,
                    ...(dateFilter ? { bookingDate: dateFilter } : {}),
                },
                include: {
                    client: { select: { id: true, name: true, email: true, image: true } },
                    service: true,
                    attachments: true,
                },
                orderBy: [{ bookingDate: 'asc' }, { startTime: 'asc' }],
            }),
            this.ctx.prisma.artistBlockedDate.findMany({
                where: {
                    artistId,
                    ...(dateFilter ? { date: dateFilter } : {}),
                },
                orderBy: { date: 'asc' },
            }),
        ])

        return { bookings, blockedDates }
    }
}
