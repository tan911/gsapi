import { AvailabilityStatus } from '@prisma/client'

export type TGetAvailability = {
    params: {
        id: string
    }
    body: {
        startDate: string
        endDate: string
    }
}

export type TUpdateAvailability = {
    params: {
        id: number
    }
    body: {
        startTime?: string
        endTime?: string
        status?: AvailabilityStatus
        notes?: string
    }
}
export type TCreateAvailability = {
    params: {
        id: number
    }
    body: {
        date: string
        startTime: string
        endTime: string
        status?: AvailabilityStatus
        notes?: string
    }
}
