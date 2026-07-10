import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock, Phone, MapPin, ShieldCheck, Flame, Leaf, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SteamEffect from "../components/SteamEffect";
import DishCard from "../components/DishCard";
import TestimonialCard, { type Testimonial } from "../components/TestimonialCard";
import { menuData } from "../utils/menuData";

const heroImages = [
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80", // Biryani
  "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80", // Paneer Tikka
  "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80"  // Naan
];

const testimonials: Testimonial[] = [
  {
    id: "rev-1",
    name: "Venkata Ratnam Rayala",
    role: "Local Guide • 1,288 reviews",
    avatar: "VR",
    rating: 5,
    quote: "Food was good (both quality and quantity wise) Family atmosphere and good staff. We ordered Paneer Chatpata, Butter Naan, Garlic Naan and Butter Roti from this place. Highly satisfied!",
    date: "8 months ago",
    source: "Google Reviews"
  },
  {
    id: "rev-2",
    name: "K Monesh Chary",
    role: "Local Guide",
    avatar: "KM",
    rating: 4,
    quote: "Nice restaurant with good ambience lighting need to bit more. Food was very tasty, and service is quick. Worth visiting with families.",
    date: "4 months ago",
    source: "Google Reviews"
  },
  {
    id: "rev-3",
    name: "Sai Kumar",
    role: "2 reviews • 9 photos",
    avatar: "SK",
    rating: 4,
    quote: "Ordered Paneer Biryani and Tandoori Roti. The quantity was massive and the taste was authentic. Great experience in Chinthal.",
    date: "4 months ago",
    source: "Google Reviews"
  },
  {
    id: "rev-4",
    name: "Jyothi Reddy",
    role: "Verified Customer",
    avatar: "JR",
    rating: 5,
    quote: "Excellent pure veg family dhaba on HMT road. Extremely hygienic and the staff is really humble. Highly recommended!",
    date: "2 months ago",
    source: "Swiggy"
  },
  {
    id: "rev-5",
    name: "Abhinav Rao",
    role: "Foodie Guide",
    avatar: "AR",
    rating: 5,
    quote: "The Gobi 65 and Chana Masala were spot on. Real clay oven tandoor roti taste, which is hard to find in local restaurants here.",
    date: "1 month ago",
    source: "Zomato"
  },
  {
    id: "rev-6",
    name: "Priya Darshini",
    role: "Local Guide",
    avatar: "PD",
    rating: 4,
    quote: "Comforting food. The Sweet Tomato Soup and Sweet Lassi are a must-try. Safe and friendly environment for kids and elderly.",
    date: "3 weeks ago",
    source: "Google Reviews"
  }
];

