import { BookingStatus, Booking } from '@/prisma/index'

export type TGetBookings = {
    query: TBookingQuery
}

export type TGetBooking = {
    params: { id: string }
}

export type TUpdateBooking = {
    params: { id: string }
    body: { status: BookingStatus }
}

export type TBookingQuery = {
    id: string
    status?: BookingStatus | undefined
    startTimeFrom?: Booking['startTime'] | undefined
    endTimeTo?: Booking['endTime'] | undefined
    date?: Booking['bookingDate'] | undefined
}
