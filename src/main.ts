import express, { type Express } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import compression from 'compression'
import env from '@/config/env'
import logger from '@/config/logger'
import bookingRouter from '@/controllers/booking'
import serviceRouter from '@/controllers/service-offering'
import apiError from '@/middlewares/api-error'

const app: Express = express()

const origin = [env.API_FRONTEND_URL_LOCAL, env.API_FRONTEND_URL_PROD]
const corsOptions = {
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.use(compression())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
    morgan(env.API_MORGAN_LOG, {
        stream: {
            write: (message: string) => {
                logger.http(message.trim())
            },
        },
    })
)

app.use('/v1/bookings', bookingRouter)
app.use('/v1/services', serviceRouter)

app.use('/ping', (req, res) => {
    res.json({ message: 'ping' })
})

// https://signatureapi.com/docs/api/errors
app.use(apiError)

export default app
