"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArtistUsers = createArtistUsers;
const index_1 = __importDefault(require("../index"));
async function createArtistUsers() {
    return await Promise.all([
        index_1.default.user.create({
            data: {
                name: 'Sarah Wilson',
                email: 'sarah.wilson@example.com',
                role: 'artist',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            },
        }),
        index_1.default.user.create({
            data: {
                name: 'David Brown',
                email: 'david.brown@example.com',
                role: 'artist',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            },
        }),
        index_1.default.user.create({
            data: {
                name: 'Emma Davis',
                email: 'emma.davis@example.com',
                role: 'artist',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
            },
        }),
        index_1.default.user.create({
            data: {
                name: 'Alex Rodriguez',
                email: 'alex.rodriguez@example.com',
                role: 'artist',
                image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400',
            },
        }),
    ]);
}
