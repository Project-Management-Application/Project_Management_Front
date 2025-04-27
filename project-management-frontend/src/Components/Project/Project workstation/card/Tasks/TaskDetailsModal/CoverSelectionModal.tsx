/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '../../../../../UI/Button';
import { getBackgroundImages } from '../../../../../../services/models-apis';
import { backgroundOptions } from '../../../../../../utils/backgroundColors';

interface CoverSelectionModalProps {
  onClose: () => void;
  onSave: (coverData: { image?: string; color?: string }) => void;
  currentCoverImage?: string;
  currentCoverColor?: string;
}

export const CoverSelectionModal: React.FC<CoverSelectionModalProps> = ({
  onClose,
  onSave,
  currentCoverImage,
  currentCoverColor,
}) => {
  const [activeTab, setActiveTab] = useState<'images' | 'colors'>('images');
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(currentCoverImage || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(currentCoverColor || null);
  const [loadingImages, setLoadingImages] = useState(true);

  // Fetch background images
  useEffect(() => {
    const fetchImages = async () => {
      setLoadingImages(true);
      try {
        const images = await getBackgroundImages();
        setBackgroundImages(images);
        if (!currentCoverImage && !currentCoverColor && images.length > 0) {
          setSelectedBackground(images[0]); // Default to first image if no cover is set
        }
      } catch (err) {
        console.error('Failed to load background images:', err);
      } finally {
        setLoadingImages(false);
      }
    };
    fetchImages();
  }, [currentCoverImage, currentCoverColor]);

  const handleSave = () => {
    onSave({
      image: selectedBackground || undefined,
      color: selectedColor || undefined,
    });
    onClose();
  };

  const handleRemoveCover = () => {
    setSelectedBackground(null);
    setSelectedColor(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-indigo-200">Select Cover</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-indigo-300"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Background
          </label>
          {/* Tabs */}
          <div className="flex w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`flex w-1/2 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm transition-all duration-300 ${
                activeTab === 'images'
                  ? 'bg-white text-blue-600 shadow-md dark:bg-gray-700 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-gray-700/50'
              }`}
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Images
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('colors')}
              className={`flex w-1/2 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm transition-all duration-300 ${
                activeTab === 'colors'
                  ? 'bg-white text-blue-600 shadow-md dark:bg-gray-700 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-white/50 dark:text-gray-400 dark:hover:bg-gray-700/50'
              }`}
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Colors
            </button>
          </div>

          {/* Background Options */}
          <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            {activeTab === 'images' && (
              <div className="space-y-4">
                {loadingImages ? (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-video animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    ))}
                  </div>
                ) : backgroundImages.length === 0 ? (
                  <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No background images available
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {backgroundImages.map((image, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedBackground(image);
                          setSelectedColor(null);
                        }}
                        className={`group relative aspect-video cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
                          selectedBackground === image
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Background ${index + 1}`}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {selectedBackground === image && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 transition-opacity duration-300">
                            <div className="rounded-full bg-blue-600 p-1 text-white">
                              <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="grid grid-cols-5 gap-3 sm:grid-cols-8">
                {backgroundOptions.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedBackground(null);
                    }}
                    className={`group aspect-square cursor-pointer rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                      selectedColor === color
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    style={{ background: color }}
                  >
                    {selectedColor === color && (
                      <div className="flex size-full items-center justify-center">
                        <div className="rounded-full bg-white p-1 text-blue-600 shadow-sm">
                          <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {(selectedBackground || selectedColor) && (
            <Button
              variant="ghost"
              onClick={handleRemoveCover}
              className="text-rose-500 hover:text-rose-400"
            >
              <Trash2 className="mr-2 size-4" />
              Remove Cover
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-slate-400 hover:text-indigo-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-500/30 text-indigo-200 hover:bg-indigo-500/40"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};