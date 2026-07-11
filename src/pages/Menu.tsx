import { useState, useMemo, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, Star, Sparkles, ReceiptText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import DishCard from "../components/DishCard";
import { getNumericPrice } from "../utils/menuHelpers";
import { menuData } from "../utils/menuData";

const categories = [
  "All",
  "SOUPS",
  "STARTERS",
  "SPL. STARTERS",
  "65' KI PASAND",
  "CURIES",
  "SPL. PANEER CURRIES",
  "SPL. VEG. CURRIES",
  "CHINESE",
  "SALAD",
  "DAL BAHAR",
  "KOFTA KI CURRIES",
  "CURRIES",
  "ROTI",
  "NAAN",
  "PARATHA in TANDOOR",
  "RICE",
  "FRIED RICE",
  "PULLAW",
  "BIRYANI",
  "PAPAD",
  "RAITA",
  "SOFT DRINKS",
  "JUMBO FAMILY PACK",
  "COMBO FAMILY PACK"
];

export default function Menu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"none" | "price-asc" | "price-desc" | "rating">("none");
  const [showChefSpecialsOnly, setShowChefSpecialsOnly] = useState(false);
  const [showHighRatingOnly, setShowHighRatingOnly] = useState(false);

  const categoryTabContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);
  const scrollTimeout = useRef<number | null>(null);

  // Filter and sort items (ignoring selectedCategory filter for unified display)
  const allFilteredDishes = useMemo(() => {
    let result = [...menuData];

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
      result.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, sortBy, showChefSpecialsOnly, showHighRatingOnly]);

  // Group dishes by category
  const groupedDishes = useMemo(() => {
    const groups: { [key: string]: typeof menuData } = {};
    allFilteredDishes.forEach((dish) => {
      if (!groups[dish.category]) {
        groups[dish.category] = [];
      }
      groups[dish.category].push(dish);
    });
    return groups;
  }, [allFilteredDishes]);

  // Handle Category click / smooth scroll
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    isScrollingProgrammatically.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const onScrollEnd = () => {
      isScrollingProgrammatically.current = false;
    };

    if (category === "All") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      scrollTimeout.current = window.setTimeout(onScrollEnd, 850);
    } else {
      const elementId = `category-section-${category.replace(/\s+/g, '-').replace(/'/g, '')}`;
      const element = document.getElementById(elementId);
      if (element) {
        const yOffset = -205; 
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        scrollTimeout.current = window.setTimeout(onScrollEnd, 850);
      } else {
        isScrollingProgrammatically.current = false;
      }
    }
  };

  // Scroll spy effect to highlight active category
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingProgrammatically.current) return;

      if (window.scrollY < 120) {
        setSelectedCategory("All");
        return;
      }

      let currentCategory = "All";
      const activeCategories = categories.filter((c) => c !== "All");

      for (const category of activeCategories) {
        const elementId = `category-section-${category.replace(/\s+/g, '-').replace(/'/g, '')}`;
        const element = document.getElementById(elementId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the category section is within view range
          if (rect.top <= 240) {
            currentCategory = category;
          }
        }
      }

      setSelectedCategory(currentCategory);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Center active category button in the horizontal scroll container
  useEffect(() => {
    const container = categoryTabContainerRef.current;
    if (!container) return;

    const activeButton = container.querySelector(`[data-category="${selectedCategory}"]`) as HTMLElement;
    if (activeButton) {
      const containerWidth = container.offsetWidth;
      const buttonOffsetLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;

      const scrollLeft = buttonOffsetLeft - containerWidth / 2 + buttonWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [selectedCategory]);

  // Handle direct scroll redirect to a specific item from URL params
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const itemId = params.get("item");
    if (itemId) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`dish-item-${itemId}`);
        if (element) {
          const yOffset = -225; // Align perfectly under the sticky category header
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });

          // Flash highlight ring around the selected item
          element.classList.add("ring-2", "ring-brand-accent", "ring-offset-2", "transition-all", "duration-1000");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-brand-accent", "ring-offset-2");
          }, 3000);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [location]);

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
        </div>

        {/* Sticky Categories Tab Bar */}
        <div
          className="sticky top-[70px] lg:top-[74px] z-30 bg-brand-bg/95 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 transition-all duration-300 mb-10"
        >
          <div
            ref={categoryTabContainerRef}
            className="flex overflow-x-auto pb-1 gap-2 scrollbar-thin scrollbar-thumb-brand-accent/60 scrollbar-track-transparent max-w-7xl mx-auto"
          >
            {categories.map((category) => (
              <button
                key={category}
                data-category={category}
                onClick={() => handleCategoryClick(category)}
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

        {/* Dish Categories Unified List Layout */}
        <div className="space-y-16">
          {categories.filter(c => c !== "All").map((category) => {
            const dishes = groupedDishes[category] || [];
            if (dishes.length === 0) return null; // Hide categories with no matches

            const elementId = `category-section-${category.replace(/\s+/g, '-').replace(/'/g, '')}`;

            return (
              <div key={category} id={elementId} className="scroll-mt-[205px]">
                {/* Category Heading */}
                <div className="border-b border-brand-gold/25 pb-3 mb-8 flex justify-between items-end">
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-dark tracking-tight">
                    {category}
                  </h2>
                  <span className="text-xs font-bold text-brand-gold bg-brand-gold/15 border border-brand-gold/20 px-3 py-1 rounded-full uppercase tracking-wider">
                    {dishes.length} {dishes.length === 1 ? "Dish" : "Dishes"}
                  </span>
                </div>

                {/* Dish Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dishes.map((dish) => (
                    <div 
                      key={dish.id} 
                      id={`dish-item-${dish.id}`} 
                      className="scroll-mt-[225px] rounded-2xl transition-all duration-300"
                    >
                      <DishCard dish={dish} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Fallback for when absolutely no dishes are found in any category */}
          {allFilteredDishes.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-brand-bg rounded-3xl border border-brand-gold/15 shadow-sm p-8"
            >
              <h3 className="font-display font-extrabold text-xl text-brand-dark mb-2">No Culinary Matches Found</h3>
              <p className="text-xs text-brand-dark/65 max-w-sm mx-auto">
                We couldn't find any dishes fitting your search parameters. Try clearing your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
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
        </div>
      </div>
    </div>
  );
}
