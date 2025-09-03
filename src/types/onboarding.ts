import { Service } from '@/prisma/index'

export interface OnboardingStep {
    id: number
    name: string
    title: string
    description: string
    isRequired: boolean
    fields: OnboardingField[]
}

export interface OnboardingField {
    name: string
    type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'location'
    label: string
    placeholder?: string
    required: boolean
}

export interface OnboardingFlow {
    totalSteps: number
    steps: OnboardingStep[]
    currentStep: number
    completedSteps: number[]
    isCompleted: boolean
}

export type TBasicInfo = {
    body: {
        bio?: string
        experienceYears?: number
    }
}

export type TServices = {
    body: {
        services: Service[]
    }
}

export type TLocationAndTravel = {
    body: {
        address?: string
        city?: string
        state?: string
        country?: string
        travelRadiusKm?: number
    }
}

export type TLocation = {
    body: {
        address?: string
        city?: string
        state?: string
        country?: string
    }
}
