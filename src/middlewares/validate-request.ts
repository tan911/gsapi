import type { Request, Response, NextFunction } from 'express'
import * as z from 'zod'
import 'express'

interface ValidationConfig {
    params?: z.ZodSchema
    query?: z.ZodSchema
    body?: z.ZodSchema
    transform?: (req: Request) => unknown
}

export function validateRequest(config: ValidationConfig) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated: { params?: unknown; query?: unknown; body?: unknown } = {}

            if (config.params) {
                const result = await config.params.safeParseAsync(req.params)

                if (!result.success) {
                    throw new z.ZodError(result.error.issues)
                }

                validated.params = result.data
            }

            if (config.query) {
                const queries: unknown = config.transform ? config.transform(req) : req.query
                const result = await config.query.safeParseAsync(queries)

                if (!result.success) {
                    throw new z.ZodError(result.error.issues)
                }

                validated.query = result.data
            }

            if (config.body) {
                const result = await config.body.safeParseAsync(req.body)

                if (!result.success) {
                    throw new z.ZodError(result.error.issues)
                }

                validated.body = result.data
            }

            req.validated = validated
            next()
        } catch (error) {
            next(error)
        }
    }
}

declare module 'express' {
    interface Request {
        validated?: {
            params?: unknown
            query?: unknown
            body?: unknown
        }
    }
}
