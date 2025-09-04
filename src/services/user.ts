import {
    Artist,
    ArtistServiceAreas,
    Prisma,
    PrismaClient,
    User,
    UserLocation,
} from '@/prisma/index'
import { TLocationAndTravel, TLocation } from '@/types/onboarding'
import { Logger } from 'winston'

interface Context {
    prisma: PrismaClient
    logger: Logger
}

export class UserService {
    constructor(private ctx: Context) {}

    public async get(id: User['id']) {
        const user = await this.ctx.prisma.user.findUnique({
            where: {
                id: id,
            },
        })

        return user
    }

    public async updateUserOnboardingStep(id: User['id'], step: number, isCompleted: boolean) {
        const user = await this.ctx.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                onboardingStep: step,
                onboardingCompleted: isCompleted,
            },
        })

        this.ctx.logger.info(`Updated user onboarding step id=${id} to step=${step}`)

        return user
    }

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

    public async updateArtistLocation(id: User['id'], data: TLocationAndTravel['body']) {
        const location: UserLocation = (await this.ctx.prisma.$executeRaw`
            INSERT INTO "users_location" ("userId", address, city, state, country,
            country, "postal_code", latitude, longtitude,  location, "createAt", "updatedAt")
            VALUES (
            ${id},
            ${data.address},
            ${data.city},
            ${data.state},
            ${data.country},
            ${data.postalCode},
            ${data.latitude},
            ${data.longitude},
            ST_GeomFromText(POINT(${data.longitude}, ${data.latitude}), 4326),
            NOW(),
            NOW())
        `) as unknown as UserLocation

        const user = await this.ctx.prisma.artist.findUnique({
            where: {
                userId: id,
            },
        })

        let serviceAreas: ArtistServiceAreas | null = null

        if (user) {
            serviceAreas = await this.ctx.prisma.artistServiceAreas.create({
                data: {
                    artistId: user.id,
                    locationId: location.id,
                    travelRadiusKm: parseInt(String(data.travelRadiusKm)) || 10,
                },
            })
        }

        return { location, serviceAreas }
    }

    public async updateClientLocation(id: User['id'], data: TLocation['body']) {
        const location: UserLocation = (await this.ctx.prisma.$executeRaw`
            INSERT INTO "users_location" ("userId", address, city, state, country,
            country, "postal_code", latitude, longtitude,  location, "createAt", "updatedAt")
            VALUES (
            ${id},
            ${data.address},
            ${data.city},
            ${data.state},
            ${data.country},
            ${data.postalCode},
            ${data.latitude},
            ${data.longitude},
            ST_GeomFromText(POINT(${data.longitude}, ${data.latitude}), 4326),
            NOW(),
            NOW())
        `) as unknown as UserLocation

        return location
    }
}
