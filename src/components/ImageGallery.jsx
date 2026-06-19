import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!lightbox) {
      timerRef.current = setInterval(() => {
        setActive(p => (p + 1) % Math.max(images.length, 1));
      }, 4000);
    }
    return () => clearInterval(timerRef.current);
  }, [images.length, lightbox]);

  const prev = () => setActive(p => (p - 1 + images.length) % images.length);
  const next = () => setActive(p => (p + 1) % images.length);

  if (!images.length) return (
    <div className="aspect-video bg-[#12121a] rounded-2xl flex items-center justify-center text-[#8888aa]">
      No preview available
    </div>
  );

  return (
    <>
      {/* Main viewer */}
      <div className="relative rounded-2xl overflow-hidden group">
        <div className="aspect-video bg-[#12121a] overflow-hidden cursor-zoom-in" onClick={() => setLightbox(true)}>
          <img
            src={images[active]}
            alt={`Preview ${active + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0a0a0f]/70 border border-[#2a2a3e] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#6c63ff]/20"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#0a0a0f]/70 border border-[#2a2a3e] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#6c63ff]/20"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all ${i === active ? 'w-6 bg-[#6c63ff]' : 'w-1.5 bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === active ? 'border-[#6c63ff]' : 'border-[#2a2a3e] opacity-60 hover:opacity-100'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
          <img
            src={images[active]}
            alt=""
            onClick={e => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
