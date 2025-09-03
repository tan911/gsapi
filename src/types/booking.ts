import { BookingStatus, Booking } from '@/prisma/index'

export type TGetBookings = {
    query: TBookingQuery
}

export type TGetBooking = {
    params: { id: number }
}

export type TCreateBooking = {
    body: {
        clientId: string
        artistId: string
        serviceId: number
        bookingDate: string
        startTime: string
        endTime: string
        price: number
        servicePrice?: number
        travelFee?: number
        totalAmount?: number
        location: string
        isTravel?: boolean
        travelDistanceKm?: number
        notes?: string
        calendarColor?: string
        recurring?: boolean
        recurrenceRule?: string
        source?: 'web' | 'app' | 'phone' | 'manual'
    }
}

export type TUpdateBooking = {
    params: { id: number }
    body: { status: BookingStatus }
}

export type TBookingQuery = {
    id: string
    status?: BookingStatus | undefined
    startTimeFrom?: Booking['startTime'] | undefined
    endTimeTo?: Booking['endTime'] | undefined
    date?: Booking['bookingDate'] | undefined
}
