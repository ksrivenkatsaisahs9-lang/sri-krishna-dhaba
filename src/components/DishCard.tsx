import { useState } from "react";
import { Star, X, Check, Heart, ShieldAlert, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Dish {
  id: string;
  title: string;
  teluguTitle: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  ingredients?: string[];
  allergens?: string[];
  prepTime?: string;
}

interface DishCardProps {
  dish: Dish;
}

export default function DishCard({ dish }: DishCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOrdered(true);
    setTimeout(() => setOrdered(false), 2000);
  };

  return (
    <>
      <motion.div
        layoutId={`card-container-${dish.id}`}
        onClick={() => setIsOpen(true)}
        className="glass-panel rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border border-brand-gold/15 group relative flex flex-col h-full"
        whileHover={{ y: -6 }}
      >
        {/* Popular / Chef Special Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {dish.isChefSpecial && (
            <span className="bg-brand-accent text-brand-bg text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow flex items-center gap-1">
              <Sparkles size={10} className="fill-brand-bg" />
              <span>Chef's Choice</span>
            </span>
          )}
          {dish.isPopular && (
            <span className="bg-brand-gold text-brand-dark text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md shadow">
              Popular
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-brand-bg/80 backdrop-blur-md flex items-center justify-center text-brand-accent hover:bg-brand-accent hover:text-brand-bg transition-all duration-300 shadow"
        >
          <Heart size={15} className={isLiked ? "fill-brand-accent text-brand-accent" : ""} />
        </button>

        {/* Card Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-brand-dark/10">
          <img
            src={dish.image}
            alt={dish.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Card Body */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-display font-bold text-lg text-brand-dark group-hover:text-brand-accent transition-colors duration-300">
                {dish.title}
              </h3>
              <p className="font-telugu text-xs text-brand-gold font-medium mt-0.5">
                {dish.teluguTitle}
              </p>
            </div>
            <div className="flex items-center space-x-1 bg-brand-bg px-2 py-0.5 rounded border border-brand-gold/10 text-xs text-brand-dark shrink-0">
              <Star size={12} className="fill-brand-gold text-brand-gold" />
              <span className="font-bold">{dish.rating}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-brand-dark/70 leading-relaxed mb-4 flex-grow">
            {dish.description}
          </p>

          {/* Footer / CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-brand-dark/5 mt-auto">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-brand-dark/50 block">Price</span>
              <span className="font-display font-extrabold text-brand-dark text-base">₹{dish.price}</span>
            </div>

            <button
              onClick={handleOrder}
              className="bg-brand-accent/90 hover:bg-brand-accent text-brand-bg text-xs font-bold px-4 py-2 rounded-full shadow transition-all duration-300 border border-transparent"
            >
              {ordered ? "Added!" : "Quick Add"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              layoutId={`card-container-${dish.id}`}
              className="relative w-full max-w-2xl bg-brand-bg rounded-3xl overflow-hidden shadow-2xl border border-brand-gold/20 z-10 flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Left Side: Large Image */}
              <div className="w-full md:w-1/2 relative min-h-[220px] md:min-h-full">
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-brand-dark/20" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-brand-gold/90 text-brand-dark text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {dish.category}
                  </span>
                  <h2 className="font-display font-extrabold text-2xl mt-2 leading-tight drop-shadow-md">
                    {dish.title}
                  </h2>
                  <p className="font-telugu text-sm text-brand-gold font-semibold mt-1 drop-shadow-sm">
                    {dish.teluguTitle}
                  </p>
                </div>
              </div>

              {/* Right Side: Info & Actions */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-dark/10 hover:bg-brand-accent hover:text-brand-bg flex items-center justify-center text-brand-dark transition-all duration-300 z-20"
                >
                  <X size={18} />
                </button>

                {/* Rating & Prep Time */}
                <div className="flex items-center gap-4 mb-4 text-xs font-semibold text-brand-dark/75">
                  <div className="flex items-center space-x-1 text-brand-gold">
                    <Star size={14} className="fill-brand-gold" />
                    <span className="font-bold text-brand-dark">{dish.rating} / 5.0</span>
                  </div>
                  {dish.prepTime && <span>• Prep: {dish.prepTime}</span>}
                  <span>• Vegetarian</span>
                </div>

                {/* Description */}
                <p className="text-sm text-brand-dark/80 leading-relaxed mb-6 font-sans">
                  {dish.description}
                </p>

                {/* Ingredients */}
                {dish.ingredients && dish.ingredients.length > 0 && (
                  <div className="mb-5">
                    <h4 className="text-xs uppercase tracking-wider text-brand-accent font-bold mb-2">Ingredients</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {dish.ingredients.map((ing) => (
                        <span key={ing} className="bg-brand-dark/5 text-brand-dark/80 text-xs px-2.5 py-1 rounded-lg">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Allergens warning */}
                {dish.allergens && dish.allergens.length > 0 && (
                  <div className="mb-6 bg-brand-accent/5 border border-brand-accent/15 p-3 rounded-xl flex gap-2 items-start">
                    <ShieldAlert size={16} className="text-brand-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-accent block">Allergen Info</span>
                      <p className="text-xs text-brand-dark/75">Contains: {dish.allergens.join(", ")}</p>
                    </div>
                  </div>
                )}

                {/* CTA Action */}
                <div className="mt-auto pt-6 border-t border-brand-dark/15 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-brand-dark/50 block">Special Price</span>
                    <span className="font-display font-extrabold text-2xl text-brand-dark">₹{dish.price}</span>
                  </div>

                  <button
                    onClick={() => {
                      setOrdered(true);
                      setTimeout(() => setOrdered(false), 2000);
                    }}
                    className="flex-1 bg-brand-accent hover:bg-brand-dark text-brand-bg font-bold text-sm tracking-wide py-3 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {ordered ? (
                      <>
                        <Check size={16} />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <span>Add to Order</span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
