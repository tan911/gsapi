import * as z from 'zod'

const envSchema = z.object({
    API_PORT: z.string().default('8080'),
    API_MORGAN_LOG: z.string().default(process.env.NODE_ENV ? 'dev' : 'combined'),
    API_ENVIRONMENT: z.string().default('development'),
    API_FRONTEND_URL_LOCAL: z.string().default('http://localhost:4000'),
    API_FRONTEND_URL_PROD: z.string().default('https://localhost:5000'),
})

const env = envSchema.parse(process.env)

export default env
