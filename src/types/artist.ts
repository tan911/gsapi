import { BookingStatus, Booking } from '@/prisma/index'

export type TGetBookingsData = {
    params: { userId: string }
    query: TBookingQuery
}

export type TGetBookingData = {
    params: { userId: string; bookingId: string }
}

export type TBookingQuery = {
    status?: BookingStatus | undefined
    startTimeFrom?: Booking['startTime'] | undefined
    endTimeTo?: Booking['endTime'] | undefined
    bookingDate?: Booking['bookingDate'] | undefined
}
