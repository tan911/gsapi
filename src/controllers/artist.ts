import * as z from 'zod'
import { Router, Response, Request } from 'express'
import { ArtistService, TBookingQuery } from '@/services/artist'
import prisma, { BookingStatus } from '@/prisma/index'
import logger from '@/config/logger'
import { validateRequest } from '@/middlewares/validate-request'

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
    async (req: Request, res: Response, next) => {
        const service = new ArtistService({ prisma, logger })

        try {
            const { userId } = req.validated?.params as { userId: string }
            const queries = req.validated?.query as TBookingQuery
            const data = await service.getBooking(userId, queries)

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

router.get('/:userId/bookings/:bookingId', async (req, res) => {
    const service = new ArtistService({ prisma, logger })

    try {
        const userId = req.params.userId
        const bookingId = +req.params.bookingId
        const data = await service.getBookingById(userId, bookingId)

        res.json({
            data: data,
        })
    } catch (err) {
        console.log(err)
    }
})

export default router
