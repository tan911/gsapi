import * as z from 'zod'
import { Router } from 'express'
import prisma from '@/prisma/index'
import logger from '@/config/logger'
import { validateRequest } from '@/middlewares/validate-request'
import { getValidated } from '@/utils/validation'
import { BlockedDatesService } from '@/services/blocked-dates'

const router: Router = Router()

const dateSchema = z.union([z.string().transform((v) => new Date(v)), z.date()])

router.get(
    '/',
    validateRequest({
        query: z.object({
            artistId: z.cuid(),
            startDate: dateSchema.optional(),
            endDate: dateSchema.optional(),
        }),
    }),
    async (req, res, next) => {
        const service = new BlockedDatesService({ prisma, logger })

        try {
            const { query } = getValidated<{
                query: { artistId: string; startDate?: Date; endDate?: Date }
            }>(req)

            const data = await service.getBlockedDates(query)

            res.status(200).json({ data })
        } catch (err) {
            next(err)
        }
    }
)

router.post(
    '/',
    validateRequest({
        body: z.object({
            artistId: z.cuid(),
            date: dateSchema,
            reason: z.string().optional(),
            type: z.enum(['personal', 'vacation', 'sick', 'other'] as const).default('personal'),
        }),
    }),
    async (req, res, next) => {
        const service = new BlockedDatesService({ prisma, logger })

        try {
            const { body } = getValidated<{
                body: {
                    artistId: string
                    date: Date
                    reason?: string
                    type: 'personal' | 'vacation' | 'sick' | 'other'
                }
            }>(req)

            const created = await service.createBlockedDate(body)

            res.status(201).json({ data: created })
        } catch (err) {
            next(err)
        }
    }
)

router.delete(
    '/:id',
    validateRequest({
        params: z.object({ id: z.string().transform((v) => Number(v)) }),
    }),
    async (req, res, next) => {
        const service = new BlockedDatesService({ prisma, logger })

        try {
            const { params } = getValidated<{ params: { id: number } }>(req)

            // Verify the authenticated user is an artist
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' })
            }

            if (req.user.role !== 'artist') {
                return res.status(403).json({ error: 'Only artists can manage blocked dates' })
            }

            // Get the blocked date to verify ownership
            const blockedDate = await prisma.artistBlockedDate.findUnique({
                where: { id: params.id },
                select: { artistId: true },
            })

            if (!blockedDate) {
                return res.status(404).json({ error: 'Blocked date not found' })
            }

            if (req.user.artistId !== blockedDate.artistId) {
                return res
                    .status(403)
                    .json({ error: 'Artists can only delete their own blocked dates' })
            }

            const deleted = await service.deleteBlockedDate(params.id)

            res.status(200).json({ data: deleted })
        } catch (err) {
            next(err)
        }
    }
)

export default router
