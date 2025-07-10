import winston from 'winston'
import path from 'path'
import env from './env'

const logsDir = path.join(process.cwd(), 'logs')

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
)

const transports = [
    new winston.transports.Console({
        format: format,
    }),

    new winston.transports.File({
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),

    new winston.transports.File({
        filename: path.join(logsDir, 'combined.log'),
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
]

const logger = winston.createLogger({
    level: env.API_ENVIRONMENT === 'development' ? 'debug' : 'warn',
    format: format,
    transports,
})

export default logger
