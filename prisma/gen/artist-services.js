"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServices = createServices;
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const index_1 = __importDefault(require("../index"));
async function createServices(artist) {
    return await Promise.all([
        index_1.default.service.create({
            data: {
                artistId: artist[0].id,
                name: 'Bridal Makeup',
                description: 'Complete bridal makeup including trial session, airbrush foundation, and long-lasting finish perfect for your special day.',
                price: 250.0,
                durationHours: 3,
                isActive: true,
            },
        }),
        index_1.default.service.create({
            data: {
                artistId: artist[0].id,
                name: 'Special Event Makeup',
                description: 'Professional makeup for parties, photoshoots, or special occasions. Includes consultation and touch-up kit.',
                price: 120.0,
                durationHours: 2,
                isActive: true,
            },
        }),
        index_1.default.service.create({
            data: {
                artistId: artist[1].id,
                name: 'Hair Cut & Style',
                description: 'Professional haircut with wash, cut, and styling. Includes consultation to find the perfect look for your face shape.',
                price: 80.0,
                durationHours: 1,
                isActive: true,
            },
        }),
        index_1.default.service.create({
            data: {
                artistId: artist[1].id,
                name: 'Hair Coloring',
                description: 'Professional hair coloring service including highlights, lowlights, or full color. Includes deep conditioning treatment.',
                price: 150.0,
                durationHours: 3,
                isActive: true,
            },
        }),
        index_1.default.service.create({
            data: {
                artistId: artist[2].id,
                name: 'Gel Manicure',
                description: 'Long-lasting gel manicure with nail shaping, cuticle care, and your choice of colors. Lasts up to 3 weeks.',
                price: 45.0,
                durationHours: 1,
                isActive: true,
            },
        }),
        index_1.default.service.create({
            data: {
                artistId: artist[2].id,
                name: 'Nail Art Design',
                description: 'Custom nail art designs including hand-painted details, gems, and creative patterns. Perfect for special occasions.',
                price: 75.0,
                durationHours: 2,
                isActive: true,
            },
        }),
        index_1.default.service.create({
            data: {
                artistId: artist[3].id,
                name: 'Portrait Session',
                description: 'Professional portrait photography session including 1-2 hours of shooting and 20 edited high-resolution images.',
                price: 200.0,
                durationHours: 2,
                isActive: true,
            },
        }),
        index_1.default.service.create({
            data: {
                artistId: artist[3].id,
                name: 'Event Photography',
                description: 'Complete event photography coverage including candid shots, group photos, and edited gallery delivery within 48 hours.',
                price: 500.0,
                durationHours: 4,
                isActive: true,
            },
        }),
    ]);
}
