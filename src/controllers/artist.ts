import * as z from 'zod'
import { Router, Request } from 'express'
import prisma, { BookingStatus } from '@/prisma/index'
import logger from '@/config/logger'
import { ArtistService } from '@/services/artist'
import { validateRequest } from '@/middlewares/validate-request'
import { getValidated } from '@/utils/validation'
import { TGetBookingData, TGetBookingsData } from '@/types/artist'

const router: Router = Router()

router.get(
    '/:userId/bookings',
    validateRequest({
        params: z.object({ userId: z.string() }),
        query: z.object({
            status: z.enum(BookingStatus).optional(),
            timeFrom: z
                .union([
                    z.string().transform((val) => new Date(`1970-01-01T${val}Z`)),
                    z.date(),
                    z.undefined(),
                ])
                .optional(),
            timeTo: z
                .union([
                    z.string().transform((val) => new Date(`1970-01-01T${val}Z`)),
                    z.date(),
                    z.undefined(),
                ])
                .optional(),
            bookingDate: z
                .union([z.string().transform((val) => new Date(val)), z.date(), z.undefined()])
                .optional(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new ArtistService({ prisma, logger })

        try {
            const getReq = getValidated<TGetBookingsData>(req)
            const params = getReq.params
            const queries = getReq.query

            const data = await service.getBooking(params.userId, queries)

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

router.get(
    '/:userId/bookings/:bookingId',
    validateRequest({
        params: z.object({
            userId: z.string(),
            bookingId: z.string(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new ArtistService({ prisma, logger })

        try {
            const getReq = getValidated<TGetBookingData>(req)
            const { userId, bookingId } = getReq.params
            const data = await service.getBookingById(userId, +bookingId)

            res.json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

export default router
