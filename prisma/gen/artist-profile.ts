/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import prisma, { type User } from '../index'

export async function createArtistProfiles(artist: User[] | any) {
    return await Promise.all([
        prisma.artist.create({
            data: {
                userId: artist[0].id,
                bio: 'Professional makeup artist specializing in bridal and special event makeup. Over 8 years of experience creating stunning looks for weddings, photoshoots, and special occasions.',
                experienceYears: 8,
                location: 'New York, NY',
                availabilitySchedule: {
                    monday: { available: true, hours: '9:00-17:00' },
                    tuesday: { available: true, hours: '9:00-17:00' },
                    wednesday: { available: true, hours: '9:00-17:00' },
                    thursday: { available: true, hours: '9:00-17:00' },
                    friday: { available: true, hours: '9:00-17:00' },
                    saturday: { available: true, hours: '8:00-20:00' },
                    sunday: { available: false, hours: null },
                },
                rating: 4.9,
            },
        }),
        prisma.artist.create({
            data: {
                userId: artist[1].id,
                bio: 'Creative hair stylist with expertise in cutting, coloring, and styling. Passionate about helping clients express their personality through their hair.',
                experienceYears: 6,
                location: 'Los Angeles, CA',
                availabilitySchedule: {
                    monday: { available: false, hours: null },
                    tuesday: { available: true, hours: '10:00-18:00' },
                    wednesday: { available: true, hours: '10:00-18:00' },
                    thursday: { available: true, hours: '10:00-18:00' },
                    friday: { available: true, hours: '10:00-18:00' },
                    saturday: { available: true, hours: '9:00-19:00' },
                    sunday: { available: true, hours: '12:00-17:00' },
                },
                rating: 4.7,
            },
        }),
        prisma.artist.create({
            data: {
                userId: artist[2].id,
                bio: 'Certified nail technician offering manicures, pedicures, and nail art. Specializing in gel extensions and intricate nail designs.',
                experienceYears: 4,
                location: 'Chicago, IL',
                availabilitySchedule: {
                    monday: { available: true, hours: '9:00-16:00' },
                    tuesday: { available: true, hours: '9:00-16:00' },
                    wednesday: { available: true, hours: '9:00-16:00' },
                    thursday: { available: true, hours: '9:00-16:00' },
                    friday: { available: true, hours: '9:00-16:00' },
                    saturday: { available: true, hours: '10:00-18:00' },
                    sunday: { available: false, hours: null },
                },
                rating: 4.8,
            },
        }),
        prisma.artist.create({
            data: {
                userId: artist[3].id,
                bio: 'Professional photographer specializing in portraits, events, and commercial photography. Available for both studio and on-location shoots.',
                experienceYears: 10,
                location: 'Miami, FL',
                availabilitySchedule: {
                    monday: { available: true, hours: '8:00-18:00' },
                    tuesday: { available: true, hours: '8:00-18:00' },
                    wednesday: { available: true, hours: '8:00-18:00' },
                    thursday: { available: true, hours: '8:00-18:00' },
                    friday: { available: true, hours: '8:00-18:00' },
                    saturday: { available: true, hours: '9:00-21:00' },
                    sunday: { available: true, hours: '10:00-16:00' },
                },
                rating: 4.95,
            },
        }),
    ])
}
