import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from '@/prisma/index'
import { createAuthMiddleware, APIError } from 'better-auth/api'

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                input: true,
            },
        },
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            try {
                if (ctx.context.newSession?.user.role === 'artist') {
                    /**
                     *
                     * Don't allow duplication for artist
                     */
                    const isExist = await prisma.artist.findUnique({
                        where: {
                            userId: ctx.context.newSession?.user.id,
                        },
                    })

                    if (!isExist) {
                        await prisma.artist.create({
                            data: {
                                userId: ctx.context.newSession.user.id,
                                bio: '',
                                experienceYears: 0,
                            },
                        })
                    }
                }
            } catch (error) {
                throw new APIError('INTERNAL_SERVER_ERROR', {
                    message: error as string,
                })
            }
        }),
    },
    trustedOrigins: ['http://localhost:3000'],
    basePath: '/api/auth',
})
