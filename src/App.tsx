import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Settings } from 'lucide-react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import AdminPanel from './components/admin/AdminPanel';
import LoginModal from './components/admin/LoginModal';
import Logo from './components/Logo';
import Carousel from './components/Carousel';
import ThemeToggle from './components/ThemeToggle';
import { Product, ProductCategory, CartItem, Slide, Category } from './types';

interface LogoConfig {
  icon: string;
  text: string;
  theme: 'gradient' | 'solid' | 'outline';
  textColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [showAdminTooltip, setShowAdminTooltip] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    icon: '',
    text: 'SAT-SHOP',
    theme: 'gradient',
    textColor: 'white',
    gradientFrom: 'white',
    gradientTo: 'red-500'
  });

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'IPTV', slug: 'iptv', icon: '' },
    { id: '2', name: 'VOD', slug: 'vod', icon: '' },
    { id: '3', name: 'CHARING', slug: 'charing', icon: '' }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Abonnement IPTV Premium 12 Mois",
      price: 4999.99,
      image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800",
      category: "iptv",
      description: "Accédez à plus de 10000 chaînes TV en direct et en HD"
    },
    {
      id: 2,
      name: "Pack Charing Complet",
      price: 2999.99,
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
      category: "charing",
      description: "Solution complète de partage de contenu"
    }
  ]);

  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&q=80&w=1920",
      title: "Profitez du meilleur du divertissement",
      description: "Des milliers de chaînes TV et films à portée de main"
    }
  ]);

  const handleUpdateLogo = (newConfig: Partial<LogoConfig>) => {
    setLogoConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories(prevCategories => 
      prevCategories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  };

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeCartItem = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleUpdateSlide = (updatedSlide: Slide) => {
    setSlides(slides.map(s => 
      s.id === updatedSlide.id ? updatedSlide : s
    ));
  };

  const handleAddSlide = (newSlide: Slide) => {
    setSlides([...slides, newSlide]);
  };

  const handleDeleteSlide = (slideId: number) => {
    setSlides(slides.filter(s => s.id !== slideId));
  };

  const handleAdminLogin = (username: string, password: string) => {
    if (username === 'admin' && password === '852654') {
      setIsAdminMode(true);
      setShowLoginModal(false);
      setLoginError(undefined);
    } else {
      setLoginError('Identifiants incorrects');
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <nav className="fixed w-full z-50 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <Logo 
                  customIcon={logoConfig.icon}
                  text={logoConfig.text}
                  theme={logoConfig.theme}
                  textColor={logoConfig.textColor}
                  gradientFrom={logoConfig.gradientFrom}
                  gradientTo={logoConfig.gradientTo}
                />
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={`hover:text-gray-600 dark:hover:text-gray-300 transition ${!selectedCategory ? 'text-red-500' : ''}`}
                >
                  Tout
                </button>
                {categories.map(category => (
                  <button 
                    key={category.id}
                    onClick={() => setSelectedCategory(category.slug)}
                    className={`hover:text-gray-600 dark:hover:text-gray-300 transition ${selectedCategory === category.slug ? 'text-red-500' : ''}`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <ThemeToggle isDark={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
                <div className="relative">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    onMouseEnter={() => setShowAdminTooltip(true)}
                    onMouseLeave={() => setShowAdminTooltip(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-200"
                  >
                    <Settings size={24} />
                  </button>
                  {showAdminTooltip && (
                    <div className="absolute right-0 top-full mt-2 bg-gray-100 dark:bg-zinc-800 text-sm py-1 px-2 rounded whitespace-nowrap">
                      Panneau d'administration
                    </div>
                  )}
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
                  <Search size={24} />
                </button>
                <button 
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 relative"
                >
                  <ShoppingCart size={24} />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-16">
          <Carousel slides={slides} />
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8">
              {selectedCategory ? `Nos Services ${selectedCategory.toUpperCase()}` : 'Tous nos Services'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products
                .filter(p => !selectedCategory || p.category === selectedCategory)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))
              }
            </div>
          </div>
        </main>

        <Cart
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          items={cartItems}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeCartItem}
        />

        {showLoginModal && (
          <LoginModal
            onLogin={handleAdminLogin}
            onClose={() => {
              setShowLoginModal(false);
              setLoginError(undefined);
            }}
            error={loginError}
          />
        )}

        {isAdminMode && (
          <AdminPanel
            products={products}
            slides={slides}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateSlide={handleUpdateSlide}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            currentLogo={logoConfig}
            onUpdateLogo={handleUpdateLogo}
            categories={categories}
            onUpdateCategory={handleUpdateCategory}
          />
        )}
      </div>
    </div>
  );
}