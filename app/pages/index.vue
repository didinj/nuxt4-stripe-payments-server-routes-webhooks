<script setup lang="ts">
const isLoading = ref(false)

const payWithStripe = async () => {
  try {
    isLoading.value = true

    const { url } = await $fetch<{ url: string }>('/api/create-checkout-session', {
      method: 'POST',
      body: {
        amount: 1000, // $10.00
        currency: 'usd'
      }
    })

    if (url) {
      window.location.href = url
    }
  } catch (error) {
    console.error('Stripe payment error:', error)
    alert('Payment failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="container">
    <h1>Nuxt 4 Stripe Payments</h1>
    <p>Secure Stripe Checkout using Server Routes</p>

    <button
      @click="payWithStripe"
      :disabled="isLoading"
      class="pay-button"
    >
      {{ isLoading ? 'Redirecting...' : 'Pay $10 with Stripe' }}
    </button>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.pay-button {
  padding: 12px 24px;
  font-size: 16px;
  background: #635bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.pay-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
