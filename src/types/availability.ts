import { AvailabilityStatus } from '@prisma/client'

export type TAvailabilityData = {
    dayOfWeek?: number
    startTime?: string
    endTime?: string
    isActive?: boolean
}

export type TGetAvailability = {
    params: {
        id: string
    }
    query: {
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
        id: string
    }
    body: {
        date: string
        startTime: string
        endTime: string
        status?: AvailabilityStatus
        notes?: string
    }
}

export type TDeleteAvailability = {
    params: {
        id: number
    }
}

export type TCreateRecurringAvailability = {
    params: {
        id: string
    }
    body: {
        dayOfWeek: number
        startTime: string
        endTime: string
        timezone?: string
    }
}

export type TUpdateRecurringAvailability = {
    params: {
        id: number
    }
    body: TAvailabilityData
}
export type TDeleteRecurringAvailability = {
    params: {
        id: number
    }
}
export type TGetRecurringAvailability = {
    params: {
        id: string
    }
}
