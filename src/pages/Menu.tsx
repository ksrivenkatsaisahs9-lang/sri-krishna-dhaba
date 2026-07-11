import { useState, useMemo, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, Star, Sparkles, ShoppingCart, Trash2, X, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import DishCard from "../components/DishCard";
import type { Dish } from "../components/DishCard";
import { getNumericPrice } from "../utils/menuHelpers";
import { db } from "../utils/db";

const categories = [
  "All",
  "SOUPS",
  "STARTERS",
  "SPL. STARTERS",
  "65' KI PASAND",
  "CURRIES",
  "SPL. PANEER CURRIES",
  "SPL. VEG. CURRIES",
  "CHINESE",
  "SALAD",
  "DAL BAHAR",
  "KOFTA KI CURRIES",
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

interface CartItem {
  dish: Dish;
  quantity: number;
  instructions: string;
}

export default function Menu() {
  const [menuData, setMenuData] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"none" | "price-asc" | "price-desc" | "rating">("none");
  const [showChefSpecialsOnly, setShowChefSpecialsOnly] = useState(false);
  const [showHighRatingOnly, setShowHighRatingOnly] = useState(false);

  // Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<"Pickup" | "Delivery">("Pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const categoryTabContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingProgrammatically = useRef(false);
  const scrollTimeout = useRef<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Increment visits and load dynamic menu
    db.init();
    setMenuData(db.getMenu().filter((item: any) => !item.hidden));
  }, []);

  // Filter and sort items
  const allFilteredDishes = useMemo(() => {
    let result = [...menuData];

    // Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (dish) =>
          dish.title.toLowerCase().includes(q) ||
          dish.teluguTitle.toLowerCase().includes(q) ||
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
  }, [menuData, searchQuery, sortBy, showChefSpecialsOnly, showHighRatingOnly]);

  // Group dishes by category
  const groupedDishes = useMemo(() => {
    const groups: { [key: string]: Dish[] } = {};
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

    if (category === "All") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 500);
      return;
    }

    const id = `category-section-${category.replace(/\s+/g, '-').replace(/'/g, '')}`;
    const element = document.getElementById(id);
    if (element) {
      const offset = 210;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      // Clear lock once scroll completes
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = window.setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 850);
    }
  };

  // Scroll spy to highlight active category tab
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingProgrammatically.current) return;

      const scrollPosition = window.scrollY + 250;
      let active = "All";

      for (const category of categories) {
        if (category === "All") continue;
        const id = `category-section-${category.replace(/\s+/g, '-').replace(/'/g, '')}`;
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            active = category;
            break;
          }
        }
      }

      if (active !== selectedCategory) {
        setSelectedCategory(active);
        // Center the active tab button in viewport
        const activeTabEl = categoryTabContainerRef.current?.querySelector(`[data-category="${active}"]`);
        if (activeTabEl) {
          activeTabEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [selectedCategory]);

  // Deep-link scrolling check on mount
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const item = query.get("item");
    if (item && menuData.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`dish-item-${item}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.classList.add("ring-2", "ring-brand-accent", "ring-offset-4");
          setTimeout(() => {
            element.classList.remove("ring-2", "ring-brand-accent", "ring-offset-4");
          }, 3000);
        }
      }, 500);
    }
  }, [location, menuData]);

  // Cart Functions
  const handleAddToCart = (dish: Dish) => {
    if ((dish as any).outOfStock) return;
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.dish.id === dish.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [...prev, { dish, quantity: 1, instructions: "" }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (dishId: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.dish.id === dishId ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const updateInstructions = (dishId: string, note: string) => {
    setCart((prev) =>
      prev.map((item) => (item.dish.id === dishId ? { ...item, instructions: note } : item))
    );
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + getNumericPrice(item.dish.price) * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return cartTotal * 0.1; // 10% website booking/ordering promo discount
  }, [cartTotal]);

  const finalTotal = useMemo(() => {
    return cartTotal - discountAmount;
  }, [cartTotal, discountAmount]);

  const sendWhatsAppOrder = () => {
    if (cart.length === 0) return;
    if (!customerName || !customerPhone) {
      alert("Please fill in your Name and Contact Number.");
      return;
    }
    if (orderType === "Delivery" && !deliveryAddress) {
      alert("Please provide your Delivery Address.");
      return;
    }

    const settings = db.getSettings();
    const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, "");

    let message = `*SRI KRISHNA DHABA - NEW ORDER*\n`;
    message += `----------------------------------------\n`;
    message += `*Customer:* ${customerName}\n`;
    message += `*Mobile/WhatsApp:* ${customerPhone}\n`;
    message += `*Order Type:* ${orderType}\n\n`;
    message += `*Items Ordered:*\n`;

    cart.forEach((item, index) => {
      const itemPrice = getNumericPrice(item.dish.price);
      message += `${index + 1}. *${item.dish.title}* x ${item.quantity} (Rs. ${itemPrice * item.quantity})\n`;
      if (item.instructions) {
        message += `   _Note: ${item.instructions}_\n`;
      }
    });

    message += `\n----------------------------------------\n`;
    message += `*Subtotal:* Rs. ${cartTotal}\n`;
    message += `*Web Discount (10%):* -Rs. ${discountAmount.toFixed(0)}\n`;
    message += `*Grand Total:* Rs. ${finalTotal.toFixed(0)}\n`;
    message += `----------------------------------------\n`;

    if (orderType === "Delivery") {
      message += `*Delivery Address:* ${deliveryAddress}\n`;
    }
    if (specialNotes) {
      message += `*Special Instructions:* ${specialNotes}\n`;
    }

    message += `\nThank you!`;

    // Log dummy checkout to database for Customer metrics tracking
    db.addBooking({
      name: customerName,
      phone: customerPhone,
      whatsapp: customerPhone,
      guests: 1,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      occasion: "None",
      instructions: `WhatsApp Order (${orderType}): ${cart.map(c=>`${c.dish.title} x${c.quantity}`).join(", ")}`,
      status: "Completed",
      notes: `Total: Rs. ${finalTotal.toFixed(0)}`
    });

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    // Clear cart and close
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-brand-bg/30">
      <div className="noise-overlay" />

      {/* Cart Float Button */}
      {cart.length > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-brand-accent text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:bg-brand-dark transition-colors duration-300"
        >
          <ShoppingCart size={22} />
          <span className="bg-white text-brand-accent text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
          <span className="text-xs font-bold mr-1">Rs. {finalTotal.toFixed(0)}</span>
        </motion.button>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            {/* Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-brand-bg shadow-2xl z-50 flex flex-col h-full border-l border-brand-gold/20"
            >
              {/* Header */}
              <div className="p-6 border-b border-brand-gold/15 flex justify-between items-center bg-brand-dark text-brand-bg">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={20} className="text-brand-gold" />
                  <h3 className="font-display font-extrabold text-lg text-brand-gold uppercase tracking-wider">Your Order Cart</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-brand-bg/60 hover:text-brand-gold transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-grow overflow-y-auto p-6 space-y-5">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-brand-dark/50">
                    <ShoppingCart size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Your cart is empty.</p>
                    <button onClick={() => setIsCartOpen(false)} className="mt-4 text-xs font-bold text-brand-accent underline">
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.dish.id} className="bg-white rounded-2xl p-4 shadow-sm border border-brand-gold/10 relative">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-display font-bold text-sm text-brand-dark">{item.dish.title}</h4>
                              <p className="text-xs text-brand-accent font-bold mt-1">Rs. {getNumericPrice(item.dish.price)}</p>
                            </div>
                            <div className="flex items-center gap-2 border border-brand-gold/25 rounded-full p-1 bg-brand-bg/40">
                              <button onClick={() => updateQuantity(item.dish.id, -1)} className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-brand-dark hover:bg-brand-accent hover:text-white transition-colors">
                                <Minus size={10} />
                              </button>
                              <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.dish.id, 1)} className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-brand-dark hover:bg-brand-accent hover:text-white transition-colors">
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>

                          {/* Instructions input */}
                          <div className="mt-3">
                            <input
                              type="text"
                              placeholder="Cooking notes (e.g., make it spicy, no onion)..."
                              value={item.instructions}
                              onChange={(e) => updateInstructions(item.dish.id, e.target.value)}
                              className="w-full text-[11px] bg-brand-bg/50 border border-brand-gold/10 focus:border-brand-accent/50 focus:outline-none px-3 py-1.5 rounded-lg text-brand-dark"
                            />
                          </div>

                          <button onClick={() => updateQuantity(item.dish.id, -item.quantity)} className="absolute top-2 right-2 text-brand-dark/20 hover:text-rose-500 transition-colors p-1" title="Remove Item">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Order Details Form */}
                    <div className="pt-6 border-t border-brand-gold/15 space-y-4">
                      <h4 className="font-display font-bold text-sm text-brand-dark uppercase tracking-wider">Delivery Details</h4>

                      {/* Order Type Toggle */}
                      <div className="flex gap-2 bg-brand-bg/60 p-1.5 rounded-xl border border-brand-gold/10">
                        <button
                          type="button"
                          onClick={() => setOrderType("Pickup")}
                          className={`flex-grow py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                            orderType === "Pickup" ? "bg-brand-accent text-white shadow-sm" : "text-brand-dark/70 hover:text-brand-dark"
                          }`}
                        >
                          Self-Pickup
                        </button>
                        <button
                          type="button"
                          onClick={() => setOrderType("Delivery")}
                          className={`flex-grow py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                            orderType === "Delivery" ? "bg-brand-accent text-white shadow-sm" : "text-brand-dark/70 hover:text-brand-dark"
                          }`}
                        >
                          Home Delivery
                        </button>
                      </div>

                      {/* Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Your Name</label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark shadow-sm"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Contact Number</label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="Enter mobile number"
                            className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark shadow-sm"
                          />
                        </div>

                        {orderType === "Delivery" && (
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Delivery Address</label>
                            <textarea
                              rows={2}
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="House No, Landmark, Area details..."
                              className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark shadow-sm"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Order Notes (Optional)</label>
                          <input
                            type="text"
                            value={specialNotes}
                            onChange={(e) => setSpecialNotes(e.target.value)}
                            placeholder="Overall order instructions..."
                            className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Summary / Checkout button */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-brand-gold/15 bg-white space-y-4 shrink-0">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-brand-dark/75">
                      <span>Subtotal</span>
                      <span className="font-semibold">Rs. {cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Web Discount (10% Off)</span>
                      <span>-Rs. {discountAmount.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-brand-dark pt-2 border-t border-brand-dark/5">
                      <span>Grand Total</span>
                      <span className="text-brand-accent text-base">Rs. {finalTotal.toFixed(0)}</span>
                    </div>
                  </div>

                  <button
                    onClick={sendWhatsAppOrder}
                    className="w-full bg-brand-gold hover:bg-brand-dark text-brand-dark hover:text-brand-bg py-4 rounded-xl text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-md border border-brand-gold/10"
                  >
                    <span>Send Order via WhatsApp</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="bg-brand-accent/15 border border-brand-accent/25 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brand-accent">
            Aromatic Journeys
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-brand-dark tracking-tight leading-none">
            Culinary Menu
          </h1>
          <p className="font-telugu text-brand-gold font-bold text-base sm:text-lg">
            కృష్ణ ఫ్యామిలీ ధాబ - ఆహార పదార్థాల పట్టిక
          </p>
        </div>

        {/* Promo Banner - Exclusive Table Reservation */}
        <div className="mb-10 max-w-5xl mx-auto border-2 border-dashed border-brand-gold/30 bg-white/40 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black bg-brand-accent/10 border border-brand-accent/20 px-2 py-0.5 rounded text-brand-accent uppercase tracking-wider">
              Special Discount
            </span>
            <p className="text-sm font-display font-bold text-brand-dark mt-1.5">
              🎁 Reserve your table through our website and receive <strong className="text-brand-accent">10% OFF</strong> on your final dining bill.
            </p>
          </div>
          <button
            onClick={() => handleCategoryClick("All")}
            className="shrink-0 bg-brand-accent hover:bg-brand-dark text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-colors"
          >
            Order Now
          </button>
        </div>

        {/* Search & Filters */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 shadow-sm border border-brand-gold/10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/45" size={18} />
              <input
                type="text"
                placeholder="Search dishes (e.g. Paneer Biryani, Naan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-brand-bg/30 border border-brand-gold/15 focus:border-brand-accent/60 focus:outline-none pl-12 pr-4 py-3 rounded-2xl text-sm text-brand-dark shadow-inner transition-colors duration-300"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 relative">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full bg-brand-bg/30 border border-brand-gold/15 focus:border-brand-accent/60 focus:outline-none px-4 py-3 rounded-2xl text-xs font-bold text-brand-dark/80 appearance-none cursor-pointer"
              >
                <option value="none">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating: Highest First</option>
              </select>
              <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/45 pointer-events-none" size={14} />
            </div>

            {/* Filter Badges */}
            <div className="md:col-span-3 flex gap-2">
              <button
                onClick={() => setShowChefSpecialsOnly(!showChefSpecialsOnly)}
                className={`flex-grow flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 border ${
                  showChefSpecialsOnly
                    ? "bg-brand-accent text-white border-brand-accent shadow-sm"
                    : "bg-brand-bg/50 text-brand-dark/70 border-brand-gold/15 hover:border-brand-accent/40"
                }`}
              >
                <Sparkles size={11} className={showChefSpecialsOnly ? "fill-white" : ""} />
                <span>Chef Specials</span>
              </button>

              <button
                onClick={() => setShowHighRatingOnly(!showHighRatingOnly)}
                className={`flex-grow flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 border ${
                  showHighRatingOnly
                    ? "bg-brand-gold text-brand-dark border-brand-gold shadow-sm"
                    : "bg-brand-bg/50 text-brand-dark/70 border-brand-gold/15 hover:border-brand-accent/40"
                }`}
              >
                <Star size={11} className={showHighRatingOnly ? "fill-brand-dark" : ""} />
                <span>Top Rated</span>
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
            if (dishes.length === 0) return null;

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
                      <DishCard 
                        dish={dish} 
                        onClickOverride={(e) => {
                          e.stopPropagation();
                          handleAddToCart(dish);
                        }}
                      />
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
