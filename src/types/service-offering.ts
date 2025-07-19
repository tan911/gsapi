export type TGetServiceOffering = {
    params: {
        id: number
    }
}

export type TGetServiceOfferings = {
    query: {
        id: string
    }
}

export type TCreateServiceOffering = {
    body: {
        artistId: string
        name: string
        description: string
        price: number
        durationHours: number
        isActive: boolean
    }
}

export type TUpdateServiceOffering = {
    params: {
        id: number
    }
    body: {
        artistId: string
        name: string
        description: string
        price: number
        durationHours: number
        isActive: boolean
    }
}
