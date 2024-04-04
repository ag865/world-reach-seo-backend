import Website from '#models/Website'

export interface Cart {
  uuid: string
  website: Website
  customId?: string
  restrictedNiche?: 'Crypto' | 'Erotic' | 'Dating' | 'None'
  words?: number
  contentByMarketplace?: boolean
  price?: number
  contentPrice?: number
  totalPrice?: number
}

export interface CartObject {
  products: Cart[]
}
