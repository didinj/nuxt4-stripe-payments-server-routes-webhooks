import { stripe } from '../utils/stripe'
import type Stripe from 'stripe'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()

    const signature = getHeader(event, 'stripe-signature')
    if (!signature) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing Stripe signature'
        })
    }

    const body = await readRawBody(event)
    if (!body) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing request body'
        })
    }

    let stripeEvent: Stripe.Event

    try {
        stripeEvent = stripe.webhooks.constructEvent(
            body,
            signature,
            config.stripeWebhookSecret
        )
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid Stripe webhook signature'
        })
    }

    // Handle Stripe events
    switch (stripeEvent.type) {
        case 'checkout.session.completed': {
            const session = stripeEvent.data.object as Stripe.Checkout.Session
            console.log('✅ Checkout completed:', session.id)
            break
        }

        case 'payment_intent.succeeded': {
            const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
            console.log('💰 Payment succeeded:', paymentIntent.id)
            break
        }

        default:
            console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return { received: true }
})
