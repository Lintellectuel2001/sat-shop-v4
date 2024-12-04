import React, { useState } from 'react';
import { Check, X, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import { usePayments } from '../../hooks/usePayments';

interface PaymentTrackerProps {
  products: Product[];
  onMarkDelivered: (paymentId: string) => void;
}

export default function PaymentTracker({ products, onMarkDelivered }: PaymentTrackerProps) {
  const { payments, loading, error, markDelivered } = usePayments();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produit inconnu';
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'pending') return payment.status === 'pending';
    if (filter === 'completed') return payment.status === 'completed';
    return true;
  });

  const handleMarkDelivered = async (paymentId: string) => {
    try {
      await markDelivered(paymentId);
      onMarkDelivered(paymentId);
    } catch (err) {
      console.error('Failed to mark payment as delivered:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-zinc-800 rounded-lg p-6 flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-800 rounded-lg p-6">
        <div className="flex items-center justify-center text-red-500 space-x-2">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Suivi des Paiements</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all'
                ? 'bg-white text-black'
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'pending'
                ? 'bg-white text-black'
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'completed'
                ? 'bg-white text-black'
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
          >
            Complétés
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">Produit</th>
              <th className="text-left py-3 px-4">Client</th>
              <th className="text-left py-3 px-4">Montant</th>
              <th className="text-left py-3 px-4">Statut</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-zinc-700">
                <td className="py-3 px-4 font-mono text-sm">{payment.id}</td>
                <td className="py-3 px-4">{getProductName(payment.productId)}</td>
                <td className="py-3 px-4">{payment.customerEmail}</td>
                <td className="py-3 px-4">{payment.amount.toFixed(2)} DZD</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.status === 'completed'
                      ? 'bg-green-500/10 text-green-500'
                      : payment.status === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {payment.status === 'completed' ? (
                      <>
                        <Check size={12} className="mr-1" />
                        Payé
                      </>
                    ) : payment.status === 'pending' ? (
                      <>
                        <RefreshCw size={12} className="mr-1 animate-spin" />
                        En attente
                      </>
                    ) : (
                      <>
                        <X size={12} className="mr-1" />
                        Échoué
                      </>
                    )}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {formatDate(payment.completedAt || payment.createdAt)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end space-x-2">
                    {payment.status === 'completed' && !payment.delivered && (
                      <button
                        onClick={() => handleMarkDelivered(payment.id)}
                        className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        <Send size={16} className="mr-1" />
                        Marquer comme livré
                      </button>
                    )}
                    {payment.delivered && (
                      <span className="text-green-500 flex items-center">
                        <Check size={16} className="mr-1" />
                        Livré
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}