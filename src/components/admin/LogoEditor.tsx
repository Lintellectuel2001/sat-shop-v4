import React, { useState } from 'react';
import { Upload, Save, Trash2 } from 'lucide-react';
import Logo from '../Logo';

interface LogoEditorProps {
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

export default function LogoEditor({ currentLogo, onUpdateLogo }: LogoEditorProps) {
  const [localLogo, setLocalLogo] = useState(currentLogo);
  const [hasChanges, setHasChanges] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const updateLocalLogo = (updates: Partial<typeof currentLogo>) => {
    setLocalLogo(prev => ({
      ...prev,
      ...updates
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onUpdateLogo(localLogo);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalLogo({
      icon: '',
      text: 'SAT-SHOP',
      theme: 'gradient',
      textColor: 'white',
      gradientFrom: 'white',
      gradientTo: 'red-500'
    });
    setHasChanges(true);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
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
      updateLocalLogo({ icon: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Aperçu du Logo</h2>
        <div className="bg-zinc-900 p-8 rounded-lg flex items-center justify-center">
          <Logo
            customIcon={localLogo.icon}
            text={localLogo.text}
            theme={localLogo.theme}
            textColor={localLogo.textColor}
            gradientFrom={localLogo.gradientFrom}
            gradientTo={localLogo.gradientTo}
          />
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Modifier le Logo</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Icône</label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-white bg-zinc-700' 
                  : 'border-zinc-700 hover:border-zinc-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
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
                <Upload className="w-12 h-12 mb-3 text-zinc-400" />
                <p className="text-lg text-zinc-400">
                  Télécharger une nouvelle icône
                </p>
                <p className="text-sm text-zinc-500 mt-2">
                  PNG, SVG, JPG (max. 2MB)
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Texte du Logo</label>
            <input
              type="text"
              value={localLogo.text}
              onChange={(e) => updateLocalLogo({ text: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Style du Texte</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateLocalLogo({ theme: 'gradient' })}
                className={`p-2 rounded-lg border ${
                  localLogo.theme === 'gradient'
                    ? 'border-white bg-zinc-700'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                Dégradé
              </button>
              <button
                onClick={() => updateLocalLogo({ theme: 'solid' })}
                className={`p-2 rounded-lg border ${
                  localLogo.theme === 'solid'
                    ? 'border-white bg-zinc-700'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                Solide
              </button>
              <button
                onClick={() => updateLocalLogo({ theme: 'outline' })}
                className={`p-2 rounded-lg border ${
                  localLogo.theme === 'outline'
                    ? 'border-white bg-zinc-700'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                Contour
              </button>
            </div>
          </div>

          {localLogo.theme === 'gradient' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Couleur de Départ</label>
                <select
                  value={localLogo.gradientFrom}
                  onChange={(e) => updateLocalLogo({ gradientFrom: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
                >
                  <option value="white">Blanc</option>
                  <option value="red-500">Rouge</option>
                  <option value="blue-500">Bleu</option>
                  <option value="green-500">Vert</option>
                  <option value="yellow-500">Jaune</option>
                  <option value="purple-500">Violet</option>
                  <option value="pink-500">Rose</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Couleur d'Arrivée</label>
                <select
                  value={localLogo.gradientTo}
                  onChange={(e) => updateLocalLogo({ gradientTo: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
                >
                  <option value="red-500">Rouge</option>
                  <option value="blue-500">Bleu</option>
                  <option value="green-500">Vert</option>
                  <option value="yellow-500">Jaune</option>
                  <option value="purple-500">Violet</option>
                  <option value="pink-500">Rose</option>
                  <option value="white">Blanc</option>
                </select>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">Couleur du Texte</label>
              <select
                value={localLogo.textColor}
                onChange={(e) => updateLocalLogo({ textColor: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
              >
                <option value="white">Blanc</option>
                <option value="red-500">Rouge</option>
                <option value="blue-500">Bleu</option>
                <option value="green-500">Vert</option>
                <option value="yellow-500">Jaune</option>
                <option value="purple-500">Violet</option>
                <option value="pink-500">Rose</option>
              </select>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition"
            >
              Réinitialiser
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition ${
                hasChanges
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Save size={20} />
              <span>Enregistrer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}