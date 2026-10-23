'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyGalleryProps {
  images: { id: string; imageUrl: string; caption?: string | null }[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full rounded-2xl bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
        No images available
      </div>
    );
  }

  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3 select-none">
      {/* Main Large Image Display */}
      <div
        className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-lg"
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={currentImage.imageUrl}
          alt={currentImage.caption || `${title} - Image ${currentIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 800px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* View Fullscreen Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md transition-all shadow-md"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>View Fullscreen ({currentIndex + 1}/{images.length})</span>
        </button>
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, index) => (
            <button
              key={img.id || index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-sky-500 ring-2 ring-sky-500/20 scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-full">
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.caption || title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {currentImage.caption && (
              <p className="mt-3 text-center text-xs text-slate-300 font-medium">
                {currentImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
