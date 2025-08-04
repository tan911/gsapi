export function parseTime(time?: string) {
    if (!time || typeof time !== 'string') return undefined

    const parts = time.split(':')

    if (parts.length !== 2) return undefined

    const [hours, minutes] = parts.map(Number)

    if (isNaN(hours) || isNaN(minutes)) return undefined

    return new Date(1970, 0, 1, hours, minutes)
}

export function parseDate(date?: string) {
    return date ? new Date(date) : undefined
}
