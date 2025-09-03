import * as z from 'zod'
import { Router } from 'express'
import prisma from '@/prisma/index'
import logger from '@/config/logger'
import { validateRequest } from '@/middlewares/validate-request'
import { getValidated } from '@/utils/validation'
import { CalendarService } from '@/services/calendar'

const router: Router = Router()

router.get(
    '/',
    validateRequest({
        query: z.object({
            artistId: z.cuid(),
            startDate: z
                .union([z.string().transform((v) => new Date(v)), z.date(), z.undefined()])
                .optional(),
            endDate: z
                .union([z.string().transform((v) => new Date(v)), z.date(), z.undefined()])
                .optional(),
        }),
    }),
    async (req, res, next) => {
        const service = new CalendarService({ prisma, logger })

        try {
            const { query } = getValidated<{
                query: { artistId: string; startDate?: Date; endDate?: Date }
            }>(req)
            const data = await service.getCalendar(query)

            res.status(200).json({ data })
        } catch (err) {
            next(err)
        }
    }
)

export default router
