import type { Request } from 'express'

export function getValidated<T>(req: Request): T {
    return req.validated as T
}
