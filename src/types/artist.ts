import { BookingStatus, Booking } from '@/prisma/index'

export type TGetBookingsData = {
    query: TBookingQuery
}

export type TGetBookingData = {
    params: { id: string }
}

export type TUpdateBookingStatus = {
    query: { id: string }
    body: { status: BookingStatus }
}

export type TBookingQuery = {
    id: string
    status?: BookingStatus | undefined
    startTimeFrom?: Booking['startTime'] | undefined
    endTimeTo?: Booking['endTime'] | undefined
    bookingDate?: Booking['bookingDate'] | undefined
}
