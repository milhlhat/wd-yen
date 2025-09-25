"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useScrollEffects } from "@/hooks/use-scroll-effects";

type PhotoItem =
  | string
  | {
      src: string;
      className?: string;
      style?: React.CSSProperties;
      alt?: string;
    };

interface PhotoAlbumProps {
  photos: PhotoItem[];
  autoSlideInterval?: number;
}

export default function PhotoAlbum({ 
  photos, 
  autoSlideInterval = 4000 
}: PhotoAlbumProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const albumSection = useScrollEffects({ threshold: 0.1 });

  const resolvePhoto = (item: PhotoItem) => {
    if (typeof item === "string") {
      return { src: item, className: "", style: undefined as React.CSSProperties | undefined, alt: undefined as string | undefined };
    }
    return {
      src: item.src,
      className: item.className ?? "",
      style: item.style,
      alt: item.alt,
    };
  };

  useEffect(() => {
    if (isUserInteracting) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [photos.length, autoSlideInterval, isUserInteracting]);

  // Enable keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setIsUserInteracting(true);
        setCurrentSlide((prev) => (prev + 1) % photos.length);
      } else if (event.key === "ArrowLeft") {
        setIsUserInteracting(true);
        setCurrentSlide(
          (prev) => (prev - 1 + photos.length) % photos.length
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photos.length]);

  const nextSlide = () => {
    setIsUserInteracting(true);
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  };

  const prevSlide = () => {
    setIsUserInteracting(true);
    setCurrentSlide(
      (prev) => (prev - 1 + photos.length) % photos.length
    );
  };

  return (
    <section ref={albumSection.elementRef} className="py-20 px-6 bg-white scroll-snap-start">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          albumSection.isVisible 
            ? "animate-fadeInUp opacity-100" 
            : "opacity-0 translate-y-8"
        }`}>
          <h2 className="text-4xl md:text-5xl font-eb-garamond text-gray-800 mb-4">
            ALBUM ẢNH
          </h2>
          <p className="text-lg font-quicksand text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Capturing the beautiful moments of our journey together
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {photos.map((photo, index) => {
                const resolved = resolvePhoto(photo);
                return (
                <div key={index} className="w-full flex-shrink-0">
                  <AspectRatio ratio={3 / 4}>
                    <img
                      src={resolved.src || "/placeholder.svg"}
                      alt={resolved.alt ?? `Wedding memory ${index + 1}`}
                      className={`w-full h-full object-cover ${resolved.className}`}
                      style={resolved.style}
                    />
                  </AspectRatio>
                </div>
              );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200/50 hover:bg-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200/50 hover:bg-white transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsUserInteracting(true);
                  setCurrentSlide(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-rose-500 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Album Layout */}
        <div className="hidden md:block relative">
          <div
            className="flex items-center justify-center gap-6 transition-transform duration-500 ease-out"
            key={`desktop-track-${currentSlide}`}
          >
            {/* Left Photo */}
            <div className="flex-shrink-0">
              {(() => {
                const leftPhoto = resolvePhoto(
                  photos[(currentSlide + photos.length - 1) % photos.length]
                );
                return (
                  <img
                    src={leftPhoto.src || "/placeholder.svg"}
                    alt={leftPhoto.alt ?? "Wedding memory"}
                    className={`w-80 h-96 object-cover rounded-2xl shadow-xl animate-fadeSwap ${leftPhoto.className}`}
                    style={leftPhoto.style}
                  />
                );
              })()}
            </div>

            {/* Center Main Photo */}
            <div className="flex-shrink-0">
              {(() => {
                const centerPhoto = resolvePhoto(photos[currentSlide]);
                return (
                  <img
                    src={centerPhoto.src || "/placeholder.svg"}
                    alt={centerPhoto.alt ?? "Main wedding portrait"}
                    className={`w-96 h-[500px] object-cover rounded-2xl shadow-2xl animate-fadeSwap ${centerPhoto.className}`}
                    style={centerPhoto.style}
                  />
                );
              })()}
            </div>

            {/* Right Photo */}
            <div className="flex-shrink-0">
              {(() => {
                const rightPhoto = resolvePhoto(
                  photos[(currentSlide + 1) % photos.length]
                );
                return (
                  <img
                    src={rightPhoto.src || "/placeholder.svg"}
                    alt={rightPhoto.alt ?? "Wedding memory"}
                    className={`w-80 h-96 object-cover rounded-2xl shadow-xl animate-fadeSwap ${rightPhoto.className}`}
                    style={rightPhoto.style}
                  />
                );
              })()}
            </div>
          </div>

          {/* Navigation Buttons for Desktop */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg border border-gray-200/50 hover:bg-white transition-all duration-300 hover:scale-110 z-20 cursor-pointer"
          >
            <ChevronLeft className="w-8 h-8 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg border border-gray-200/50 hover:bg-white transition-all duration-300 hover:scale-110 z-20 cursor-pointer"
          >
            <ChevronRight className="w-8 h-8 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
}
