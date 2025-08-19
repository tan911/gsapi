import * as z from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
    API_PORT: z.coerce.number().default(8080),
    API_MORGAN_LOG: z
        .string()
        .default(process.env.API_ENVIRONMENT === 'development' ? 'dev' : 'combined'),
    API_ENVIRONMENT: z.string().default('development'),
    API_FRONTEND_URL_LOCAL: z.string().default('http://localhost:3000'),
    API_FRONTEND_URL_PROD: z.string().default('https://localhost:3000'),
})

const env = envSchema.parse(process.env)

export default env
