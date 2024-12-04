import React, { useState } from 'react';
import { Category, ProductCategory } from '../../types';
import { Upload, Save, Trash2, PlusCircle } from 'lucide-react';

interface CategoryEditorProps {
  categories: Category[];
  onUpdateCategory: (category: Category) => void;
}

export default function CategoryEditor({ categories, onUpdateCategory }: CategoryEditorProps) {
  const [editingCategories, setEditingCategories] = useState<Category[]>(categories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleIconUpload = async (file: File, categoryId: string) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    try {
      const reader = new FileReader();
      const imageDataPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
      });
      reader.readAsDataURL(file);

      const imageData = await imageDataPromise;
      const updatedCategories = editingCategories.map(cat =>
        cat.id === categoryId ? { ...cat, icon: imageData } : cat
      );
      setEditingCategories(updatedCategories);
      const updatedCategory = updatedCategories.find(cat => cat.id === categoryId);
      if (updatedCategory) {
        onUpdateCategory(updatedCategory);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
      alert('Erreur lors du chargement de l\'image');
    }
  };

  const handleNameChange = (categoryId: string, newName: string) => {
    const updatedCategories = editingCategories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          name: newName,
          slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-') as ProductCategory
        };
      }
      return cat;
    });
    setEditingCategories(updatedCategories);
    const updatedCategory = updatedCategories.find(cat => cat.id === categoryId);
    if (updatedCategory) {
      onUpdateCategory(updatedCategory);
    }
  };

  const handleAddCategory = () => {
    const newId = (Math.max(...editingCategories.map(c => parseInt(c.id))) + 1).toString();
    const newCategory: Category = {
      id: newId,
      name: 'Nouvelle Famille',
      icon: '',
      slug: `famille-${newId}` as ProductCategory
    };
    const updatedCategories = [...editingCategories, newCategory];
    setEditingCategories(updatedCategories);
    setSelectedCategoryId(newId);
    onUpdateCategory(newCategory);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette famille ?')) {
      const updatedCategories = editingCategories.filter(c => c.id !== categoryId);
      setEditingCategories(updatedCategories);
      if (updatedCategories.length > 0) {
        onUpdateCategory(updatedCategories[0]);
      }
      setSelectedCategoryId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des Familles</h2>
        <button
          onClick={handleAddCategory}
          className="flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
        >
          <PlusCircle size={20} className="mr-2" />
          Nouvelle Famille
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editingCategories.map((category) => (
          <div
            key={category.id}
            className={`bg-zinc-800 rounded-lg p-6 ${
              selectedCategoryId === category.id ? 'ring-2 ring-white' : ''
            }`}
            onClick={() => setSelectedCategoryId(category.id)}
          >
            <div className="space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <div className={`w-full h-full rounded-lg overflow-hidden ${
                  !category.icon ? 'bg-zinc-700' : ''
                }`}>
                  {category.icon ? (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-zinc-400" />
                      <span className="text-xs text-zinc-400 mt-1">Logo</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleIconUpload(file, category.id);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleNameChange(category.id, e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg focus:outline-none focus:border-white text-center"
                  placeholder="Nom de la famille"
                />
                <p className="text-sm text-zinc-400 text-center">
                  Slug: {category.slug}
                </p>
              </div>

              <div className="flex justify-center space-x-2 pt-2">
                {!['1', '2', '3'].includes(category.id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}