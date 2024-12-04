import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('live_pk_q7mEHL1axRyrA34wjlOkiHNE1QtVmBfyMtRm4HBk');

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function PaymentForm({ amount, onSuccess, onCancel }: PaymentFormProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Here you would typically create a payment intent on your server
      // and return the client secret
      
      // For demo purposes, we'll just simulate a successful payment
      setTimeout(() => {
        setProcessing(false);
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setProcessing(false);
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Paiement Sécurisé</h3>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Numéro de Carte
          </label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-white"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Date d'Expiration
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              CVC
            </label>
            <input
              type="text"
              placeholder="123"
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-white"
              required
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="font-bold">Total: {amount.toFixed(2)} DZD</span>
          <div className="space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
              disabled={processing}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              disabled={processing}
            >
              {processing ? 'Traitement...' : 'Payer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PaymentForm;