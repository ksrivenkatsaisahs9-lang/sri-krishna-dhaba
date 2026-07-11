import { useState, useEffect, useMemo } from "react";
import { 
  LayoutDashboard, Menu as MenuIcon, Image as ImageIcon, Star, Mail, Settings as SettingsIcon, 
  LogOut, Check, X, Plus, Edit, Trash2, Calendar, ShieldAlert, Award, ChevronRight,
  CheckSquare, RefreshCw, Send, Lock
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { db } from "../utils/db";
import type { Booking, Review, GalleryItem, ContactInquiry, RestaurantSettings } from "../utils/db";
import type { Dish } from "../components/DishCard";

const categories = [
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

type AdminTab = "dashboard" | "bookings" | "menu" | "gallery" | "reviews" | "contacts" | "settings";

interface AdminUser {
  username: string;
  role: "Owner" | "Manager" | "Staff";
  name: string;
}

const defaultAdminUsers: AdminUser[] = [
  { username: "owner", role: "Owner", name: "Srinivas Rao (Owner)" },
  { username: "manager", role: "Manager", name: "Karthik Uppari (Manager)" },
  { username: "staff", role: "Staff", name: "Ramesh Kumar (Captain)" }
];

export default function AdminPortal() {
  // Auth State
  const [user, setUser] = useState<AdminUser | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Nav State
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Database States
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [menu, setMenu] = useState<Dish[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [contacts, setContacts] = useState<ContactInquiry[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  // Booking Filtering
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>("All");
  const [bookingSearchText, setBookingSearchText] = useState("");
  const [bookingFilterDate, setBookingFilterDate] = useState("");

  // Edit / Add Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingTableNum, setBookingTableNum] = useState("");

  // Menu Modals
  const [editingDish, setEditingDish] = useState<Partial<Dish> | null>(null);
  const [isDishAddMode, setIsDishAddMode] = useState(false);

  // Gallery Modal
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState<GalleryItem["category"]>("Dishes");

  // Load Data on login
  const loadData = () => {
    db.init();
    setBookings(db.getBookings().reverse()); // Show newest first
    setMenu(db.getMenu());
    setGallery(db.getGallery());
    setReviews(db.getReviews().reverse());
    setContacts(db.getContacts().reverse());
    setSettings(db.getSettings());
  };

  useEffect(() => {
    // Check if session exists in localStorage
    const savedUser = localStorage.getItem("skd_admin_session");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      loadData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const matched = defaultAdminUsers.find(
      (u) => u.username === usernameInput.toLowerCase()
    );

    if (!matched) {
      setAuthError("Invalid username.");
      return;
    }

    // Static passwords matching username + 123 for simplicity
    const validPassword = `${matched.username}123`;
    if (passwordInput !== validPassword) {
      setAuthError("Invalid password.");
      return;
    }

    setUser(matched);
    localStorage.setItem("skd_admin_session", JSON.stringify(matched));
    setUsernameInput("");
    setPasswordInput("");
    loadData();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("skd_admin_session");
  };

  // RBAC Helper
  const hasAccess = (tab: AdminTab) => {
    if (!user) return false;
    if (user.role === "Owner") return true;
    if (user.role === "Manager") {
      return tab !== "settings" && tab !== "gallery";
    }
    if (user.role === "Staff") {
      return tab === "dashboard" || tab === "bookings";
    }
    return false;
  };

  // Auto-adjust active tab if current user has no access
  useEffect(() => {
    if (user && !hasAccess(activeTab)) {
      setActiveTab("dashboard");
    }
  }, [user, activeTab]);

  // Analytics Computation
  const analytics = useMemo(() => {
    if (bookings.length === 0) return null;
    return db.getAnalytics();
  }, [bookings]);

  // Bookings List filter
  const filteredBookingsList = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = bookingFilterStatus === "All" || b.status === bookingFilterStatus;
      const matchSearch = 
        bookingSearchText.trim() === "" ||
        b.name.toLowerCase().includes(bookingSearchText.toLowerCase()) ||
        b.phone.includes(bookingSearchText) ||
        b.id.includes(bookingSearchText);
      const matchDate = bookingFilterDate === "" || b.date === bookingFilterDate;
      return matchStatus && matchSearch && matchDate;
    });
  }, [bookings, bookingFilterStatus, bookingSearchText, bookingFilterDate]);

  // Booking details actions
  const triggerBookingStatus = (id: string, status: Booking["status"]) => {
    db.updateBookingStatus(id, status, bookingNotes || undefined);
    if (bookingTableNum && status === "Approved") {
      db.updateBooking(id, { tableNumber: bookingTableNum });
    }
    loadData();
    setSelectedBooking(null);
    setBookingNotes("");
    setBookingTableNum("");
  };

  const sendWhatsAppNotification = (booking: Booking, approved: boolean) => {
    const cleanPhone = booking.whatsapp.replace(/[^0-9]/g, "");
    const text = db.formatBookingNotification(booking, false, approved, !approved);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  // Dish actions
  const saveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;

    if (isDishAddMode) {
      db.addDish(editingDish as Omit<Dish, "id">);
    } else if (editingDish.id) {
      db.updateDish(editingDish.id, editingDish);
    }

    loadData();
    setEditingDish(null);
    setIsDishAddMode(false);
  };

  const toggleDishStock = (dish: Dish) => {
    db.updateDish(dish.id, { outOfStock: !dish.outOfStock } as any);
    loadData();
  };

  const toggleDishHidden = (dish: Dish) => {
    db.updateDish(dish.id, { hidden: !dish.hidden } as any);
    loadData();
  };

  const deleteDishItem = (id: string) => {
    if (confirm("Are you sure you want to delete this dish?")) {
      db.deleteDish(id);
      loadData();
    }
  };

  // Gallery actions
  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryUrl) return;
    db.addImage({
      url: newGalleryUrl,
      title: newGalleryTitle || "New Image",
      category: newGalleryCategory
    });
    setNewGalleryUrl("");
    setNewGalleryTitle("");
    loadData();
  };

  const handleDeleteGallery = (id: string) => {
    if (confirm("Remove image from gallery?")) {
      db.deleteImage(id);
      loadData();
    }
  };

  // Reviews actions
  const moderateReview = (id: string, status: Review["status"]) => {
    db.updateReviewStatus(id, status);
    loadData();
  };

  const toggleReviewPin = (id: string, currentPin?: boolean) => {
    db.updateReviewStatus(id, "Approved", !currentPin);
    loadData();
  };

  const deleteReviewItem = (id: string) => {
    if (confirm("Delete this review permanently?")) {
      db.deleteReview(id);
      loadData();
    }
  };

  // Inquiry actions
  const resolveInquiry = (id: string) => {
    db.updateContactStatus(id, "Resolved");
    loadData();
  };

  const deleteInquiry = (id: string) => {
    if (confirm("Delete this inquiry record?")) {
      db.deleteContact(id);
      loadData();
    }
  };

  // Global settings update
  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    db.updateSettings(settings);
    loadData();
    alert("Restaurant settings updated successfully!");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center px-4 relative">
        <div className="noise-overlay opacity-5" />
        
        <div className="w-full max-w-md bg-brand-bg rounded-3xl p-8 border border-brand-gold/20 shadow-2xl relative">
          <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-brand-accent/40" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-brand-accent/40" />
          <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-brand-accent/40" />
          <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-brand-accent/40" />

          <div className="text-center mb-8 space-y-2">
            <div className="w-12 h-12 rounded-full bg-brand-dark border-2 border-brand-gold flex items-center justify-center mx-auto shadow-md">
              <Lock className="text-brand-gold" size={20} />
            </div>
            <h2 className="font-display font-black text-2xl text-brand-dark uppercase tracking-wider">SKD Admin Lock</h2>
            <p className="text-xs text-brand-dark/60">Enter your credentials to manage operations.</p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl mb-6 flex items-start gap-2">
              <ShieldAlert size={14} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-brand-dark/50 block mb-1">Username</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="e.g. owner, manager, staff"
                className="w-full bg-brand-bg border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark shadow-inner"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-brand-dark/50 block mb-1">Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="e.g. owner123"
                className="w-full bg-brand-bg border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark shadow-inner"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-accent hover:bg-brand-dark text-white hover:text-brand-gold py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-md"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-[10px] text-brand-dark/45 space-y-1 font-mono">
            <p>Demo Accounts:</p>
            <p>Owner: owner | owner123</p>
            <p>Manager: manager | manager123</p>
            <p>Staff: staff | staff123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg/20 flex relative">
      <div className="noise-overlay" />

      {/* Sidebar Navigation */}
      <aside 
        className={`w-64 bg-brand-dark text-brand-bg shrink-0 fixed top-0 bottom-0 left-0 z-40 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between py-6 px-6">
          <div className="space-y-8">
            {/* Brand Logo Header */}
            <div className="flex items-center gap-3 pb-6 border-b border-brand-bg/10">
              <div className="w-8 h-8 rounded-full bg-brand-bg border-2 border-brand-gold flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-brand-gold fill-brand-gold" viewBox="0 0 100 100">
                  <path d="M50 20 L55 33 L69 33 L58 41 L62 55 L50 47 L38 55 L42 41 L31 33 L45 33 Z" />
                </svg>
              </div>
              <div>
                <h4 className="font-display font-black text-xs uppercase tracking-widest text-brand-gold">SKD Manager</h4>
                <p className="text-[9px] text-brand-bg/50 uppercase tracking-wider -mt-0.5">{user.role} Dashboard</p>
              </div>
            </div>

            {/* Menu List */}
            <nav className="space-y-1.5">
              {hasAccess("dashboard") && (
                <button
                  onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "dashboard" ? "bg-brand-accent text-white shadow-md" : "text-brand-bg/70 hover:bg-white/5 hover:text-brand-gold"
                  }`}
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </button>
              )}

              {hasAccess("bookings") && (
                <button
                  onClick={() => { setActiveTab("bookings"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "bookings" ? "bg-brand-accent text-white shadow-md" : "text-brand-bg/70 hover:bg-white/5 hover:text-brand-gold"
                  }`}
                >
                  <Calendar size={16} />
                  <span>Reservations</span>
                </button>
              )}

              {hasAccess("menu") && (
                <button
                  onClick={() => { setActiveTab("menu"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "menu" ? "bg-brand-accent text-white shadow-md" : "text-brand-bg/70 hover:bg-white/5 hover:text-brand-gold"
                  }`}
                >
                  <MenuIcon size={16} />
                  <span>Menu Editor</span>
                </button>
              )}

              {hasAccess("gallery") && (
                <button
                  onClick={() => { setActiveTab("gallery"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "gallery" ? "bg-brand-accent text-white shadow-md" : "text-brand-bg/70 hover:bg-white/5 hover:text-brand-gold"
                  }`}
                >
                  <ImageIcon size={16} />
                  <span>Gallery</span>
                </button>
              )}

              {hasAccess("reviews") && (
                <button
                  onClick={() => { setActiveTab("reviews"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "reviews" ? "bg-brand-accent text-white shadow-md" : "text-brand-bg/70 hover:bg-white/5 hover:text-brand-gold"
                  }`}
                >
                  <Star size={16} />
                  <span>Reviews</span>
                </button>
              )}

              {hasAccess("contacts") && (
                <button
                  onClick={() => { setActiveTab("contacts"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "contacts" ? "bg-brand-accent text-white shadow-md" : "text-brand-bg/70 hover:bg-white/5 hover:text-brand-gold"
                  }`}
                >
                  <Mail size={16} />
                  <span>Enquiries</span>
                </button>
              )}

              {hasAccess("settings") && (
                <button
                  onClick={() => { setActiveTab("settings"); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeTab === "settings" ? "bg-brand-accent text-white shadow-md" : "text-brand-bg/70 hover:bg-white/5 hover:text-brand-gold"
                  }`}
                >
                  <SettingsIcon size={16} />
                  <span>Web Settings</span>
                </button>
              )}
            </nav>
          </div>

          {/* User profile & Logout */}
          <div className="space-y-4 pt-6 border-t border-brand-bg/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-bold text-xs">
                {user.username.substring(0,2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-brand-bg leading-none">{user.name}</p>
                <span className="text-[8px] text-brand-gold font-mono tracking-wider">{user.role} Account</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <LogOut size={12} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden bg-brand-dark text-brand-bg px-4 py-3 flex justify-between items-center z-30 shadow border-b border-brand-bg/10 shrink-0">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 text-brand-bg/85 hover:text-brand-gold"
            >
              <CheckSquare size={22} />
            </button>
            <span className="text-xs font-black uppercase tracking-wider text-brand-gold">SKD Admin</span>
          </div>
          <span className="text-[10px] font-bold text-brand-accent bg-brand-accent/15 px-3 py-1 rounded-full uppercase">
            {user.role}
          </span>
        </header>

        {/* Dashboard Pages */}
        <main className="flex-grow p-4 sm:p-8 overflow-x-hidden">
          <AnimatePresence mode="wait">
            {/* TAB: DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && analytics && (
              <div className="space-y-8">
                {/* Heading */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark uppercase">Dashboard Overview</h2>
                    <p className="text-xs text-brand-dark/50">Real-time booking conversion, customer loyalty, and statistics.</p>
                  </div>
                  <button onClick={loadData} className="p-2.5 bg-white rounded-xl border border-brand-gold/10 hover:border-brand-accent text-brand-dark hover:text-brand-accent transition-colors" title="Reload Stats">
                    <RefreshCw size={14} />
                  </button>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-3xl p-6 border border-brand-gold/10 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark/55">Today's Bookings</span>
                    <span className="text-3xl font-display font-black text-brand-dark">{analytics.todayBookings}</span>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-brand-gold/10 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark/55">Pending Actions</span>
                    <span className="text-3xl font-display font-black text-brand-accent">{analytics.pendingBookings}</span>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-brand-gold/10 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark/55">Total Customers</span>
                    <span className="text-3xl font-display font-black text-brand-dark">{analytics.totalCustomers}</span>
                  </div>
                  <div className="bg-white rounded-3xl p-6 border border-brand-gold/10 shadow-sm flex flex-col justify-between min-h-[120px]">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark/55">Repeat Diners</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-display font-black text-brand-dark">{analytics.returningCustomers}</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        {analytics.totalCustomers > 0 ? ((analytics.returningCustomers / analytics.totalCustomers) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid: Charts + Busiest Times */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Visual Chart - 2 cols */}
                  <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-brand-gold/10 shadow-sm">
                    <h3 className="font-display font-bold text-sm text-brand-dark uppercase tracking-wider mb-6">Reservation conversion rate</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-end text-xs">
                        <div>
                          <p className="text-brand-dark/55">Website Visits</p>
                          <p className="text-2xl font-display font-black mt-1 text-brand-dark">{analytics.visits}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-brand-dark/55">Total Bookings</p>
                          <p className="text-2xl font-display font-black mt-1 text-brand-accent">{bookings.length}</p>
                        </div>
                      </div>
                      {/* Bar indicator */}
                      <div className="h-4 bg-brand-bg rounded-full overflow-hidden border border-brand-gold/10 relative">
                        <div 
                          className="h-full bg-brand-accent"
                          style={{ width: `${Math.min(parseFloat(analytics.conversionRate) * 2, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-brand-dark/50">
                        <span>Conversion Efficiency: {analytics.conversionRate}%</span>
                        <span>Industry Avg: 4.8%</span>
                      </div>
                    </div>
                  </div>

                  {/* Busiest slots */}
                  <div className="bg-white rounded-3xl p-6 border border-brand-gold/10 shadow-sm space-y-4">
                    <h3 className="font-display font-bold text-sm text-brand-dark uppercase tracking-wider">Popular Dining Times</h3>
                    <div className="space-y-3">
                      {analytics.busiestHours.map((slot, idx) => (
                        <div key={slot.time} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-brand-bg border border-brand-gold/10 text-brand-dark font-black flex items-center justify-center text-[10px]">{idx + 1}</span>
                            <span className="font-bold text-brand-dark">{slot.time} {parseInt(slot.time) >= 12 ? "PM" : "AM"}</span>
                          </div>
                          <span className="font-semibold text-brand-dark/70 bg-brand-bg px-2.5 py-1 rounded">{slot.count} Bookings</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Bookings Queue */}
                <div className="bg-white rounded-3xl p-6 border border-brand-gold/10 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-brand-dark/5 mb-4">
                    <h3 className="font-display font-bold text-sm text-brand-dark uppercase tracking-wider">Recent Booking Stream</h3>
                    <button onClick={() => setActiveTab("bookings")} className="text-xs font-bold text-brand-accent hover:text-brand-dark transition-colors flex items-center gap-1">
                      <span>View All</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="divide-y divide-brand-dark/5">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b.id} className="py-3.5 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-brand-dark">{b.name} <span className="text-[10px] text-brand-dark/50 font-normal">({b.guests} Guests)</span></p>
                          <p className="text-[10px] text-brand-dark/55 mt-0.5">{b.date} at {b.time}</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                          b.status === "Pending" ? "bg-amber-100 text-amber-700" :
                          b.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                          b.status === "Completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RESERVATION MANAGEMENT */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div>
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark uppercase">Reservations Queue</h2>
                    <p className="text-xs text-brand-dark/50">Manage customer table requests, assign tables, and update statuses.</p>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="bg-white border border-brand-gold/10 p-5 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3 relative">
                    <input
                      type="text"
                      placeholder="Search by ID, name or phone..."
                      value={bookingSearchText}
                      onChange={(e) => setBookingSearchText(e.target.value)}
                      className="w-full bg-brand-bg/30 border border-brand-gold/15 focus:border-brand-accent/50 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark"
                    />
                  </div>

                  <div className="w-full md:w-1/4 relative">
                    <select
                      value={bookingFilterStatus}
                      onChange={(e) => setBookingFilterStatus(e.target.value)}
                      className="w-full bg-brand-bg/30 border border-brand-gold/15 focus:border-brand-accent/50 focus:outline-none px-4 py-2.5 rounded-xl text-xs font-bold text-brand-dark"
                    >
                      <option value="All">Filter: All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Arrived">Arrived</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="w-full md:w-1/4">
                    <input
                      type="date"
                      value={bookingFilterDate}
                      onChange={(e) => setBookingFilterDate(e.target.value)}
                      className="w-full bg-brand-bg/30 border border-brand-gold/15 focus:border-brand-accent/50 focus:outline-none px-4 py-2 rounded-xl text-xs font-bold text-brand-dark"
                    />
                  </div>

                  {bookingFilterDate && (
                    <button 
                      onClick={() => setBookingFilterDate("")} 
                      className="text-xs text-brand-accent hover:text-brand-dark transition-colors font-bold underline"
                    >
                      Clear Date
                    </button>
                  )}
                </div>

                {/* Bookings Table */}
                <div className="bg-white border border-brand-gold/10 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-brand-dark text-brand-bg uppercase text-[10px] tracking-wider border-b border-brand-gold/15">
                          <th className="py-4 px-6 font-bold">Booking ID</th>
                          <th className="py-4 px-6 font-bold">Customer</th>
                          <th className="py-4 px-6 font-bold">Party Size</th>
                          <th className="py-4 px-6 font-bold">Date & Time</th>
                          <th className="py-4 px-6 font-bold">Table</th>
                          <th className="py-4 px-6 font-bold">Status</th>
                          <th className="py-4 px-6 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-dark/5">
                        {filteredBookingsList.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-16 text-center text-brand-dark/50">
                              No matching reservations found.
                            </td>
                          </tr>
                        ) : (
                          filteredBookingsList.map((b) => (
                            <tr key={b.id} className="hover:bg-brand-bg/10 transition-colors">
                              <td className="py-4 px-6 font-mono font-bold text-brand-accent">{b.id}</td>
                              <td className="py-4 px-6">
                                <p className="font-bold text-brand-dark">{b.name}</p>
                                <p className="text-[10px] text-brand-dark/50 mt-0.5">{b.phone}</p>
                              </td>
                              <td className="py-4 px-6 font-semibold">{b.guests} Guests</td>
                              <td className="py-4 px-6">
                                <p className="font-medium text-brand-dark">{b.date}</p>
                                <p className="text-[10px] text-brand-dark/60 font-semibold">{b.time}</p>
                              </td>
                              <td className="py-4 px-6 font-bold text-brand-gold">
                                {b.tableNumber ? `Table ${b.tableNumber}` : "None"}
                              </td>
                              <td className="py-4 px-6">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                                  b.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                  b.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                                  b.status === "Arrived" ? "bg-teal-100 text-teal-700" :
                                  b.status === "Completed" ? "bg-blue-100 text-blue-700" :
                                  b.status === "Cancelled" ? "bg-gray-100 text-gray-700" : "bg-rose-100 text-rose-700"
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <button
                                  onClick={() => { setSelectedBooking(b); setBookingNotes(b.notes || ""); setBookingTableNum(b.tableNumber || ""); }}
                                  className="bg-brand-bg hover:bg-brand-accent text-brand-dark hover:text-white border border-brand-gold/15 px-3 py-1.5 rounded-lg font-bold hover:shadow-sm transition-all"
                                >
                                  Manage
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: MENU MANAGEMENT */}
            {activeTab === "menu" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark uppercase">Menu Manager</h2>
                    <p className="text-xs text-brand-dark/50">Add new items, change pricing, and mark items out of stock.</p>
                  </div>
                  <button 
                    onClick={() => { setIsDishAddMode(true); setEditingDish({ title: "", teluguTitle: "", description: "", category: "SOUPS", price: "", image: "", isChefSpecial: false, isPopular: false }); }}
                    className="flex items-center gap-1 bg-brand-accent hover:bg-brand-dark text-white hover:text-brand-gold px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow"
                  >
                    <Plus size={14} />
                    <span>Add Dish</span>
                  </button>
                </div>

                {/* Grid List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menu.map((dish) => (
                    <div key={dish.id} className="bg-white rounded-3xl p-5 border border-brand-gold/10 shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                      {dish.hidden && (
                        <div className="absolute top-2 right-2 bg-gray-500 text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded shadow">
                          Hidden
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-display font-bold text-sm text-brand-dark">{dish.title}</h4>
                            <p className="text-[10px] text-brand-dark/50 leading-none mt-0.5">{dish.category}</p>
                          </div>
                          <span className="text-xs text-brand-accent font-bold">Rs. {dish.price}</span>
                        </div>
                        <p className="text-[11px] text-brand-dark/65 leading-relaxed line-clamp-2">{dish.description}</p>
                      </div>

                      {/* Config buttons */}
                      <div className="pt-4 border-t border-brand-dark/5 mt-4 flex justify-between items-center gap-2">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => toggleDishStock(dish)}
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border transition-colors ${
                              dish.outOfStock
                                ? "bg-rose-100 text-rose-700 border-rose-300"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {dish.outOfStock ? "Out of Stock" : "In Stock"}
                          </button>

                          <button
                            onClick={() => toggleDishHidden(dish)}
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded border transition-colors ${
                              dish.hidden
                                ? "bg-gray-100 text-gray-700 border-gray-300"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {dish.hidden ? "Show" : "Hide"}
                          </button>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => { setEditingDish(dish); setIsDishAddMode(false); }}
                            className="p-1.5 rounded-lg bg-brand-bg border border-brand-gold/15 text-brand-dark hover:bg-brand-accent hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => deleteDishItem(dish.id)}
                            className="p-1.5 rounded-lg bg-brand-bg border border-brand-gold/15 text-brand-dark hover:bg-rose-500 hover:text-white transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: GALLERY MANAGEMENT */}
            {activeTab === "gallery" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark uppercase">Gallery Management</h2>
                  <p className="text-xs text-brand-dark/50">Add or remove photographs representing the dining experience.</p>
                </div>

                {/* Upload Form */}
                <form onSubmit={handleAddGallery} className="bg-white border border-brand-gold/10 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row gap-4 items-end">
                  <div className="w-full md:w-1/3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark"
                    />
                  </div>
                  <div className="w-full md:w-1/3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Caption Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Sizzling Paneer Tikka"
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark"
                    />
                  </div>
                  <div className="w-full md:w-1/4">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Category</label>
                    <select
                      value={newGalleryCategory}
                      onChange={(e: any) => setNewGalleryCategory(e.target.value)}
                      className="w-full bg-brand-bg border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs font-bold text-brand-dark"
                    >
                      <option value="Dishes">Dishes</option>
                      <option value="Tandoor">Tandoor</option>
                      <option value="Ambience">Ambience</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full md:w-auto bg-brand-accent hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow">
                    Add Photo
                  </button>
                </form>

                {/* Gallery List */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {gallery.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-brand-gold/15 relative group">
                      <img src={item.url} alt={item.title} className="w-full aspect-[4/3] object-cover" />
                      <div className="p-3">
                        <h4 className="text-xs font-bold text-brand-dark truncate">{item.title}</h4>
                        <span className="text-[9px] uppercase font-bold text-brand-dark/50 tracking-wider mt-0.5 block">{item.category}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-rose-500 text-white rounded-full p-2 hover:shadow transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: REVIEWS MODERATION */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark uppercase">Guest Reviews Moderation</h2>
                  <p className="text-xs text-brand-dark/50">Approve reviews submitted by customers before publishing to the public feed.</p>
                </div>

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center text-brand-dark/50 border border-brand-gold/10">
                      No review logs found.
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-white rounded-3xl p-6 border border-brand-gold/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-3 max-w-2xl">
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                              rev.status === "Pending" ? "bg-amber-100 text-amber-700" :
                              rev.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                            }`}>
                              {rev.status}
                            </span>
                            {rev.pinned && (
                              <span className="text-[8px] font-black bg-brand-gold text-brand-dark px-2 py-0.5 rounded flex items-center gap-1">
                                <Award size={8} /> Pinned
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-sm text-brand-dark">{rev.name} <span className="text-[10px] text-brand-dark/50 font-normal">({rev.role})</span></h4>
                            <div className="flex space-x-0.5 my-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={12} className={i < rev.rating ? "text-brand-gold fill-brand-gold" : "text-brand-dark/15"} />
                              ))}
                            </div>
                            <p className="text-xs text-brand-dark/80 italic font-sans">"{rev.quote}"</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 shrink-0">
                          {rev.status === "Pending" && (
                            <>
                              <button onClick={() => moderateReview(rev.id, "Approved")} className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors">
                                Approve
                              </button>
                              <button onClick={() => moderateReview(rev.id, "Rejected")} className="bg-gray-500 hover:bg-gray-600 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors">
                                Reject
                              </button>
                            </>
                          )}
                          {rev.status === "Approved" && (
                            <button onClick={() => toggleReviewPin(rev.id, rev.pinned)} className="bg-brand-bg hover:bg-brand-gold text-brand-dark border border-brand-gold/20 text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-colors">
                              {rev.pinned ? "Unpin" : "Pin Review"}
                            </button>
                          )}
                          <button onClick={() => deleteReviewItem(rev.id)} className="p-2 bg-brand-bg text-brand-dark/30 hover:text-rose-500 hover:bg-rose-50 border border-brand-gold/15 rounded-xl transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: CONTACT ENQUIRIES */}
            {activeTab === "contacts" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark uppercase">Contact enquiries</h2>
                  <p className="text-xs text-brand-dark/50">Review contact form entries and questions submitted by diners.</p>
                </div>

                <div className="space-y-4">
                  {contacts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center text-brand-dark/50 border border-brand-gold/10">
                      No inquiries log found.
                    </div>
                  ) : (
                    contacts.map((inq) => (
                      <div key={inq.id} className="bg-white rounded-3xl p-6 border border-brand-gold/10 shadow-sm flex flex-col justify-between gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              inq.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {inq.status}
                            </span>
                            <h4 className="font-display font-bold text-sm text-brand-dark mt-2">{inq.subject}</h4>
                            <p className="text-[10px] text-brand-dark/50 font-sans mt-0.5">By {inq.name} ({inq.email}) on {inq.createdAt.split("T")[0]}</p>
                          </div>
                          <div className="flex gap-2">
                            {inq.status === "Pending" && (
                              <button onClick={() => resolveInquiry(inq.id)} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 rounded-xl transition-colors">
                                <Check size={14} />
                              </button>
                            )}
                            <button onClick={() => deleteInquiry(inq.id)} className="p-2 bg-brand-bg text-brand-dark/30 hover:text-rose-500 hover:bg-rose-50 border border-brand-gold/15 rounded-xl transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-brand-dark/80 bg-brand-bg/30 p-4 rounded-2xl border border-brand-gold/5 italic leading-relaxed">
                          "{inq.message}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: WEB SETTINGS */}
            {activeTab === "settings" && settings && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark uppercase">Web Configuration Settings</h2>
                  <p className="text-xs text-brand-dark/50">Manage discount percentages, capacities, and general timings.</p>
                </div>

                <form onSubmit={saveSettings} className="bg-white border border-brand-gold/10 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Discount Percent (%)</label>
                      <input
                        type="number"
                        required
                        value={settings.discountPercent}
                        onChange={(e) => setSettings({ ...settings, discountPercent: Number(e.target.value) })}
                        className="w-full bg-brand-bg/40 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">WhatsApp Integration Number</label>
                      <input
                        type="text"
                        required
                        value={settings.whatsappNumber}
                        onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                        className="w-full bg-brand-bg/40 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Max Guests / Table Request</label>
                      <input
                        type="number"
                        required
                        value={settings.maxGuestsPerBooking}
                        onChange={(e) => setSettings({ ...settings, maxGuestsPerBooking: Number(e.target.value) })}
                        className="w-full bg-brand-bg/40 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Max Bookings / Time Slot</label>
                      <input
                        type="number"
                        required
                        value={settings.maxReservationsPerSlot}
                        onChange={(e) => setSettings({ ...settings, maxReservationsPerSlot: Number(e.target.value) })}
                        className="w-full bg-brand-bg/40 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Advance Booking Window (Days)</label>
                      <input
                        type="number"
                        required
                        value={settings.advanceBookingDays}
                        onChange={(e) => setSettings({ ...settings, advanceBookingDays: Number(e.target.value) })}
                        className="w-full bg-brand-bg/40 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Timings Display Text</label>
                      <input
                        type="text"
                        required
                        value={settings.timings}
                        onChange={(e) => setSettings({ ...settings, timings: e.target.value })}
                        className="w-full bg-brand-bg/40 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-brand-dark/5">
                    <h4 className="font-display font-bold text-sm text-brand-dark uppercase tracking-wider">Contact & Address Configuration</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Contact Phone</label>
                        <input
                          type="text"
                          required
                          value={settings.contactPhone}
                          onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                          className="w-full bg-brand-bg/40 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Contact Email</label>
                        <input
                          type="email"
                          required
                          value={settings.contactEmail}
                          onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                          className="w-full bg-brand-bg/40 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Postal Address</label>
                      <textarea
                        rows={2}
                        required
                        value={settings.contactAddress}
                        onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                        className="w-full bg-brand-bg/40 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark"
                      />
                    </div>
                  </div>

                  <button type="submit" className="bg-brand-accent hover:bg-brand-dark text-white px-8 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-colors shadow">
                    Save Config Settings
                  </button>
                </form>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* MODAL: RESERVATION DETAILS & MANAGEMENT */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setSelectedBooking(null)} className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md" />
            <div className="relative w-full max-w-lg bg-brand-bg rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-gold/25 z-10 space-y-6">
              <button onClick={() => setSelectedBooking(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-dark/10 hover:bg-brand-accent hover:text-white flex items-center justify-center text-brand-dark transition-colors">
                <X size={16} />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  Request Management
                </span>
                <h3 className="font-display font-black text-xl text-brand-dark">Reservation details {selectedBooking.id}</h3>
              </div>

              {/* Guest Summary Card */}
              <div className="bg-white rounded-2xl p-5 border border-brand-gold/10 space-y-3 text-xs">
                <div className="flex justify-between border-b border-brand-dark/5 pb-2">
                  <span className="text-brand-dark/50">Diner Name</span>
                  <span className="font-bold text-brand-dark">{selectedBooking.name}</span>
                </div>
                <div className="flex justify-between border-b border-brand-dark/5 pb-2">
                  <span className="text-brand-dark/50">Contact Info</span>
                  <span className="font-bold text-brand-dark">{selectedBooking.phone}</span>
                </div>
                <div className="flex justify-between border-b border-brand-dark/5 pb-2">
                  <span className="text-brand-dark/50">Requested Slot</span>
                  <span className="font-bold text-brand-dark">{selectedBooking.date} at {selectedBooking.time}</span>
                </div>
                <div className="flex justify-between border-b border-brand-dark/5 pb-2">
                  <span className="text-brand-dark/50">Party Details</span>
                  <span className="font-bold text-brand-dark">{selectedBooking.guests} Guests ({selectedBooking.occasion})</span>
                </div>
                {selectedBooking.instructions && (
                  <div className="border-b border-brand-dark/5 pb-2">
                    <span className="text-brand-dark/50 block mb-1">Instructions</span>
                    <p className="font-sans italic bg-brand-bg/50 p-2.5 rounded-lg border border-brand-gold/5 text-brand-dark/80">
                      "{selectedBooking.instructions}"
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-brand-dark/50">Current Status</span>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    selectedBooking.status === "Pending" ? "bg-amber-100 text-amber-700" :
                    selectedBooking.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                    selectedBooking.status === "Arrived" ? "bg-teal-100 text-teal-700" :
                    selectedBooking.status === "Completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {/* Form config options (Table assignment + internal notes) */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Assign Table (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Table 4"
                      value={bookingTableNum}
                      onChange={(e) => setBookingTableNum(e.target.value)}
                      className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Internal notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Regular VIP customer"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons based on Role & Current Status */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.status === "Pending" && (
                    <>
                      <button onClick={() => triggerBookingStatus(selectedBooking.id, "Approved")} className="flex-grow bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-colors">
                        Approve Reservation
                      </button>
                      <button onClick={() => triggerBookingStatus(selectedBooking.id, "Rejected")} className="flex-grow bg-rose-500 hover:bg-rose-650 text-white text-[10px] font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-colors">
                        Reject Booking
                      </button>
                    </>
                  )}

                  {selectedBooking.status === "Approved" && (
                    <>
                      <button onClick={() => triggerBookingStatus(selectedBooking.id, "Arrived")} className="flex-grow bg-teal-500 hover:bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-colors">
                        Diner Arrived
                      </button>
                      <button onClick={() => triggerBookingStatus(selectedBooking.id, "Cancelled")} className="flex-grow bg-gray-500 hover:bg-gray-600 text-white text-[10px] font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-colors">
                        Cancel Booking
                      </button>
                    </>
                  )}

                  {selectedBooking.status === "Arrived" && (
                    <button onClick={() => triggerBookingStatus(selectedBooking.id, "Completed")} className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md transition-colors">
                      Mark Reservation Completed
                    </button>
                  )}
                </div>

                {/* WhatsApp confirmations trigger */}
                {selectedBooking.status === "Pending" && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => sendWhatsAppNotification(selectedBooking, true)}
                      className="border border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Send size={10} /> Send Confirm Alert
                    </button>
                    <button
                      onClick={() => sendWhatsAppNotification(selectedBooking, false)}
                      className="border border-rose-500/20 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[9px] font-bold uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Send size={10} /> Send Reject Alert
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT DISH */}
      <AnimatePresence>
        {editingDish && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => { setEditingDish(null); setIsDishAddMode(false); }} className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md" />
            <form onSubmit={saveDish} className="relative w-full max-w-lg bg-brand-bg rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-gold/25 z-10 space-y-4">
              <button type="button" onClick={() => { setEditingDish(null); setIsDishAddMode(false); }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-dark/10 hover:bg-brand-accent hover:text-white flex items-center justify-center text-brand-dark transition-colors">
                <X size={16} />
              </button>

              <h3 className="font-display font-black text-xl text-brand-dark uppercase tracking-wider">
                {isDishAddMode ? "Add New Dish" : "Edit Dish Details"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={editingDish.title || ""}
                    onChange={(e) => setEditingDish({ ...editingDish, title: e.target.value })}
                    className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Telugu Title</label>
                  <input
                    type="text"
                    value={editingDish.teluguTitle || ""}
                    onChange={(e) => setEditingDish({ ...editingDish, teluguTitle: e.target.value })}
                    className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Category *</label>
                  <select
                    value={editingDish.category || "SOUPS"}
                    onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                    className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs font-bold text-brand-dark"
                  >
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Price (e.g. 180 or 180 / 210) *</label>
                  <input
                    type="text"
                    required
                    value={editingDish.price || ""}
                    onChange={(e) => setEditingDish({ ...editingDish, price: e.target.value })}
                    className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={editingDish.image || ""}
                  onChange={(e) => setEditingDish({ ...editingDish, image: e.target.value })}
                  className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingDish.description || ""}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full bg-white border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingDish.isChefSpecial || false}
                    onChange={(e) => setEditingDish({ ...editingDish, isChefSpecial: e.target.checked })}
                    className="w-4 h-4 accent-brand-accent rounded"
                  />
                  <span className="text-[10px] font-bold text-brand-dark/70 uppercase">Chef's Special</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingDish.isPopular || false}
                    onChange={(e) => setEditingDish({ ...editingDish, isPopular: e.target.checked })}
                    className="w-4 h-4 accent-brand-accent rounded"
                  />
                  <span className="text-[10px] font-bold text-brand-dark/70 uppercase">Popular item</span>
                </label>
              </div>

              <button type="submit" className="w-full bg-brand-accent hover:bg-brand-dark text-white py-3.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all shadow">
                Save Dish Changes
              </button>
            </form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
