import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export default function Cart({ isOpen, setIsOpen, items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out z-50 shadow-xl`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Panier</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center mt-8">Votre panier est vide</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{item.product.price.toFixed(2)} DZD</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-l hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100 dark:bg-zinc-800">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-r hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-red-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <div className="flex justify-between mb-4">
            <span>Total</span>
            <span className="font-bold">{total.toFixed(2)} DZD</span>
          </div>
          {items.length > 0 && items.every(item => item.product.paymentLink) ? (
            items.map((item) => (
              <a
                key={item.product.id}
                href={item.product.paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors mb-2"
              >
                <span>Payer {item.product.name}</span>
                <ExternalLink size={18} className="ml-2" />
              </a>
            ))
          ) : (
            <p className="text-yellow-600 dark:text-yellow-500 text-center py-2">
              Certains produits n'ont pas de lien de paiement disponible. Veuillez contacter l'administrateur.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}