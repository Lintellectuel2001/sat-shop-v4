import React, { useState } from 'react';
import ProductEditor from './ProductEditor';
import ProductList from './ProductList';
import CarouselEditor from './CarouselEditor';
import CategoryEditor from './CategoryEditor';
import LogoEditor from './LogoEditor';
import PaymentTracker from './PaymentTracker';
import { Product, Slide, Category } from '../../types';
import { PlusCircle, SlidersHorizontal, Package, Image, Users, CreditCard } from 'lucide-react';

type AdminView = 'products' | 'carousel' | 'logo' | 'categories' | 'payments';

interface AdminPanelProps {
  products: Product[];
  slides: Slide[];
  categories: Category[];
  onUpdateProduct: (updatedProduct: Product) => void;
  onAddProduct: (newProduct: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateSlide: (updatedSlide: Slide) => void;
  onAddSlide: (newSlide: Slide) => void;
  onDeleteSlide: (slideId: number) => void;
  onUpdateCategory: (category: Category) => void;
  currentLogo: {
    icon: string;
    text: string;
    theme: 'gradient' | 'solid' | 'outline';
    textColor: string;
    gradientFrom: string;
    gradientTo: string;
  };
  onUpdateLogo: (newConfig: Partial<typeof currentLogo>) => void;
}

export default function AdminPanel({
  products,
  slides,
  categories,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateSlide,
  onAddSlide,
  onDeleteSlide,
  onUpdateCategory,
  currentLogo,
  onUpdateLogo
}: AdminPanelProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentView, setCurrentView] = useState<AdminView>('products');

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsCreating(true);
  };

  const handleSave = (product: Product) => {
    if (isCreating) {
      onAddProduct(product);
    } else {
      onUpdateProduct(product);
    }
    setSelectedProduct(null);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Panneau d'Administration</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('products')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                currentView === 'products'
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              <Package size={20} className="mr-2" />
              Produits
            </button>
            <button
              onClick={() => setCurrentView('categories')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                currentView === 'categories'
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              <Users size={20} className="mr-2" />
              Familles
            </button>
            <button
              onClick={() => setCurrentView('carousel')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                currentView === 'carousel'
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              <SlidersHorizontal size={20} className="mr-2" />
              Diaporama
            </button>
            <button
              onClick={() => setCurrentView('logo')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                currentView === 'logo'
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              <Image size={20} className="mr-2" />
              Logo
            </button>
            <button
              onClick={() => setCurrentView('payments')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                currentView === 'payments'
                  ? 'bg-white text-black'
                  : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              <CreditCard size={20} className="mr-2" />
              Paiements
            </button>
            {currentView === 'products' && (
              <button
                onClick={handleCreate}
                className="flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
              >
                <PlusCircle size={20} className="mr-2" />
                Nouveau Produit
              </button>
            )}
          </div>
        </div>

        {currentView === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Liste des Produits</h2>
              <ProductList
                products={products}
                onEdit={handleEdit}
                onDelete={onDeleteProduct}
              />
            </div>

            <div className="bg-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {isCreating ? 'Nouveau Produit' : 'Modifier le Produit'}
              </h2>
              <ProductEditor
                product={selectedProduct}
                products={products}
                onSave={handleSave}
                onCancel={() => {
                  setSelectedProduct(null);
                  setIsCreating(false);
                }}
                isCreating={isCreating}
              />
            </div>
          </div>
        )}

        {currentView === 'carousel' && (
          <CarouselEditor
            slides={slides}
            onUpdateSlide={onUpdateSlide}
            onAddSlide={onAddSlide}
            onDeleteSlide={onDeleteSlide}
          />
        )}

        {currentView === 'logo' && (
          <LogoEditor
            currentLogo={currentLogo}
            onUpdateLogo={onUpdateLogo}
          />
        )}

        {currentView === 'categories' && (
          <CategoryEditor
            categories={categories}
            onUpdateCategory={onUpdateCategory}
          />
        )}

        {currentView === 'payments' && (
          <PaymentTracker
            products={products}
            onMarkDelivered={(paymentId) => {
              console.log('Payment marked as delivered:', paymentId);
            }}
          />
        )}
      </div>
    </div>
  );
}