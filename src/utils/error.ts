import { ZodError } from 'zod'

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
