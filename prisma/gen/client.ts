import prisma from '../index'

export async function createClientUsers() {
    return await Promise.all([
        prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                role: 'CLIENT',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                role: 'CLIENT',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                name: 'Mike Johnson',
                email: 'mike.johnson@example.com',
                role: 'CLIENT',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }),
    ])
}
