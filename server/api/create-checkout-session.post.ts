import { stripe } from '../utils/stripe'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { amount, currency = 'usd' } = body

    if (!amount) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Amount is required'
        })
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: 'Nuxt 4 Stripe Payment'
                    },
                    unit_amount: amount
                },
                quantity: 1
            }
        ],
        success_url: `${getRequestURL(event).origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getRequestURL(event).origin}/cancel`
    })

    return {
        url: session.url
    }
})
