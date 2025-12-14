import Stripe from 'stripe'

export const stripe = new Stripe(
    useRuntimeConfig().stripeSecretKey,
    {
        apiVersion: '2025-11-17.clover',
        typescript: true
    }
)
