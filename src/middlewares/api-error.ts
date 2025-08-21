import { Request, Response, NextFunction } from 'express'
import parseError from '@/utils/error'
import logger from '@/config/logger'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function apiError(err: unknown, req: Request, res: Response, _next: NextFunction) {
    const error = parseError(err)

    logger.error(
        `[application-error-handler]: URL:${req.url} STATUS:${error.status} TITLE:${error.title}`
    )

    logger.debug(error)

    res.status(error.status).json(error)
}
