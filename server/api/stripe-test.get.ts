import { stripe } from '../utils/stripe'

export default defineEventHandler(async () => {
    const products = await stripe.products.list({ limit: 1 })
    return { success: true, products }
})
