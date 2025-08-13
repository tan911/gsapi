import * as z from 'zod'
import { Router, Request } from 'express'
import { AvailabilityService } from '@/services/availability'
import prisma from '@/prisma/index'
import logger from '@/config/logger'
import { validateRequest } from '@/middlewares/validate-request'
import { TGetAvailability, TUpdateAvailability, TCreateAvailability } from '@/types/availability'
import { getValidated } from '@/utils/validation'

const router: Router = Router()

router.get(
    '/:id',
    validateRequest({
        params: z.object({
            id: z.string(),
        }),
        body: z.object({
            startDate: z.string(),
            endDate: z.string(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new AvailabilityService({ prisma, logger })

        try {
            const getReq = getValidated<TGetAvailability>(req)
            const data = await service.getAvailability(
                getReq.params.id,
                getReq.body.startDate,
                getReq.body.endDate
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
            const data = await service.updateAvailability(getReq.params.id, getReq.body)

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
            id: z.string(),
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

export default router
