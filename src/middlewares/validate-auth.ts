import { auth } from '@/utils/auth'
import { fromNodeHeaders } from 'better-auth/node'
import { NextFunction, Request, Response } from 'express'

// Extend the Request interface to include user
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: {
                id: string
                email: string
                name: string
                role: string
                artistId?: string
            }
        }
    }
}

export default async function validateAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        })

        if (!session) {
            return res.status(403).json({ status: 403, title: 'Unauthorized' })
        }

        // Attach user data to request object
        req.user = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            artistId: (session.user as any).artistId, // From the auth hooks
        }

        next()
    } catch (err) {
        next(err)
    }
}
