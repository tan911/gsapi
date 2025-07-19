import { PrismaClient, Service, Prisma } from '@/prisma/index'
import { Logger } from 'winston'

interface IServiceOfferingService {
    getAll(id: Service['artistId']): Promise<Service[]>
    get(id: Service['id']): Promise<Service | null>
    create(data: Prisma.ServiceUncheckedCreateInput): Promise<Service>
}

interface Context {
    prisma: PrismaClient
    logger: Logger
}

export class ServiceOfferingService implements IServiceOfferingService {
    constructor(private readonly ctx: Context) {}

    public async getAll(id: Service['artistId']) {
        return this.ctx.prisma.service.findMany({
            where: {
                artistId: id,
            },
        })
    }

    public async get(id: Service['id']) {
        return this.ctx.prisma.service.findUnique({
            where: {
                id: id,
            },
        })
    }

    public async create(data: Prisma.ServiceUncheckedCreateInput) {
        return this.ctx.prisma.service.create({
            data: data,
        })
    }

    public async update(id: Service['id'], data: Prisma.ServiceUncheckedUpdateInput) {
        const service = this.ctx.prisma.service.update({
            where: {
                id: id,
            },
            data,
        })

        this.ctx.logger.info(`Updated service id=${id}`)

        return service
    }
}
