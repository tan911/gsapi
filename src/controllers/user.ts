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
            latitude: z.number().min(-90).max(90).optional(),
            longitude: z.number().min(-180).max(180).optional(),
            postalCode: z.string().max(20).optional(),
        }),
    }),
    async (req: Request, res, next) => {
        const service = new UserService({ prisma, logger })

        try {
            const getReq = getValidated<TBasicInfo | TServices | TLocationAndTravel | TLocation>(
                req
            )

            if (req.user && req.user.role) {
                const userRole = req.user.role as Role
                const userId = req.user.id

                // get the current user info
                const user = await service.get(userId)

                switch (req.params.flow) {
                    case 'basic_info': {
                        const data = { ...getReq.body } as TBasicInfo['body']
                        const { bio, experienceYears } = await service.updateUserArtist(
                            userId,
                            data
                        )

                        const stepID = OnboardingService.getId(userRole, req.params.flow) || 1

                        // new onboarding step
                        const newStep = Math.max(user?.onboardingStep as number, stepID + 1)

                        const isCompleted = OnboardingService.isOnboardingComplete(
                            userRole,
                            newStep
                        )

                        const nextStep = OnboardingService.getNextStep(userRole, newStep)

                        // update user onboarding step
                        await service.updateUserOnboardingStep(userId, newStep, isCompleted)

                        res.status(200).json({
                            data: {
                                stepData: { bio, experienceYears },
                                nextStep: nextStep,
                                onboardingCompleted: isCompleted,
                            },
                        })

                        break
                    }

                    case 'services': {
                        const data = { ...getReq.body } as TServices['body']
                        const services = await service.updateArtistService(
                            req.user.id,
                            data.services
                        )

                        const stepID = OnboardingService.getId(userRole, req.params.flow) || 1

                        // new onboarding step
                        const newStep = Math.max(user?.onboardingStep as number, stepID + 1)

                        const isCompleted = OnboardingService.isOnboardingComplete(
                            userRole,
                            newStep
                        )

                        const nextStep = OnboardingService.getNextStep(userRole, newStep)

                        // update user onboarding step
                        await service.updateUserOnboardingStep(userId, newStep, isCompleted)

                        res.status(200).json({
                            data: {
                                stepData: services,
                                nextStep: nextStep,
                                onboardingCompleted: isCompleted,
                            },
                        })

                        break
                    }

                    case 'location_and_travel': {
                        const data = { ...getReq.body } as TLocationAndTravel['body']
                        const { location, serviceAreas } = await service.updateArtistLocation(
                            req.user.id,
                            data
                        )

                        const stepID = OnboardingService.getId(userRole, req.params.flow) || 1

                        // new onboarding step
                        const newStep = Math.max(user?.onboardingStep as number, stepID + 1)

                        const isCompleted = OnboardingService.isOnboardingComplete(
                            userRole,
                            newStep
                        )

                        const nextStep = OnboardingService.getNextStep(userRole, newStep)

                        // update user onboarding step
                        await service.updateUserOnboardingStep(userId, newStep, isCompleted)

                        res.status(200).json({
                            data: {
                                stepData: { location, serviceAreas },
                                nextStep: nextStep,
                                onboardingCompleted: isCompleted,
                            },
                        })

                        break
                    }

                    default: {
                        // client location
                        const data = { ...getReq.body } as TLocation['body']
                        const { location } = await service.updateArtistLocation(req.user.id, data)

                        const stepID = OnboardingService.getId(userRole, req.params.flow) || 1

                        // new onboarding step
                        const newStep = Math.max(user?.onboardingStep as number, stepID + 1)

                        const isCompleted = OnboardingService.isOnboardingComplete(
                            userRole,
                            newStep
                        )

                        const nextStep = OnboardingService.getNextStep(userRole, newStep)

                        // update user onboarding step
                        await service.updateUserOnboardingStep(userId, newStep, isCompleted)

                        res.status(200).json({
                            data: {
                                stepData: location,
                                nextStep: nextStep,
                                onboardingCompleted: isCompleted,
                            },
                        })
                    }
                }
            }
        } catch (err) {
            next(err)
        }
    }
)

export default router
