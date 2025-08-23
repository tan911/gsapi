import { ZodError } from 'zod'

// export interface IErrorResponse {
//     status: number
//     message: string
//     code?: string
//     errors?: string[]
//     requestId: string
// }

// export class AppError extends Error {
//     public status: number
//     public code?: string

//     constructor(message: string, status: number = 500, code?: string) {
//         super(message)
//         this.status = status
//         this.code = code
//     }
// }

function parseZodError(err: ZodError) {
    return {
        status: 422,
        code: err.issues[0]?.code,
        title: 'Validation Error',
        errors: err.issues[0]?.message,
    }
}

export default function parseError(err: unknown) {
    if (err instanceof ZodError) {
        return parseZodError(err)
    }

    return {
        status: 500,
        title: 'Error',
        detail: err,
    }
}
