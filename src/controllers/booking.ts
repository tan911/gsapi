import * as z from 'zod'
import { Router, Request } from 'express'
import prisma, { BookingStatus } from '@/prisma/index'
import logger from '@/config/logger'
import { BookingService } from '@/services/booking'
import { validateRequest } from '@/middlewares/validate-request'
import { getValidated } from '@/utils/validation'
import { TGetBookingData, TGetBookingsData, TUpdateBookingStatus } from '@/types/artist'

const router: Router = Router()

router.get(
    '/',
    validateRequest({
        query: z.object({
            id: z.string().min(1),
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
        const service = new BookingService({ prisma, logger })

        try {
            const getReq = getValidated<TGetBookingsData>(req)
            const queries = getReq.query

            const data = await service.getBooking(queries.id, queries)

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

router.get(
    '/:id',
    validateRequest({
        params: z.object({
            id: z.string().min(1),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new BookingService({ prisma, logger })

        try {
            const getReq = getValidated<TGetBookingData>(req)
            const id = Number(getReq.params.id)
            const data = await service.getBookingById(id)

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

router.patch(
    '/:id',
    validateRequest({
        query: z.object({
            id: z.string().min(1),
        }),
        body: z.object({
            status: z.enum(BookingStatus),
        }),
    }),
    async (req, res, next) => {
        const service = new BookingService({ prisma, logger })

        try {
            const getReq = getValidated<TUpdateBookingStatus>(req)
            const { query, body } = getReq
            // TODO: It should allow update to any fields regardless of the user's type.
            const data = await service.updateBookingStatus(+query.id, body.status)

            res.status(201).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

export default router
