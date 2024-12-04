import axios from 'axios';

const CHARGILY_API_URL = 'https://pay.chargily.net/api/v2';
const API_KEY = 'live_sk_LJ95NlXukhXuRgZOrF69fby556Utiaw9bcXdlDLy';

interface ChargilyPayment {
  id: string;
  checkout_url: string;
  status: string;
  amount: number;
  client_name: string;
  client_email: string;
  created_at: string;
  metadata: Record<string, any>;
}

export const createPaymentLink = async (params: {
  amount: number;
  name: string;
  email: string;
  productId: number;
}): Promise<string> => {
  try {
    const response = await axios.post<ChargilyPayment>(
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
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    throw new Error('Impossible de créer le lien de paiement');
  }
};

export const getPaymentStatus = async (paymentId: string): Promise<ChargilyPayment> => {
  try {
    const response = await axios.get<ChargilyPayment>(
      `${CHARGILY_API_URL}/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    throw error;
  }
};