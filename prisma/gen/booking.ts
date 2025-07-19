/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma, { type User, Service } from '../index'

export async function createBookings(
    client: User[] | any,
    artist: User[] | any,
    services: Service[] | any
) {
    return await Promise.all([
        prisma.booking.create({
            data: {
                clientId: client[0].id,
                artistId: artist[0].id,
                serviceId: services[0].id,
                bookingDate: new Date('2024-08-15'),
                startTime: new Date('2024-08-15T09:00:00'),
                endTime: new Date('2024-08-15T12:00:00'),
                price: 250.0,
                status: 'Confirmed',
                location: "Client's Home, New York, NY",
            },
        }),
        prisma.booking.create({
            data: {
                clientId: client[1].id,
                artistId: artist[1].id,
                serviceId: services[2].id,
                bookingDate: new Date('2024-07-20'),
                startTime: new Date('2024-07-20T14:00:00'),
                endTime: new Date('2024-07-20T15:00:00'),
                price: 80.0,
                status: 'Completed',
                location: 'Salon, Los Angeles, CA',
            },
        }),
        prisma.booking.create({
            data: {
                clientId: client[2].id,
                artistId: artist[2].id,
                serviceId: services[4].id,
                bookingDate: new Date('2024-07-25'),
                startTime: new Date('2024-07-25T11:00:00'),
                endTime: new Date('2024-07-25T12:00:00'),
                price: 45.0,
                status: 'Pending',
                location: 'Nail Studio, Chicago, IL',
            },
        }),
        prisma.booking.create({
            data: {
                clientId: client[0].id,
                artistId: artist[3].id,
                serviceId: services[6].id,
                bookingDate: new Date('2024-08-05'),
                startTime: new Date('2024-08-05T16:00:00'),
                endTime: new Date('2024-08-05T18:00:00'),
                price: 200.0,
                status: 'Confirmed',
                location: 'Downtown Studio, Miami, FL',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }),
        prisma.booking.create({
            data: {
                clientId: client[1].id,
                artistId: artist[0].id,
                serviceId: services[1].id,
                bookingDate: new Date('2024-06-30'),
                startTime: new Date('2024-06-30T15:00:00'),
                endTime: new Date('2024-06-30T17:00:00'),
                price: 120.0,
                status: 'Cancelled',
                location: 'Event Venue, New York, NY',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }),
    ])
}
