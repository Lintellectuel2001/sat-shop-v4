import React, { useState } from 'react';
import { Slide } from '../../types';
import { PlusCircle, Trash2, Upload } from 'lucide-react';

interface CarouselEditorProps {
  slides: Slide[];
  onUpdateSlide: (slide: Slide) => void;
  onAddSlide: (slide: Slide) => void;
  onDeleteSlide: (slideId: number) => void;
}

function CarouselEditor({
  slides,
  onUpdateSlide,
  onAddSlide,
  onDeleteSlide
}: CarouselEditorProps) {
  const [dragActive, setDragActive] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);

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

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newSlide: Slide = {
        id: Date.now(),
        url: reader.result as string,
        title: '',
        description: ''
      };
      onAddSlide(newSlide);
      setEditingSlide(newSlide);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = (field: keyof Slide, value: string) => {
    if (editingSlide) {
      const updatedSlide = { ...editingSlide, [field]: value };
      onUpdateSlide(updatedSlide);
      setEditingSlide(updatedSlide);
    }
  };

  return (
    <div className="space-y-8">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-white bg-zinc-800' 
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
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center">
          <PlusCircle className="w-12 h-12 mb-3 text-zinc-400" />
          <p className="text-lg text-zinc-400">
            Ajouter une nouvelle diapositive
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            Glissez une image ici ou cliquez pour sélectionner
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`bg-zinc-800 rounded-lg overflow-hidden ${
              editingSlide?.id === slide.id ? 'ring-2 ring-white' : ''
            }`}
            onClick={() => setEditingSlide(slide)}
          >
            <div className="relative h-48">
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSlide(slide.id);
                  if (editingSlide?.id === slide.id) {
                    setEditingSlide(null);
                  }
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={slide.title}
                  onChange={(e) => handleUpdate('title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
                  placeholder="Titre de la diapositive"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={slide.description}
                  onChange={(e) => handleUpdate('description', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-white"
                  placeholder="Description de la diapositive"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarouselEditor;