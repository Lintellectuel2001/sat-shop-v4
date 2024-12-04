import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[400px] object-cover transform group-hover:scale-105 transition duration-300"
        />
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-200"
        >
          Ajouter au Panier
        </button>
      </div>
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-400">{product.price.toFixed(2)} DZD</p>
    </div>
  );
}

export default ProductCard;