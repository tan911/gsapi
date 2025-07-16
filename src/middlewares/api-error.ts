import { Request, Response, NextFunction } from 'express'
import parseError from '@/utils/error'
import logger from '@/config/logger'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function apiError(err: unknown, req: Request, res: Response, _next: NextFunction) {
    const error = parseError(err)

    logger.error(`[application-error-handler] `, {
        type: req.method + req.url,
        ...error,
    })

    logger.debug(error)

    res.status(error.status).json(error)
}
