import axios from 'axios';
import { PaymentRecord } from '../types';

const api = axios.create({
  baseURL: '/api'
});

export const getPayments = async (): Promise<PaymentRecord[]> => {
  // Simuler une requête API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 'pay_123',
      productId: 1,
      amount: 4999.99,
      customerEmail: 'client@example.com',
      status: 'completed',
      createdAt: '2024-03-16T10:30:00Z',
      completedAt: '2024-03-16T10:35:00Z',
      delivered: false
    },
    {
      id: 'pay_124',
      productId: 2,
      amount: 2999.99,
      customerEmail: 'autre@example.com',
      status: 'pending',
      createdAt: '2024-03-16T11:00:00Z',
      delivered: false
    }
  ];
};

export const markPaymentDelivered = async (paymentId: string): Promise<void> => {
  // Simuler une requête API
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log(`Payment ${paymentId} marked as delivered`);
};