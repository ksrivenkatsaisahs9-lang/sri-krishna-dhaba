import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Star, Sparkles, ReceiptText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DishCard from "../components/DishCard";
import { menuData } from "../utils/menuData";

const categories = [
  "All",
  "Soups",
  "Starters",
  "Special Starters",
  "65 Specials",
  "Veg Curries",
  "Rotis/Breads",
  "Biryanis",
  "Desserts",
  "Beverages"
];

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"none" | "price-asc" | "price-desc" | "rating">("none");
  const [showChefSpecialsOnly, setShowChefSpecialsOnly] = useState(false);
  const [showHighRatingOnly, setShowHighRatingOnly] = useState(false);

  // Filter and sort items
  const filteredDishes = useMemo(() => {
    let result = [...menuData];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((dish) => dish.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (dish) =>
          dish.title.toLowerCase().includes(q) ||
          dish.teluguTitle.includes(q) ||
          dish.description.toLowerCase().includes(q)
      );
    }

    // Filter by Chef Specials
    if (showChefSpecialsOnly) {
      result = result.filter((dish) => dish.isChefSpecial);
    }

    // Filter by High Rating (>= 4.5)
    if (showHighRatingOnly) {
      result = result.filter((dish) => dish.rating >= 4.5);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, showChefSpecialsOnly, showHighRatingOnly]);

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-brand-bg/30">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-brand-accent/15 border border-brand-accent/25 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brand-accent">
            <ReceiptText size={12} />
            <span>Sri Krishna Signature Menu</span>
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-brand-dark tracking-tight leading-none">
            Choose Your Flavour
          </h1>
          <p className="font-telugu text-brand-gold font-bold text-base sm:text-lg">
            తాజా మరియు రుచికరమైన శాకాహార వంటకాలు
          </p>
          <p className="text-xs sm:text-sm text-brand-dark/70 max-w-xl mx-auto leading-relaxed">
            From piping hot soups to smoking hot clay tandoori starters, authentic Hyderabadi veg and cashew biryanis. Pure taste that satisfies.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-brand-bg rounded-2xl p-4 shadow-sm border border-brand-gold/15">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" size={18} />
              <input
                type="text"
                placeholder="Search dish name, ingredients, telugu name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-bg/50 border border-brand-gold/15 focus:outline-none focus:border-brand-accent text-sm text-brand-dark transition-all duration-300"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 items-center justify-end w-full md:w-auto">
              {/* Sort Dropdown */}
              <div className="relative flex items-center bg-brand-bg/50 border border-brand-gold/15 rounded-xl px-3 py-1.5 text-xs text-brand-dark font-semibold">
                <SlidersHorizontal size={14} className="mr-2 text-brand-dark/65" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent border-none focus:outline-none cursor-pointer py-1"
                >
                  <option value="none">Sort By Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Popularity (Rating)</option>
                </select>
              </div>

              {/* Chef Special Toggle */}
              <button
                onClick={() => setShowChefSpecialsOnly(!showChefSpecialsOnly)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                  showChefSpecialsOnly
                    ? "bg-brand-accent text-brand-bg border-brand-accent shadow-sm"
                    : "bg-brand-bg/50 text-brand-dark/70 border-brand-gold/15 hover:border-brand-accent/40"
                }`}
              >
                <Sparkles size={12} className={showChefSpecialsOnly ? "fill-brand-bg" : ""} />
                <span>Chef Specials</span>
              </button>

              {/* High Rating Toggle */}
              <button
                onClick={() => setShowHighRatingOnly(!showHighRatingOnly)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                  showHighRatingOnly
                    ? "bg-brand-gold text-brand-dark border-brand-gold shadow-sm"
                    : "bg-brand-bg/50 text-brand-dark/70 border-brand-gold/15 hover:border-brand-accent/40"
                }`}
              >
                <Star size={12} className={showHighRatingOnly ? "fill-brand-dark" : ""} />
                <span>Top Rated (4.5★)</span>
              </button>
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex overflow-x-auto pb-3 gap-2 scrollbar-thin scrollbar-thumb-brand-accent/60 scrollbar-track-transparent">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-xs font-bold tracking-wide uppercase whitespace-nowrap transition-all duration-300 shadow-sm border ${
                  selectedCategory === category
                    ? "bg-brand-dark text-brand-bg border-brand-dark"
                    : "bg-brand-bg text-brand-dark hover:bg-brand-accent/10 border-brand-gold/15 hover:border-brand-accent/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Dish Grid Layout */}
        <AnimatePresence mode="wait">
          {filteredDishes.length > 0 ? (
            <motion.div
              key={`${selectedCategory}-${searchQuery}-${sortBy}-${showChefSpecialsOnly}-${showHighRatingOnly}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-brand-bg rounded-3xl border border-brand-gold/15 shadow-sm p-8"
            >
              <h3 className="font-display font-extrabold text-xl text-brand-dark mb-2">No Culinary Matches Found</h3>
              <p className="text-xs text-brand-dark/65 max-w-sm mx-auto">
                We couldn't find any dishes fitting your search parameters. Try choosing another category or clearing filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSortBy("none");
                  setShowChefSpecialsOnly(false);
                  setShowHighRatingOnly(false);
                }}
                className="mt-6 bg-brand-accent text-brand-bg text-xs font-bold px-6 py-2.5 rounded-full shadow hover:bg-brand-dark transition-colors duration-300"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
