import { useState, useEffect } from 'react';
import { PaymentRecord } from '../types';
import { getPayments, markPaymentDelivered } from '../services/api';

export function usePayments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getPayments();
      setPayments(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des paiements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markDelivered = async (paymentId: string) => {
    try {
      await markPaymentDelivered(paymentId);
      setPayments(payments.map(payment =>
        payment.id === paymentId
          ? { ...payment, delivered: true }
          : payment
      ));
    } catch (err) {
      console.error('Error marking payment as delivered:', err);
      throw err;
    }
  };

  return {
    payments,
    loading,
    error,
    refreshPayments: fetchPayments,
    markDelivered
  };
}