import type { Request, Response, NextFunction } from 'express'
import * as z from 'zod'
import 'express'

interface ValidationConfig {
    params?: z.ZodSchema
    query?: z.ZodSchema
    body?: z.ZodSchema
    /**
     * When using this function, note that it can combine both query parameters and route parameters.
     * The usage should look like this:
     *
     * transforms: (req: Request) => ({
     *   id: Number(req.params.id),
     *   userId: req.query.id
     *  })
     */
    transform?: (req: Request) => unknown
}

export function validateRequest(config: ValidationConfig) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated: { params?: unknown; query?: unknown; body?: unknown } = {}

            if (config.params) {
                const params: unknown = config.transform ? config.transform(req) : req.params
                const result = await config.params.safeParseAsync(params)

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
