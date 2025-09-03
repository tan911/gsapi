import 'dotenv/config'
import express, { type Express } from 'express'
import { toNodeHandler } from 'better-auth/node'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import env from '@/config/env'
import logger from '@/config/logger'
import userRouter from '@/controllers/user'
import bookingRouter from '@/controllers/booking'
import calendarRouter from '@/controllers/calendar'
import blockedDatesRouter from '@/controllers/blocked-dates'
import serviceRouter from '@/controllers/service-offering'
import availabilityRouter from '@/controllers/availability'
import apiError from '@/middlewares/api-error'
import validateAuth from '@/middlewares/validate-auth'
import { auth } from '@/utils/auth'

const app: Express = express()

app.use(
    cors({
        origin: [env.API_FRONTEND_URL_LOCAL, env.API_FRONTEND_URL_PROD],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
)

// app health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' })
})

/**
 *
 * Auth must be placed before any middleware - https://www.better-auth.com/docs/integrations/express
 *
 */
app.all('/api/auth/{*any}', toNodeHandler(auth))

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },

        // Force client/browser to use HTTPS when in production
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport
        hsts:
            process.env.API_ENVIRONMENT === 'production'
                ? {
                      maxAge: 31536000, // 1 year
                      includeSubDomains: true,
                      preload: true,
                  }
                : false,

        hidePoweredBy: true,
        frameguard: { action: 'deny' },
        noSniff: true,
        referrerPolicy: { policy: 'no-referrer' },
    })
)

/**
 *  Disable x-powered-by header sent by exrpress same as hidePoweredBy in helmet
 *  https://expressjs.com/en/advanced/best-practice-security.html#at-a-gl
 */
app.disable('x-powered-by')

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

// all routes after this will be validated
app.use('/v1', validateAuth)

// private routes
app.use('/v1/users', userRouter)
app.use('/v1/bookings', bookingRouter)
app.use('/v1/services', serviceRouter)
app.use('/v1/availabilities', availabilityRouter)
app.use('/v1/calendar', calendarRouter)
app.use('/v1/blocked-dates', blockedDatesRouter)

// https://signatureapi.com/docs/api/errors
app.use(apiError)

export default app
