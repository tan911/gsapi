import * as z from 'zod'
import { Router, Request } from 'express'
import { AvailabilityService } from '@/services/availability'
import prisma from '@/prisma/index'
import logger from '@/config/logger'
import { validateRequest } from '@/middlewares/validate-request'
import {
    TGetAvailability,
    TUpdateAvailability,
    TCreateAvailability,
    TDeleteAvailability,
    TCreateRecurringAvailability,
    TUpdateRecurringAvailability,
} from '@/types/availability'
import { getValidated } from '@/utils/validation'

const router: Router = Router()

router.post(
    '/recurring/:id',
    validateRequest({
        params: z.object({
            id: z.cuid(),
        }),
        body: z.object({
            dayOfWeek: z.string(),
            startTime: z.string(),
            endTime: z.string(),
            timezone: z.string().optional(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new AvailabilityService({ prisma, logger })

        try {
            const getReq = getValidated<TCreateRecurringAvailability>(req)
            const reqBody = {
                artistId: getReq.params.id,
                ...getReq.body,
                dayOfWeek: Number(getReq.body.dayOfWeek),
            }
            const data = await service.createRecurringAvailability(reqBody)

            res.status(201).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

router.delete(
    '/recurring/:id',
    validateRequest({
        params: z.object({
            id: z.number(),
        }),
        transform: (req: Request) => ({
            id: Number(req.params.id),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new AvailabilityService({ prisma, logger })

        try {
            const getReq = getValidated<TUpdateRecurringAvailability>(req)
            const data = await service.deleteRecurringAvailability(getReq.params.id)

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
            id: z.cuid(),
        }),
        query: z.object({
            startDate: z
                .union([z.string().transform((val) => new Date(val)), z.date(), z.undefined()])
                .optional(),
            endDate: z
                .union([z.string().transform((val) => new Date(val)), z.date(), z.undefined()])
                .optional(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new AvailabilityService({ prisma, logger })

        try {
            const getReq = getValidated<TGetAvailability>(req)
            const data = await service.getAvailability(
                getReq.params.id,
                getReq.query.startDate,
                getReq.query.endDate
            )

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

router.post(
    '/:id',
    validateRequest({
        params: z.object({
            id: z.string(),
        }),
        body: z.object({
            date: z.string(),
            startTime: z.string(),
            endTime: z.string(),
            status: z.string().optional(),
            notes: z.string().optional(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new AvailabilityService({ prisma, logger })

        try {
            const getReq = getValidated<TCreateAvailability>(req)
            const reqBody = {
                artistId: getReq.params.id,
                ...getReq.body,
            }
            const data = await service.createAvailability(reqBody)

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
            id: z.number(),
        }),
        body: z.object({
            startTime: z.string().optional(),
            endTime: z.string().optional(),
            status: z.string().optional(),
            notes: z.string().optional(),
        }),
        transform: (req: Request) => ({
            id: Number(req.params.id),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new AvailabilityService({ prisma, logger })

        try {
            const getReq = getValidated<TUpdateAvailability>(req)
            const data = await service.updateAvailability(getReq.params.id, getReq.body)

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

router.delete(
    '/:id',
    validateRequest({
        params: z.object({
            id: z.number(),
        }),
        transform: (req: Request) => ({
            id: Number(req.params.id),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new AvailabilityService({ prisma, logger })

        try {
            const getReq = getValidated<TDeleteAvailability>(req)
            const data = await service.deleteAvailability(getReq.params.id)

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

export default router
