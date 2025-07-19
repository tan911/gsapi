import * as z from 'zod'
import { Router, Request } from 'express'
import prisma, { BookingStatus } from '@/prisma/index'
import logger from '@/config/logger'
import { BookingService } from '@/services/booking'
import { validateRequest } from '@/middlewares/validate-request'
import { getValidated } from '@/utils/validation'
import { TGetBooking, TGetBookings, TUpdateBooking } from '@/types/artist'

const router: Router = Router()

router.get(
    '/',
    validateRequest({
        query: z.object({
            id: z.cuid(),
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
            date: z
                .union([z.string().transform((val) => new Date(val)), z.date(), z.undefined()])
                .optional(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new BookingService({ prisma, logger })

        try {
            const getReq = getValidated<TGetBookings>(req)
            const queries = getReq.query
            const data = await service.getAll(queries.id, queries)

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
            const getReq = getValidated<TGetBooking>(req)
            const id = Number(getReq.params.id)
            const data = await service.get(id)

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

router.put(
    '/:id',
    validateRequest({
        params: z.object({
            id: z.string().min(1),
        }),
        body: z.object({
            // TODO: Allow updates for client users.
            // Currently unsure of what client users are allowed to do, so leaving it as is for now.
            status: z.enum(BookingStatus),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new BookingService({ prisma, logger })

        try {
            const getReq = getValidated<TUpdateBooking>(req)
            const id = Number(getReq.params.id)
            const data = await service.update(id, getReq.body)

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

export default router