export default function Home() {
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Testimonial | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const signatureDishes = menuData.filter((dish) => dish.isChefSpecial || dish.isPopular).slice(0, 4);

  return (
    <div className="relative pt-20">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-16 overflow-hidden bg-gradient-to-b from-brand-bg to-brand-bg/60">
        <SteamEffect count={10} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Typography */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-brand-accent/10 border border-brand-accent/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-accent">
                <Leaf size={14} className="fill-brand-accent" />
                <span>100% Pure Vegetarian Dhaba</span>
              </div>

              <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl text-brand-dark leading-[1.08] tracking-tight">
                Traditional Taste, <br />
                <span className="text-brand-accent">Family Love.</span>
              </h1>
              
              <p className="font-telugu text-brand-gold text-lg md:text-xl font-bold tracking-wide">
                శ్రీ కృష్ణ ఫ్యామిలీ ధాబ — రుచికరమైన శాకాహార భోజనం
              </p>

              <p className="text-base text-brand-dark/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Enjoy authentic clay tandoori rotis, rich paneer curries, and aromatic kaju biryanis in a warm and comfortable family atmosphere at Chinthal, Hyderabad.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  to="/menu"
                  className="bg-brand-accent hover:bg-brand-dark text-brand-bg font-bold tracking-wide py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase"
                >
                  <span>Explore Menu</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="glass-panel hover:bg-brand-dark hover:text-brand-bg text-brand-dark font-bold tracking-wide py-4 px-8 rounded-full shadow-md transition-all duration-300 flex items-center justify-center text-sm uppercase"
                >
                  Book a Table
                </Link>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-brand-dark/10 max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="block font-display font-black text-3xl text-brand-accent">3.9★</span>
                  <span className="text-xs text-brand-dark/65">327+ Google Reviews</span>
                </div>
                <div>
                  <span className="block font-display font-black text-3xl text-brand-dark">100%</span>
                  <span className="text-xs text-brand-dark/65">Pure Vegetarian</span>
                </div>
                <div>
                  <span className="block font-display font-black text-3xl text-brand-gold">22:00</span>
                  <span className="text-xs text-brand-dark/65">Late Dining till 11:45 PM</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Rotating Food Visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative flex justify-center items-center"
            >
              {/* Rotating Circular Border */}
              <div className="absolute w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full border border-dashed border-brand-accent/20 animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full border border-brand-gold/15 animate-[spin_40s_linear_infinite_reverse]" />

              {/* Main Image Container */}
              <div className="relative w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full overflow-hidden border-[8px] border-brand-bg shadow-2xl z-10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeHeroIdx}
                    src={heroImages[activeHeroIdx]}
                    alt="Featured Dhaba Dish"
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1, rotate: 10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: -10 }}
                    transition={{ duration: 0.8 }}
                  />
                </AnimatePresence>
              </div>

              {/* Small Decorative Floating Badges */}
              <div className="absolute top-8 right-8 z-20 bg-brand-bg/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg border border-brand-gold/20 animate-float-slow">
                <div className="flex items-center gap-1.5">
                  <Flame size={16} className="text-brand-accent fill-brand-accent" />
                  <span className="text-xs font-bold text-brand-dark">Clay Tandoor</span>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 z-20 bg-brand-bg/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg border border-brand-gold/20 animate-float-slow" style={{ animationDelay: "2s" }}>
                <span className="text-xs font-bold text-brand-accent">✨ Hyderabadi Biryani</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brand Value Section */}
      <section className="py-20 bg-brand-dark text-brand-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Why Diners Choose Us
            </h2>
            <p className="text-brand-bg/70 mt-3 text-sm">
              We focus on traditional methods, quality ingredients, and unmatched vegetarian taste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent mb-6">
                <Leaf size={28} className="fill-brand-accent" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">100% Pure Vegetarian</h3>
              <p className="text-sm text-brand-bg/70 leading-relaxed">
                A fully dedicated vegetarian kitchen ensuring strict safety, pure ingredients, and traditional Vedic food guidelines.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold mb-6">
                <Flame size={28} className="fill-brand-gold" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Traditional Clay oven (Tandoor)</h3>
              <p className="text-sm text-brand-bg/70 leading-relaxed">
                Our Naans and Rotis are baked fresh in a traditional earthen tandoor pot, infusing them with authentic smoky charcoal aromas.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-brand-olive/20 flex items-center justify-center text-brand-gold mb-6">
                <ShieldCheck size={28} className="text-brand-gold" />
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-3">Family-First Vibe</h3>
              <p className="text-sm text-brand-bg/70 leading-relaxed">
                A warm, safe environment with dedicated family rooms, cooperative staff, and generous portion sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Dishes Showcase */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-accent block mb-2">Our Masterpieces</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-dark tracking-tight">
                Chef's Recommended Signatures
              </h2>
            </div>
            <Link
              to="/menu"
              className="text-sm font-bold text-brand-accent hover:text-brand-dark flex items-center gap-1.5 mt-4 sm:mt-0 transition-colors duration-300 group"
            >
              <span>View Full Menu</span>
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {signatureDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Review Marquee */}
      <section className="py-24 bg-brand-bg/40 border-y border-brand-gold/15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-accent block mb-2">Diner Stories</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-dark tracking-tight">
            Hear From Our Guests
          </h2>
          <p className="text-brand-dark/70 text-sm mt-3">
            Click on any card to read their full detailed dining experience.
          </p>
        </div>

        {/* Row 1: Scrolling Left */}
        <div className="marquee-container flex gap-6 overflow-hidden mb-6 py-2 relative">
          <div className="marquee-content flex gap-6 animate-marquee-left shrink-0">
            {testimonials.concat(testimonials).map((t, idx) => (
              <TestimonialCard
                key={`row1-${t.id}-${idx}`}
                testimonial={t}
                onClick={() => setSelectedReview(t)}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="marquee-container flex gap-6 overflow-hidden py-2 relative">
          <div className="marquee-content flex gap-6 animate-marquee-right shrink-0">
            {testimonials.concat(testimonials).map((t, idx) => (
              <TestimonialCard
                key={`row2-${t.id}-${idx}`}
                testimonial={t}
                onClick={() => setSelectedReview(t)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Review Modal */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-brand-bg rounded-3xl p-8 shadow-2xl border border-brand-gold/25 z-10"
            >
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-dark/10 hover:bg-brand-accent hover:text-brand-bg flex items-center justify-center text-brand-dark transition-colors duration-300"
              >
                <X size={16} />
              </button>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-brand-accent/10 border border-brand-gold/20 flex items-center justify-center font-bold text-brand-accent font-display text-base">
                  {selectedReview.avatar}
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-brand-dark text-base">{selectedReview.name}</h3>
                  <p className="text-xs text-brand-dark/65">{selectedReview.role}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < selectedReview.rating
                          ? "text-brand-gold fill-brand-gold"
                          : "text-brand-dark/15"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {selectedReview.source}
                </span>
              </div>

              <p className="text-sm text-brand-dark/85 leading-relaxed italic font-sans mb-6">
                "{selectedReview.quote}"
              </p>

              <div className="text-xs text-brand-dark/50 border-t border-brand-dark/10 pt-4 flex justify-between">
                <span>Dined: {selectedReview.date}</span>
                <span>Verified Visitor</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info / Quick Details Section */}
      <section className="py-24 bg-brand-dark text-brand-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold block">Easy Access</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
                Locate Sri Krishna Dhaba
              </h2>
              <p className="text-brand-bg/75 text-sm leading-relaxed max-w-md">
                We are situated on the 2nd Floor, HMT Road in Chinthal, right above The Kakatiya Co-operative Bank, and next to Ridge Towers. Feel free to give us a call for table bookings or takeaway pickups.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Restaurant Address</h4>
                    <p className="text-xs text-brand-bg/65 mt-1 leading-normal">
                      2nd floor, HMT Rd, above The Kakatiya Bank, Chinthal, Quthbullapur, Hyderabad, Telangana 500037
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Call Direct</h4>
                    <a href="tel:+919032292421" className="text-brand-accent hover:text-white transition-colors duration-300 text-xs font-bold block mt-1">
                      +91 90322 92421
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-gold shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Dining Hours</h4>
                    <p className="text-xs text-brand-bg/65 mt-1">
                      11:30 AM – 11:45 PM (Open All Days)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Map Container */}
            <div className="h-[350px] bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
              {/* Custom styled vector maps graphics or detailed description */}
              <iframe
                title="Restaurant Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.301124844372!2d78.4485542!3d17.4931326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb910db054e0ad%3A0x6e289d0b6a6c23b2!2sSRI%20KRISHNA%20FAMILY%20DHABA!5e0!3m2!1sen!2sin!4v1704481029192!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale invert contrast-125 opacity-80"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4 bg-brand-dark/95 backdrop-blur border border-brand-gold/15 p-4 rounded-2xl max-w-xs shadow">
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-wider">Chinthal, Hyderabad</span>
                <p className="text-[11px] text-white mt-1">Convenient parking, drive-through & Dine-in. Above Kakatiya Co-operative Bank.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
