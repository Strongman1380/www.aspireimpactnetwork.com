// Lightweight StripeService for front-end demo use
// Note: For live payments, replace createSubscription with a backend call.

class StripeService {
  constructor() {
    this.stripe = null;
    this.elements = null;
    this.cardElement = null;
    this.initialized = false;
  }

  async initialize(publishableKey) {
    if (typeof Stripe === 'undefined') {
      throw new Error('Stripe.js not loaded');
    }
    this.stripe = Stripe(publishableKey);
    this.elements = this.stripe.elements();
    this.initialized = true;
    return true;
  }

  createCardElement(containerId, options = {}) {
    if (!this.initialized) throw new Error('Stripe not initialized');
    const defaultOptions = {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': { color: '#aab7c4' },
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        invalid: { color: '#9e2146' },
      },
      hidePostalCode: false,
    };
    const cardOptions = { ...defaultOptions, ...options };
    this.cardElement = this.elements.create('card', cardOptions);
    this.cardElement.mount(`#${containerId}`);
    this.cardElement.on('change', (event) => {
      const errorEl = document.getElementById('card-errors');
      if (!errorEl) return;
      if (event.error) {
        errorEl.textContent = event.error.message;
        errorEl.style.display = 'block';
      } else {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    });
    return this.cardElement;
  }

  // Demo-only: mimic subscription creation. Replace with backend integration.
  async createSubscription(customerData, tier, billingCycle) {
    // Simulate async processing
    await new Promise((r) => setTimeout(r, 600));
    // Return mock IDs so the rest of the flow works
    const rand = Math.random().toString(36).slice(2, 10);
    return {
      success: true,
      customerId: `cus_${rand}`,
      subscriptionId: `sub_${rand}`,
      tier,
      billingCycle,
    };
  }
}

window.StripeService = StripeService;

