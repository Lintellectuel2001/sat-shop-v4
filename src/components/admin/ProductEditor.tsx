import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../types';
import { Upload } from 'lucide-react';

interface ProductEditorProps {
  product: Product | null;
  products: Product[];
  onSave: (product: Product) => void;
  onCancel: () => void;
  isCreating: boolean;
}

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'iptv', label: 'IPTV' },
  { value: 'vod', label: 'VOD' },
  { value: 'charing', label: 'CHARING' }
];

const DEFAULT_PRODUCT: Product = {
  id: 0,
  name: '',
  price: 0,
  image: '',
  category: 'iptv',
  description: '',
  paymentLink: ''
};

export default function ProductEditor({ product, products, onSave, onCancel, isCreating }: ProductEditorProps) {
  const [formData, setFormData] = useState<Product>(DEFAULT_PRODUCT);

  useEffect(() => {
    if (product && !isCreating) {
      setFormData(product);
    } else {
      const maxId = products.length > 0 
        ? Math.max(...products.map(p => p.id))
        : 0;
      setFormData({
        ...DEFAULT_PRODUCT,
        id: maxId + 1
      });
    }
  }, [product, isCreating, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  if (!isCreating && !product) {
    return (
      <div className="text-center text-gray-400 py-8">
        Sélectionnez un produit à modifier ou créez-en un nouveau
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nom du Produit</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Prix (DZD)</label>
        <input
          type="number"
          name="price"
          value={formData.price || 0}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Catégorie</label>
        <select
          name="category"
          value={formData.category || 'iptv'}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white capitalize"
          required
        >
          {CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Lien de Paiement</label>
        <input
          type="url"
          name="paymentLink"
          value={formData.paymentLink || ''}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image</label>
        <div
          className="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors border-zinc-700 hover:border-zinc-500"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 mb-3 text-zinc-400" />
            <p className="text-sm text-zinc-400">
              Glissez une image ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              PNG, JPG, GIF jusqu'à 10MB
            </p>
          </div>
        </div>
      </div>

      {formData.image && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden group">
          <img
            src={formData.image}
            alt="Aperçu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Supprimer l'image
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          {isCreating ? 'Créer' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}