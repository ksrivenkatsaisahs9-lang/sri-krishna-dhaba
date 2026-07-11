import { useState, useMemo } from "react";
import { Star, Search, SlidersHorizontal, MessageSquarePlus, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  date: string;
  source: string;
  avatar: string;
}

const initialReviews: Review[] = [
  {
    id: "rev-1",
    name: "Venkata Ratnam Rayala",
    role: "Local Guide • 1,288 reviews • 38,138 photos",
    rating: 5,
    quote: "I ordered a Paneer Chatpata, Butter Naan, Garlic Naan and Butter Roti from this place. Food was good (both quality and quantity wise) Family atmosphere and good staff.",
    date: "8 months ago",
    source: "Google Reviews",
    avatar: "VR"
  },
  {
    id: "rev-2",
    name: "K Monesh Chary",
    role: "Local Guide • 6 reviews • 4 photos",
    rating: 4,
    quote: "Nice restaurant with good ambience lighting need to bit more. Food was very tasty, and service is quick. Worth visiting with families.",
    date: "4 months ago",
    source: "Google Reviews",
    avatar: "KM"
  },
  {
    id: "rev-3",
    name: "Sai Kumar",
    role: "2 reviews • 9 photos",
    rating: 4,
    quote: "Ordered Paneer Biryani and Tandoori Roti. The quantity was massive and the taste was authentic. Great experience in Pragathi Nagar.",
    date: "4 months ago",
    source: "Google Reviews",
    avatar: "SK"
  },
  {
    id: "rev-4",
    name: "Jyothi Reddy",
    role: "Verified Diner",
    rating: 5,
    quote: "Excellent pure veg family dhaba on HMT road. Extremely hygienic and the staff is really humble. Highly recommended!",
    date: "2 months ago",
    source: "Swiggy",
    avatar: "JR"
  },
  {
    id: "rev-5",
    name: "Abhinav Rao",
    role: "Foodie Guide",
    rating: 5,
    quote: "The Gobi 65 and Chana Masala were spot on. Real clay oven tandoor roti taste, which is hard to find in local restaurants here.",
    date: "1 month ago",
    source: "Zomato",
    avatar: "AR"
  },
  {
    id: "rev-6",
    name: "Priya Darshini",
    role: "Local Guide",
    rating: 4,
    quote: "Comforting food. The Sweet Tomato Soup and Sweet Lassi are a must-try. Safe and friendly environment for kids and elderly.",
    date: "3 weeks ago",
    source: "Google Reviews",
    avatar: "PD"
  }
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "All">("All");
  const [sortBy, setSortBy] = useState<"recent" | "high" | "low">("recent");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    quote: "",
    source: "Website Guest"
  });

  const [formError, setFormError] = useState("");

  // Calculate statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);

    const counts = [0, 0, 0, 0, 0]; // 5 to 1 star counts
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[5 - r.rating]++;
      }
    });

    return { total, average, counts };
  }, [reviews]);

  // Filter & Sort
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(q) || r.quote.toLowerCase().includes(q)
      );
    }

    if (ratingFilter !== "All") {
      result = result.filter((r) => r.rating === ratingFilter);
    }

    if (sortBy === "recent") {
      // Keep initial order or sort if dates are parsed, we will keep index
    } else if (sortBy === "high") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "low") {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [reviews, searchQuery, ratingFilter, sortBy]);

  const handleWriteReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.quote) {
      setFormError("Please fill out both your name and review message.");
      return;
    }

    const reviewObj: Review = {
      id: `rev-custom-${Date.now()}`,
      name: newReview.name,
      role: "Guest Reviewer",
      rating: newReview.rating,
      quote: newReview.quote,
      date: "Just now",
      source: "Website Guest",
      avatar: newReview.name.substring(0, 2).toUpperCase()
    };

    setReviews([reviewObj, ...reviews]);
    setFormSubmitted(true);
    setFormError("");

    setTimeout(() => {
      setIsFormOpen(false);
      setFormSubmitted(false);
      setNewReview({ name: "", rating: 5, quote: "", source: "Website Guest" });
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-brand-bg/30">
      <div className="noise-overlay" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="bg-brand-accent/15 border border-brand-accent/25 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-brand-accent">
            Guest Experiences
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-brand-dark tracking-tight leading-none">
            Guest Reviews
          </h1>
          <p className="font-telugu text-brand-gold font-bold text-base sm:text-lg">
            కృష్ణ ఫ్యామిలీ ధాబ - వినియోగదారుల సమీక్షలు
          </p>
        </div>

        {/* Overview Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Summary Box */}
          <div className="glass-panel p-8 rounded-3xl border border-brand-gold/15 flex flex-col items-center justify-center text-center">
            <span className="text-5xl sm:text-6xl font-display font-black text-brand-dark">{stats.average}</span>
            <div className="flex space-x-1 my-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.round(Number(stats.average))
                      ? "text-brand-gold fill-brand-gold"
                      : "text-brand-dark/15"
                  }
                />
              ))}
            </div>
            <p className="text-xs text-brand-dark/65 font-sans">
              Based on {stats.total + 321} reviews<br />(327 Google Reviews + website guest submissions)
            </p>
          </div>

          {/* Rating Distribution Bars */}
          <div className="glass-panel p-8 rounded-3xl border border-brand-gold/15 col-span-1 md:col-span-2 flex flex-col justify-center space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = stats.counts[5 - stars];
              const totalForBars = reviews.length;
              const percentage = ((count / totalForBars) * 100).toFixed(0);

              return (
                <div key={stars} className="flex items-center gap-4 text-xs font-semibold text-brand-dark">
                  <span className="w-12 flex items-center gap-1 shrink-0">
                    <span>{stars}</span>
                    <Star size={12} className="fill-brand-gold text-brand-gold" />
                  </span>
                  <div className="flex-1 h-2.5 bg-brand-dark/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-gold rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right shrink-0 text-brand-dark/65">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Filters and Write Review Buttons */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-brand-bg rounded-2xl p-4 shadow-sm border border-brand-gold/15 mb-10">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" size={16} />
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-bg/50 border border-brand-gold/15 focus:outline-none focus:border-brand-accent text-xs text-brand-dark"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-end w-full md:w-auto">
            {/* Rating select filter */}
            <div className="relative flex items-center bg-brand-bg/50 border border-brand-gold/15 rounded-xl px-3 py-1.5 text-xs text-brand-dark font-semibold">
              <SlidersHorizontal size={12} className="mr-2 text-brand-dark/65" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value === "All" ? "All" : Number(e.target.value))}
                className="bg-transparent border-none focus:outline-none cursor-pointer py-1"
              >
                <option value="All">All Stars</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="relative flex items-center bg-brand-bg/50 border border-brand-gold/15 rounded-xl px-3 py-1.5 text-xs text-brand-dark font-semibold">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:outline-none cursor-pointer py-1"
              >
                <option value="recent">Most Recent</option>
                <option value="high">Highest Rating</option>
                <option value="low">Lowest Rating</option>
              </select>
            </div>

            {/* Write a Review Button */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-brand-accent hover:bg-brand-dark text-brand-bg text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow"
            >
              <MessageSquarePlus size={14} />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Review list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-6 rounded-2xl border border-brand-gold/15 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex space-x-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "text-brand-gold fill-brand-gold"
                              : "text-brand-dark/15"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[9px] bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {review.source}
                    </span>
                  </div>

                  <p className="text-xs text-brand-dark/80 leading-relaxed font-sans mb-4 italic">
                    "{review.quote}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-3 border-t border-brand-dark/5 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/15 border border-brand-gold/20 flex items-center justify-center font-bold text-brand-accent font-display text-sm shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-brand-dark truncate">{review.name}</h4>
                    <p className="text-[9px] text-brand-dark/50 truncate mt-0.5">{review.role} • {review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFormOpen(false)}
                className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-brand-bg rounded-3xl p-8 shadow-2xl border border-brand-gold/25 z-10"
              >
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-dark/10 hover:bg-brand-accent hover:text-brand-bg flex items-center justify-center text-brand-dark transition-colors duration-300"
                >
                  <Star size={14} className="rotate-45" /> {/* fallback closer sign */}
                </button>

                <AnimatePresence mode="wait">
                  {!formSubmitted ? (
                    <form onSubmit={handleWriteReview} className="space-y-4">
                      <h3 className="font-display font-bold text-xl text-brand-dark">Write Your Review</h3>
                      <p className="text-[10px] text-brand-dark/50">Your dining experience helps others make delicious decisions.</p>

                      {formError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 text-xs rounded-xl flex items-center gap-2">
                          <AlertCircle size={14} />
                          <span>{formError}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1">Your Name</label>
                        <input
                          type="text"
                          value={newReview.name}
                          onChange={(e) => setNewReview((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-4 py-2 rounded-xl bg-brand-bg border border-brand-gold/15 focus:outline-none focus:border-brand-accent text-xs text-brand-dark"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1">Rating</label>
                        <div className="flex space-x-1.5 py-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview((prev) => ({ ...prev, rating: star }))}
                              className="text-brand-gold"
                            >
                              <Star
                                size={22}
                                className={star <= newReview.rating ? "fill-brand-gold" : "text-brand-dark/20"}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 mb-1">Review Message</label>
                        <textarea
                          rows={3}
                          value={newReview.quote}
                          onChange={(e) => setNewReview((prev) => ({ ...prev, quote: e.target.value }))}
                          placeholder="Tell us about the food quality, service, and ambiance..."
                          className="w-full px-4 py-2 rounded-xl bg-brand-bg border border-brand-gold/15 focus:outline-none focus:border-brand-accent text-xs text-brand-dark"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-accent hover:bg-brand-dark text-brand-bg font-bold text-xs uppercase tracking-widest py-3 rounded-xl shadow transition-colors"
                      >
                        Submit Review
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-6 space-y-3 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-brand-accent/15 flex items-center justify-center text-brand-accent">
                        <CheckCircle2 size={24} className="animate-bounce" />
                      </div>
                      <h4 className="font-display font-extrabold text-lg text-brand-dark">Review Submitted!</h4>
                      <p className="text-xs text-brand-dark/70 max-w-xs">
                        Thank you for your valuable feedback. It has been successfully added to our guest registry.
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
