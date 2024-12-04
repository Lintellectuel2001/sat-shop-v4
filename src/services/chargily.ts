import axios from 'axios';

const CHARGILY_API_URL = 'https://pay.chargily.net/api/v2';
const API_KEY = 'live_sk_LJ95NlXukhXuRgZOrF69fby556Utiaw9bcXdlDLy';

interface CreatePaymentResponse {
  id: string;
  checkout_url: string;
  status: string;
}

export const createPayment = async (params: {
  amount: number;
  name: string;
  email: string;
  productId: number;
}): Promise<string> => {
  try {
    // Pour le développement, on simule une réponse de l'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockCheckoutUrl = `${window.location.origin}/checkout/${params.productId}?amount=${params.amount}`;
    return mockCheckoutUrl;

    /* Code pour la production:
    const response = await axios.post<CreatePaymentResponse>(
      `${CHARGILY_API_URL}/payments`,
      {
        amount: params.amount,
        currency: 'DZD',
        client_name: params.name,
        client_email: params.email,
        description: `Paiement pour ${params.name}`,
        webhook_url: `${window.location.origin}/api/webhooks/chargily`,
        back_url: `${window.location.origin}/payment/success`,
        metadata: {
          product_id: params.productId
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.checkout_url;
    */
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur lors de la création du paiement:', error.message);
      throw new Error(`Impossible de créer le lien de paiement: ${error.message}`);
    }
    throw new Error('Impossible de créer le lien de paiement');
  }
};

export const verifyPayment = async (paymentId: string): Promise<boolean> => {
  try {
    // Pour le développement, on simule une vérification réussie
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;

    /* Code pour la production:
    const response = await axios.get(`${CHARGILY_API_URL}/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    return response.data.status === 'paid';
    */
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erreur lors de la vérification du paiement:', error.message);
    }
    return false;
  }
};