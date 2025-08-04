import logger from '@/config/logger'
import env from '@/config/env'
import app from '@/main'

process.on('unhandledRejection', (error: unknown) => {
    logger.error('Unhandled Rejection:', error)
})

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error}`)
})

const server = app.listen(env.API_PORT, () => {
    logger.info(`Server running at \t\thttp://localhost:${env.API_PORT}`)
})

server.on('error', (error: unknown) => {
    console.error('App failed to start from server.ts', error)
})
