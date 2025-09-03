import { PrismaClient, User, Booking, Prisma } from '@/prisma/index'
import { Logger } from 'winston'
import { TBookingQuery } from '@/types/booking'

export type CreateBookingData = {
    clientId: string
    artistId: string
    serviceId: number
    bookingDate: string | Date
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

interface IBookingService {
    getAll(userId: User['id'], queries: TBookingQuery): Promise<Booking[]>
    get(id: Booking['id']): Promise<Booking | null>
    create(data: CreateBookingData, clientUserId: string): Promise<Booking>
    update(id: Booking['id'], data: Prisma.BookingUncheckedUpdateInput): Promise<Booking>
}

interface Context {
    prisma: PrismaClient
    logger: Logger
}

export class BookingService implements IBookingService {
    constructor(private ctx: Context) {}

    public async getAll(userId: User['id'], queries: TBookingQuery) {
        const filters = []

        if (queries.status) {
            filters.push({ status: queries.status })
        }

        if (queries.startTimeFrom) {
            filters.push({ startTime: { gte: queries.startTimeFrom } })
        }

        if (queries.endTimeTo) {
            filters.push({ endTime: { lte: queries.endTimeTo } })
        }

        if (queries.date) {
            filters.push({ bookingDate: queries.date })
        }

        return await this.ctx.prisma.booking.findMany({
            where: {
                artistId: userId,
                AND: filters,
            },
            include: {
                client: { select: { id: true, name: true, email: true, image: true } },
                service: true,
                attachments: true,
            },
            orderBy: [{ bookingDate: 'asc' }, { startTime: 'asc' }],
        })
    }

    public async get(id: Booking['id']) {
        return await this.ctx.prisma.booking.findUnique({
            where: {
                id: id,
            },
            include: {
                client: { select: { id: true, name: true, email: true, image: true } },
                service: true,
                attachments: true,
            },
        })
    }

    public async create(data: CreateBookingData, clientUserId: string): Promise<Booking> {
        // Verify the user is a client and is creating a booking for themselves
        const client = await this.ctx.prisma.user.findUnique({
            where: { id: clientUserId },
            select: { id: true, role: true },
        })

        if (!client) {
            throw new Error('User not found')
        }

        if (client.role !== 'client') {
            throw new Error('Only client users can create bookings')
        }

        if (client.id !== data.clientId) {
            throw new Error('Users can only create bookings for themselves')
        }

        // Verify the artist exists
        this.ctx.logger.info(`Looking for artist with ID: ${data.artistId}`)

        const artist = await this.ctx.prisma.artist.findUnique({
            where: { id: data.artistId },
        })

        if (!artist) {
            // Let's check what artists exist to help debug
            const allArtists = await this.ctx.prisma.artist.findMany({
                select: { id: true, userId: true },
            })
            this.ctx.logger.error(
                `Artist not found. Available artists: ${JSON.stringify(allArtists)}`
            )
            throw new Error(
                `Artist not found with ID: ${data.artistId}. Please provide a valid Artist ID (not User ID).`
            )
        }

        this.ctx.logger.info(`Found artist: id=${artist.id}, userId=${artist.userId}`)

        // Use the artist ID directly since the schema is now correct
        const actualArtistId = artist.id

        // Verify the service exists and belongs to the artist
        const service = await this.ctx.prisma.service.findFirst({
            where: {
                id: data.serviceId,
                artistId: actualArtistId,
                isActive: true,
            },
        })

        if (!service) {
            throw new Error('Service not found or not available')
        }

        // Create the booking
        const booking = await this.ctx.prisma.booking.create({
            data: {
                clientId: data.clientId,
                artistId: actualArtistId,
                serviceId: data.serviceId,
                bookingDate:
                    typeof data.bookingDate === 'string'
                        ? new Date(data.bookingDate)
                        : data.bookingDate,
                startTime: new Date(`1970-01-01T${data.startTime}`),
                endTime: new Date(`1970-01-01T${data.endTime}`),
                price: data.price,
                servicePrice: data.servicePrice,
                travelFee: data.travelFee || 0,
                totalAmount: data.totalAmount || data.price + (data.travelFee || 0),
                location: data.location,
                isTravel: data.isTravel || false,
                travelDistanceKm: data.travelDistanceKm,
                notes: data.notes,
                calendarColor: data.calendarColor,
                recurring: data.recurring || false,
                recurrenceRule: data.recurrenceRule,
                source: data.source || 'web',
                status: 'Pending',
                paymentStatus: 'unpaid',
            },
            include: {
                client: { select: { id: true, name: true, email: true, image: true } },
                service: true,
                attachments: true,
            },
        })

        this.ctx.logger.info(
            `Created booking id=${booking.id} for client ${data.clientId} with artist ${data.artistId}`
        )

        return booking
    }

    public async update(id: Booking['id'], data: Prisma.BookingUncheckedUpdateInput) {
        const booking = this.ctx.prisma.booking.update({
            where: {
                id: id,
            },
            data,
        })

        this.ctx.logger.info(`Updated booking id=${id}`)

        return booking
    }
}
