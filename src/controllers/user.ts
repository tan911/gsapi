import * as z from 'zod'
import { Router, Request } from 'express'
import prisma from '@/prisma/index'
import logger from '@/config/logger'
import { UserService } from '@/services/user'
import { OnboardingService } from '@/services/onboarding'
import {
    OnboardingFlow,
    OnboardingStep,
    TBasicInfo,
    TServices,
    TLocationAndTravel,
    TLocation,
} from '@/types/onboarding'
import { validateRequest } from '@/middlewares/validate-request'
import { Role } from '@/prisma/index'
import { getValidated } from '@/utils/validation'

const router: Router = Router()

router.get(
    '/onboarding/:flow',
    validateRequest({
        params: z.object({
            flow: z.enum(['basic_info', 'services', 'location_and_travel', 'location']).optional(),
        }),
    }),
    (req: Request, res, next) => {
        try {
            let steps: OnboardingFlow | OnboardingStep | null = null

            if (req.user) {
                const stepID = OnboardingService.getId(req.user.role as Role, req.params.flow) || 1

                steps = OnboardingService.getFlow(req.user.role as Role, stepID)
            }

            res.status(200).json({
                data: steps,
            })
        } catch (err) {
            next(err)
        }
    }
)

router.post(
    '/onboarding/:flow',
    validateRequest({
        params: z.object({
            flow: z.enum(['basic_info', 'services', 'location_and_travel', 'location']).optional(),
        }),
        body: z.object({
            bio: z.string().min(10).max(500).optional(),
            experienceYears: z.number().min(0).max(100).optional(),
            services: z.array(z.string()).optional(),
            address: z.string().max(200).optional(),
            city: z.string().max(100).optional(),
            state: z.string().max(100).optional(),
            country: z.string().max(100).optional(),
            travelRadiusKm: z.number().min(0).max(500).optional(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new UserService({ prisma, logger })

        try {
            const getReq = getValidated<TBasicInfo | TServices | TLocationAndTravel | TLocation>(
                req
            )

            if (req.user && req.user.role) {
                switch (req.params.flow) {
                    case 'basic_info': {
                        const data = { ...getReq.body } as TBasicInfo['body']

                        const { bio, experienceYears } = await service.updateUserArtist(
                            req.user.id,
                            data
                        )

                        res.status(200).json({
                            data: { bio, experienceYears },
                        })

                        break
                    }

                    case 'services': {
                        const data = { ...getReq.body } as TServices['body']
                        const services = await service.updateArtistService(
                            req.user.id,
                            data.services
                        )

                        res.status(200).json({
                            data: services,
                        })

                        break
                    }
                }
            }
        } catch (err) {
            next(err)
        }
    }
)

export default router
