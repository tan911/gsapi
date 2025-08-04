"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("../index"));
const client_1 = require("./client");
const artist_1 = require("./artist");
const artist_profile_1 = require("./artist-profile");
const artist_services_1 = require("./artist-services");
const booking_1 = require("./booking");
dotenv_1.default.config();
async function main() {
    // Clean existing data in correct order (respecting foreign key constraints)
    console.log('Cleaning existing data...');
    await index_1.default.booking.deleteMany();
    await index_1.default.service.deleteMany();
    await index_1.default.artist.deleteMany();
    await index_1.default.account.deleteMany();
    await index_1.default.session.deleteMany();
    await index_1.default.verification.deleteMany();
    await index_1.default.user.deleteMany();
    console.log('Cleanup completed!');
    const client = await (0, client_1.createClientUsers)();
    const artist = await (0, artist_1.createArtistUsers)();
    const artistProfiles = await (0, artist_profile_1.createArtistProfiles)(artist);
    const services = await (0, artist_services_1.createServices)(artistProfiles);
    const bookings = await (0, booking_1.createBookings)(client, artist, services);
    const accounts = await Promise.all([
        index_1.default.account.create({
            data: {
                userId: client[0].id,
                accountId: 'google_123456789',
                providerId: 'google',
                accessToken: 'mock_access_token_1',
                refreshToken: 'mock_refresh_token_1',
                scope: 'email profile',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }),
        index_1.default.account.create({
            data: {
                userId: artist[0].id,
                accountId: 'google_987654321',
                providerId: 'google',
                accessToken: 'mock_access_token_2',
                refreshToken: 'mock_refresh_token_2',
                scope: 'email profile',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }),
    ]);
    console.log('Seed completed successfully!');
    console.log(`Created ${client.length + artist.length} users`);
    console.log(`Created ${artist.length} artists`);
    console.log(`Created ${services.length} services`);
    console.log(`Created ${bookings.length} bookings`);
    console.log(`Created ${accounts.length} accounts`);
}
if (process.env.API_ENVIRONMENT === 'development') {
    console.log('seeding...');
    main()
        .then(async () => {
        await index_1.default.$disconnect();
    })
        .catch(async (e) => {
        console.log('prisma failed to seed: ', e);
        await index_1.default.$disconnect();
        process.exit(1);
    });
}
else {
    console.log('No seeding in production!');
}
