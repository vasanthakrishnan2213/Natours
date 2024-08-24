import axios from 'axios';
import { showAlert } from './alert';
import { loadStripe } from '@stripe/stripe-js';

async function initStripe() {
  try {
    const stripe = await loadStripe(
      'pk_test_51PlXE9FpAzxiFaJtzKplejMWRYNO3Zl2i0QgWGpvuFam1WVgQSzCjlggeHc4VcX78x65VK2JnrdFkFrRuE3nR1qN00s4LUV8pd',
    );
    return stripe;
  } catch (err) {
    showAlert('error', 'error')
    return null;
  }
}

export const bookTour = async (tourId) => {
  try {
    const stripe = await initStripe();

    const response = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    const sessionId = response.data.session?.id;
    const result = await stripe.redirectToCheckout({ sessionId });
    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (err) {
    showAlert('error', err.message || 'Booking failed');
  }
};
