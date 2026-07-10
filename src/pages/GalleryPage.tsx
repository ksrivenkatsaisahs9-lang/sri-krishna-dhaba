import { useState } from "react";
import { X, ZoomIn, ZoomOut, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryItem {
  id: string;
  url: string;
  category: "Dishes" | "Tandoor" | "Sweets" | "Ambience";
  title: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "g-1",
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80",
    category: "Dishes",
    title: "Paneer Biryani Dum Cooking"
  },
  {
    id: "g-2",
    url: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80",
    category: "Tandoor",
    title: "Sizzling Paneer Tikka Platter"
  },
  {
    id: "g-3",
    url: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80",
    category: "Tandoor",
    title: "Freshly Pulled Butter Naan"
  },
  {
    id: "g-4",
    url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    category: "Sweets",
    title: "Delicious Cardamom Gulab Jamun"
  },
  {
    id: "g-5",
    url: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop&q=80",
    category: "Dishes",
    title: "Spicy Veg Manchurian Balls"
  },
  {
    id: "g-6",
    url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80",
    category: "Dishes",
    title: "Classic Punjabi Chana Masala"
  },
  {
    id: "g-7",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
    category: "Ambience",
    title: "Cozy Family Seat Layout"
  },
  {
    id: "g-8",
    url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80",
    category: "Ambience",
    title: "Dhaba Style Warm Lighting"
  }
];

const categories = ["All", "Dishes", "Tandoor", "Sweets", "Ambience"];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [scale, setScale] = useState(1);

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  const handlePrev = () => {
    if (lightboxIdx === null) return;
    setScale(1);
    setLightboxIdx((prev) => (prev === 0 ? filteredItems.length - 1 : prev! - 1));
  };

  const handleNext = () => {
    if (lightboxIdx === null) return;
    setScale(1);
    setLightboxIdx((prev) => (prev === filteredItems.length - 1 ? 0 : prev! + 1));
  };

  const currentImage = lightboxIdx !== null ? filteredItems[lightboxIdx] : null;

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-brand-bg/30">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="bg-brand-accent/15 border border-brand-accent/25 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brand-accent">
            Visual feast
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-brand-dark tracking-tight leading-none">
            Food Gallery
          </h1>
          <p className="font-telugu text-brand-gold font-bold text-base sm:text-lg">
            కృష్ణ ఫ్యామిలీ ధాబ - ఆహార చిత్రాలు
          </p>
        </div>

        {/* Categories Selector */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 border ${
                (cat === "All" && selectedCategory === "All") || selectedCategory === cat
                  ? "bg-brand-dark text-brand-bg border-brand-dark"
                  : "bg-brand-bg text-brand-dark hover:bg-brand-accent/10 border-brand-gold/15 hover:border-brand-accent/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
        >
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              key={item.id}
              onClick={() => {
                setLightboxIdx(idx);
                setScale(1);
              }}
              className="break-inside-avoid relative rounded-2xl overflow-hidden cursor-pointer border border-brand-gold/15 shadow-sm group hover:shadow-lg hover:border-brand-accent/30 transition-all duration-300 bg-brand-bg/50"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full object-cover rounded-2xl group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-transparent to-brand-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block mb-1">
                  {item.category}
                </span>
                <h3 className="text-white font-display font-semibold text-sm leading-tight">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {currentImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxIdx(null)}
                className="absolute inset-0 bg-brand-dark/95 backdrop-blur-sm"
              />

              {/* Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-4xl w-full max-h-[90vh] z-10 flex flex-col justify-between items-center"
              >
                {/* Control Panel */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <button
                    onClick={() => setScale((prev) => Math.max(0.5, prev - 0.25))}
                    className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    onClick={() => setScale((prev) => Math.min(2.5, prev + 0.25))}
                    className="w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={() => setLightboxIdx(null)}
                    className="w-10 h-10 rounded-full bg-brand-accent text-brand-bg hover:bg-brand-dark flex items-center justify-center transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Left/Right controls */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors z-20"
                >
                  <ArrowLeft size={20} />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors z-20"
                >
                  <ArrowRight size={20} />
                </button>

                {/* Main image container */}
                <div className="w-full flex justify-center items-center overflow-hidden aspect-video rounded-3xl bg-brand-dark/40 shadow-2xl border border-white/10">
                  <motion.img
                    key={currentImage.id}
                    src={currentImage.url}
                    alt={currentImage.title}
                    className="max-h-[70vh] max-w-full object-contain transition-transform duration-300"
                    style={{ transform: `scale(${scale})` }}
                  />
                </div>

                {/* Title overlay */}
                <div className="text-center text-white mt-4 bg-brand-dark/80 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
                  <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider block">
                    {currentImage.category}
                  </span>
                  <p className="text-sm font-semibold mt-0.5">{currentImage.title}</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
