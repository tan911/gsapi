import { Artist, Prisma, PrismaClient } from '@/prisma/index'
import { Logger } from 'winston'

interface Context {
    prisma: PrismaClient
    logger: Logger
}

export class UserService {
    constructor(private ctx: Context) {}

    public async updateUserArtist(id: Artist['id'], data: Prisma.ArtistUncheckedUpdateInput) {
        const tx = this.ctx.prisma.artist.update({
            where: {
                id: id,
            },
            data,
        })

        this.ctx.logger.info(`Updated artist id=${id}`)

        return tx
    }

    public async updateArtistService(id: Artist['id'], data: Prisma.ServiceUncheckedCreateInput[]) {
        const services = await this.ctx.prisma.$transaction(async (tx) => {
            await tx.service.deleteMany({
                where: {
                    artistId: id,
                },
            })

            await tx.service.createMany({
                data: data.map((service) => ({
                    ...service,
                    artistId: id,
                    isActive: true,
                })),
            })
        })

        return services
    }
}
