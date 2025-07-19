import * as z from 'zod'
import { Router, Request } from 'express'
import { ServiceOfferingService } from '@/services/service-offering'
import { validateRequest } from '@/middlewares/validate-request'
import { getValidated } from '@/utils/validation'
import {
    TGetServiceOfferings,
    TGetServiceOffering,
    TCreateServiceOffering,
    TUpdateServiceOffering,
} from '@/types/service-offering'
import prisma from '@/prisma/index'
import logger from '@/config/logger'

const router: Router = Router()

router.get(
    '/',
    validateRequest({
        query: z.object({
            id: z.cuid(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new ServiceOfferingService({ prisma, logger })

        try {
            const getReq = getValidated<TGetServiceOfferings>(req)
            const data = await service.getAll(getReq.query.id)

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
            id: z.number(),
        }),
        transform: (req: Request) => ({
            id: Number(req.params.id),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new ServiceOfferingService({ prisma, logger })

        try {
            const getReq = getValidated<TGetServiceOffering>(req)
            const data = await service.get(getReq.params.id)

            res.status(200).json({
                data: data,
            })
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
            name: z.string().min(1),
            description: z.string().min(1),
            price: z.coerce.number().positive(), // TODO: minimum value for services
            durationHours: z.coerce.number().lt(5), // less than 5 hours
            isActive: z.coerce.boolean().default(true),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new ServiceOfferingService({ prisma, logger })

        try {
            const getReq = getValidated<TCreateServiceOffering>(req)
            const data = await service.create(getReq.body)

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
        params: z.object({
            id: z.number(),
        }),
        body: z.object({
            name: z.string().min(1).optional(),
            description: z.string().min(1).optional(),
            price: z.coerce.number().positive().optional(),
            durationHours: z.coerce.number().lte(5).optional(),
            isActive: z.coerce.boolean().optional(),
        }),
        transform: (req: Request) => ({
            id: Number(req.params.id),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new ServiceOfferingService({ prisma, logger })

        try {
            const getReq = getValidated<TUpdateServiceOffering>(req)
            const data = await service.update(getReq.params.id, getReq.body)

            res.status(200).json({
                data: data,
            })
        } catch (err) {
            next(err)
        }
    }
)

export default router
