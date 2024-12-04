import React, { useState } from 'react';
import { Product } from '../../types';
import { Pencil, Trash2, Link } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

const CATEGORY_LABELS = {
  iptv: 'IPTV',
  vod: 'VOD',
  charing: 'CHARING'
};

function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [copySuccess, setCopySuccess] = useState<number | null>(null);

  const copyToClipboard = async (product: Product) => {
    if (!product.paymentLink) return;

    try {
      await navigator.clipboard.writeText(product.paymentLink);
      setCopySuccess(product.id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-zinc-700">
            <th className="text-left py-3 px-4">Image</th>
            <th className="text-left py-3 px-4">Nom</th>
            <th className="text-left py-3 px-4">Prix</th>
            <th className="text-left py-3 px-4">Catégorie</th>
            <th className="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-zinc-700">
              <td className="py-3 px-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              </td>
              <td className="py-3 px-4">{product.name}</td>
              <td className="py-3 px-4">{product.price.toFixed(2)} DZD</td>
              <td className="py-3 px-4">{CATEGORY_LABELS[product.category]}</td>
              <td className="py-3 px-4">
                <div className="flex justify-end space-x-2">
                  {product.paymentLink && (
                    <button
                      onClick={() => copyToClipboard(product)}
                      className={`p-2 rounded-lg transition ${
                        copySuccess === product.id
                          ? 'bg-green-500/20 text-green-500'
                          : 'hover:bg-zinc-700 text-blue-400 hover:text-blue-300'
                      }`}
                      title="Copier le lien de paiement"
                    >
                      <Link size={18} />
                      {copySuccess === product.id && (
                        <span className="absolute bg-green-500 text-white text-xs px-2 py-1 rounded -mt-8 -ml-4">
                          Copié!
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(product)}
                    className="p-2 hover:bg-zinc-700 rounded-lg transition"
                    title="Modifier"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                        onDelete(product.id);
                      }
                    }}
                    className="p-2 hover:bg-zinc-700 rounded-lg transition text-red-400 hover:text-red-300"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;