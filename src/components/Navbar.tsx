import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../utils/db";

const navLinks = [
  { name: "HOME", path: "/" },
  { name: "MENU", path: "/menu" },
  { name: "ABOUT", path: "/about" },
  { name: "GALLERY", path: "/gallery" },
  { name: "REVIEWS", path: "/reviews" },
  { name: "CONTACT", path: "/contact" }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [phone, setPhone] = useState("+91 90322 92421");
  const location = useLocation();

  useEffect(() => {
    db.init();
    const settings = db.getSettings();
    if (settings && settings.contactPhone) {
      setPhone(settings.contactPhone);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cleanPhone = phone.replace(/[^0-9+]/g, "");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "glass-panel py-3.5 shadow-md border-b border-brand-gold/15" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Circular Gold Seal Logo */}
              <div className="w-10 h-10 rounded-full bg-brand-dark border-2 border-brand-gold flex items-center justify-center shadow-md relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <svg className="w-8 h-8 text-brand-gold fill-brand-gold" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 3" />
                  <path d="M50 20 L55 33 L69 33 L58 41 L62 55 L50 47 L38 55 L42 41 L31 33 L45 33 Z" />
                  <text x="50" y="70" textAnchor="middle" fontSize="12" fontWeight="black" fill="#D4AF37" fontFamily="monospace" letterSpacing="1">SKD</text>
                  <text x="50" y="80" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#D4AF37" fontFamily="sans-serif">ESTD 1998</text>
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-display font-black text-sm sm:text-base tracking-wider text-brand-dark leading-tight uppercase group-hover:text-brand-accent transition-colors duration-300">
                  SRI KRISHNA FAMILY DHABA
                </span>
                <span className="font-telugu text-[9px] text-brand-accent font-semibold tracking-wider -mt-0.5">
                  శ్రీ కృష్ణ ఫ్యామిలీ ధాబ
                </span>
              </div>
            </Link>

            {/* Desktop Links (Centered Layout) */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative text-[11px] xl:text-xs font-bold tracking-widest transition-colors duration-300 py-1 ${
                      isActive 
                        ? "text-brand-gold" 
                        : "text-brand-dark/85 hover:text-brand-gold"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-[-6px] left-0 right-0 h-[2px] bg-brand-gold"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Buttons (Call Now, Book Table & Order Online) */}
            <div className="hidden md:flex items-center space-x-4 xl:space-x-5 shrink-0">
              {/* Call Now Outline Button */}
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-1.5 border border-brand-dark/40 hover:border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-bg text-[10px] xl:text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded-full transition-all duration-300 shadow-sm"
              >
                <Phone size={13} />
                <span>Call Now</span>
              </a>

              {/* Book Table Filled Button */}
              <Link
                to="/book-table"
                className="flex items-center gap-1.5 bg-brand-accent hover:bg-brand-dark text-brand-bg hover:text-brand-bg text-[10px] xl:text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded-full transition-all duration-300 shadow-md border border-brand-accent/10"
              >
                <span>Book Table</span>
              </Link>

              {/* Order Online Filled Button */}
              <Link
                to="/menu"
                className="flex items-center gap-1.5 bg-brand-gold hover:bg-brand-dark text-brand-dark hover:text-brand-bg text-[10px] xl:text-xs font-bold tracking-widest uppercase px-4 py-2.5 rounded-full transition-all duration-300 shadow-md border border-brand-gold/10"
              >
                <ShoppingBag size={13} />
                <span>Order Online</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-4">
              <a
                href={`tel:${cleanPhone}`}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-brand-accent/10 text-brand-accent hover:bg-brand-accent hover:text-brand-bg transition-colors"
                aria-label="Call Now"
              >
                <Phone size={14} />
              </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-brand-dark hover:text-brand-accent p-2 focus:outline-none transition-colors duration-300"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay (Full Screen) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 lg:hidden bg-brand-bg/98 backdrop-blur-lg flex flex-col justify-between py-6 px-6"
          >
            {/* Header Row in Overlay */}
            <div className="flex items-center justify-between pb-6 border-b border-brand-dark/10">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-dark border-2 border-brand-gold flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-brand-gold fill-brand-gold" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3 3" />
                    <path d="M50 20 L55 33 L69 33 L58 41 L62 55 L50 47 L38 55 L42 41 L31 33 L45 33 Z" />
                    <text x="50" y="70" textAnchor="middle" fontSize="12" fontWeight="black" fill="#D4AF37" fontFamily="monospace" letterSpacing="1">SKD</text>
                    <text x="50" y="80" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#D4AF37" fontFamily="sans-serif">ESTD 1998</text>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-sm tracking-wider text-brand-dark uppercase">
                    SRI KRISHNA DHABA
                  </span>
                  <span className="font-telugu text-[9px] text-brand-accent font-semibold tracking-wider -mt-0.5">
                    శ్రీ కృష్ణ ఫ్యామిలీ ధాబ
                  </span>
                </div>
              </Link>

              {/* Close Icon button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-brand-dark/5 hover:bg-brand-accent hover:text-brand-bg flex items-center justify-center text-brand-dark transition-colors duration-300 focus:outline-none"
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Links Stack in Center */}
            <div className="flex-grow flex flex-col justify-center py-8 space-y-4">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block py-3 px-4 rounded-2xl text-lg font-black tracking-widest uppercase transition-all duration-300 text-center ${
                        isActive
                          ? "bg-brand-gold text-brand-dark shadow-md"
                          : "text-brand-dark hover:bg-brand-accent/5 hover:text-brand-accent"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Row inside overlay */}
            <div className="pt-6 border-t border-brand-dark/10 flex flex-col gap-3">
              <a
                href={`tel:${cleanPhone}`}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-brand-bg text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300"
              >
                <Phone size={15} />
                <span>Call Now</span>
              </a>
              <Link
                to="/book-table"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-brand-accent text-brand-bg text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-md border border-brand-accent/10"
              >
                <span>Book Table</span>
              </Link>
              <Link
                to="/menu"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-brand-gold text-brand-dark text-xs font-bold tracking-widest uppercase py-3.5 rounded-full transition-all duration-300 shadow-md"
              >
                <ShoppingBag size={15} />
                <span>Order Online</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
