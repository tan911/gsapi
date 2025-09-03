import { PrismaClient, ArtistBlockedDate } from '@/prisma/index'
import { Logger } from 'winston'

export type BlockedDateQuery = {
    artistId: string
    startDate?: Date
    endDate?: Date
}

export type CreateBlockedDateData = {
    artistId: string
    date: Date
    reason?: string
    type: 'personal' | 'vacation' | 'sick' | 'other'
}

interface Context {
    prisma: PrismaClient
    logger: Logger
}

export class BlockedDatesService {
    constructor(private ctx: Context) {}

    public async getBlockedDates(query: BlockedDateQuery): Promise<ArtistBlockedDate[]> {
        const { artistId, startDate, endDate } = query

        const dateFilter =
            startDate && endDate
                ? { gte: startDate, lte: endDate }
                : startDate
                  ? { gte: startDate }
                  : endDate
                    ? { lte: endDate }
                    : undefined

        return await this.ctx.prisma.artistBlockedDate.findMany({
            where: {
                artistId,
                ...(dateFilter ? { date: dateFilter } : {}),
            },
            orderBy: { date: 'asc' },
        })
    }

    public async createBlockedDate(data: CreateBlockedDateData): Promise<ArtistBlockedDate> {
        const created = await this.ctx.prisma.artistBlockedDate.create({ data })

        this.ctx.logger.info(`Created blocked date for artist ${data.artistId} on ${data.date}`)

        return created
    }

    public async deleteBlockedDate(id: number): Promise<ArtistBlockedDate> {
        const deleted = await this.ctx.prisma.artistBlockedDate.delete({
            where: { id },
        })

        this.ctx.logger.info(`Deleted blocked date id=${id}`)

        return deleted
    }
}
