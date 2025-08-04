"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientUsers = createClientUsers;
const index_1 = __importDefault(require("../index"));
async function createClientUsers() {
    return await Promise.all([
        index_1.default.user.create({
            data: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                role: 'client',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            },
        }),
        index_1.default.user.create({
            data: {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                role: 'client',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
            },
        }),
        index_1.default.user.create({
            data: {
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                role: 'client',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            },
        }),
    ]);
}
