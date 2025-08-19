import { auth } from '@/utils/auth'
import { fromNodeHeaders } from 'better-auth/node'
import { NextFunction, Request, Response } from 'express'

export default async function validateAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        })

        if (!session) {
            return res.status(403).json({ status: 403, title: 'Unauthorized' })
        }

        next()
    } catch (err) {
        next(err)
    }
}
