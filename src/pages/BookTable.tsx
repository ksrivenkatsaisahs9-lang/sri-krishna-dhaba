import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Users, Gift, MessageCircle, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../utils/db";
import type { Booking } from "../utils/db";

interface Table {
  id: string;
  name: string;
  capacity: number;
  section: "Main Hall" | "Family Section" | "Window Side" | "VIP Booth" | "Banquet";
}

const restaurantTables: Table[] = [
  { id: "1", name: "Table 1 (2-Seater)", capacity: 2, section: "Main Hall" },
  { id: "2", name: "Table 2 (2-Seater)", capacity: 2, section: "Main Hall" },
  { id: "3", name: "Table 3 (4-Seater)", capacity: 4, section: "Main Hall" },
  { id: "4", name: "Table 4 (4-Seater)", capacity: 4, section: "Main Hall" },
  { id: "5", name: "Table 5 (6-Seater)", capacity: 6, section: "Family Section" },
  { id: "6", name: "Table 6 (6-Seater)", capacity: 6, section: "Family Section" },
  { id: "7", name: "Table 7 (4-Seater)", capacity: 4, section: "Window Side" },
  { id: "8", name: "Table 8 (4-Seater)", capacity: 4, section: "Window Side" },
  { id: "9", name: "Table 9 (8-Seater)", capacity: 8, section: "Banquet" },
  { id: "10", name: "Table 10 (2-Seater)", capacity: 2, section: "VIP Booth" }
];

const timeSlots = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"
];

const occasions = [
  "None",
  "Birthday Celebration",
  "Anniversary Dinner",
  "Family Gathering",
  "Corporate Lunch/Dinner",
  "Kitty Party",
  "Date Night",
  "Other Celebration"
];

export default function BookTable() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [occasion, setOccasion] = useState("None");
  const [instructions, setInstructions] = useState("");
  const [selectedTable, setSelectedTable] = useState<string>("");

  // System State
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [reservedTables, setReservedTables] = useState<string[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);
  const [formError, setFormError] = useState("");

  const settings = db.getSettings();

  useEffect(() => {
    db.init();
    // Default date to today
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setExistingBookings(db.getBookings());
  }, []);

  // Update sameAsPhone
  useEffect(() => {
    if (sameAsPhone) {
      setWhatsapp(phone);
    }
  }, [phone, sameAsPhone]);

  // Compute reserved tables for the selected date and time slot
  useEffect(() => {
    if (!date || !time) {
      setReservedTables([]);
      return;
    }

    const matchedBookings = existingBookings.filter(
      (b) =>
        b.date === date &&
        b.time === time &&
        b.status !== "Cancelled" &&
        b.status !== "Rejected"
    );

    const reservedIds = matchedBookings
      .map((b) => b.tableNumber)
      .filter((id): id is string => !!id);

    setReservedTables(reservedIds);

    // Reset table selection if it becomes unavailable
    if (selectedTable && reservedIds.includes(selectedTable)) {
      setSelectedTable("");
    }
  }, [date, time, existingBookings, selectedTable]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name || !phone || !date || !time) {
      setFormError("Please fill in all required fields (Name, Phone, Date, Time).");
      return;
    }

    if (guests > settings.maxGuestsPerBooking) {
      setFormError(`Maximum guests allowed per booking is ${settings.maxGuestsPerBooking}. For larger groups, please contact the restaurant directly.`);
      return;
    }

    // Check if slot capacity is reached
    const slotCount = existingBookings.filter(
      (b) => b.date === date && b.time === time && b.status !== "Cancelled" && b.status !== "Rejected"
    ).length;

    if (slotCount >= settings.maxReservationsPerSlot) {
      setFormError("This time slot is fully reserved. Please choose another date or time slot.");
      return;
    }

    // Save booking
    const newBooking = db.addBooking({
      name,
      phone,
      whatsapp: sameAsPhone ? phone : whatsapp,
      email: email || undefined,
      guests,
      date,
      time,
      occasion,
      instructions: instructions || undefined,
      tableNumber: selectedTable || undefined
    });

    setBookingSuccess(newBooking);

    // Refresh bookings list
    setExistingBookings(db.getBookings());
  };

  const handleWhatsAppAction = (type: "client" | "owner") => {
    if (!bookingSuccess) return;
    const settingsObj = db.getSettings();
    const phoneNum = type === "owner" 
      ? settingsObj.whatsappNumber.replace(/[^0-9]/g, "") 
      : bookingSuccess.whatsapp.replace(/[^0-9]/g, "");

    const text = db.formatBookingNotification(
      bookingSuccess, 
      type === "client"
    );

    window.open(`https://wa.me/${phoneNum}?text=${text}`, "_blank");
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen pt-28 pb-20 bg-brand-bg/30 relative">
      <div className="noise-overlay" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          {!bookingSuccess ? (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-[10px] font-black tracking-widest text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-3.5 py-1 rounded-full uppercase">
                  Reservation Desk
                </span>
                <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight leading-none">
                  Book A Dining Table
                </h1>
                <p className="text-sm text-brand-dark/70">
                  Sri Krishna Dhaba, Pragathi Nagar - Pure Veg Family Experience
                </p>
              </div>

              {/* Promo Banner */}
              <div className="max-w-4xl mx-auto bg-brand-dark text-brand-bg border border-brand-gold/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/10 rounded-full blur-xl" />
                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0">
                    <Gift size={24} />
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest bg-brand-gold/10 border border-brand-gold/25 px-2.5 py-0.5 rounded">
                      Exclusive Web Offer
                    </span>
                    <p className="text-sm font-display font-medium leading-relaxed italic text-brand-bg/95">
                      "Reserve your table through our website and receive <strong className="text-brand-gold font-bold">10% OFF</strong> on your final dining bill."
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid: Form + Layout Map */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Form Side - 5 columns */}
                <div className="lg:col-span-5 bg-white border border-brand-gold/10 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  <h3 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wider pb-3 border-b border-brand-dark/5">
                    Reservation Details
                  </h3>

                  {formError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-start gap-2">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Customer info */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full bg-brand-bg/35 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark transition-colors shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Mobile Number *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="w-full bg-brand-bg/35 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark transition-colors shadow-inner"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Guests *</label>
                        <div className="relative">
                          <select
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="w-full bg-brand-bg/35 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark appearance-none cursor-pointer font-bold"
                          >
                            {Array.from({ length: settings.maxGuestsPerBooking }).map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1} {i + 1 === 1 ? "Guest" : "Guests"}
                              </option>
                            ))}
                          </select>
                          <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/45 pointer-events-none" size={14} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block">WhatsApp Number *</label>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={sameAsPhone}
                            onChange={(e) => setSameAsPhone(e.target.checked)}
                            className="w-3.5 h-3.5 accent-brand-accent rounded"
                          />
                          <span className="text-[9px] text-brand-dark/50 font-bold uppercase tracking-wide">Same as mobile</span>
                        </label>
                      </div>
                      <input
                        type="tel"
                        required
                        disabled={sameAsPhone}
                        value={sameAsPhone ? phone : whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="WhatsApp contact"
                        className={`w-full bg-brand-bg/35 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark transition-colors shadow-inner ${
                          sameAsPhone ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full bg-brand-bg/35 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark transition-colors shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Date *</label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            min={todayStr}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-brand-bg/35 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none pl-10 pr-4 py-2 rounded-xl text-xs text-brand-dark font-bold cursor-pointer"
                          />
                          <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/45" size={14} />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Time Slot *</label>
                        <div className="relative">
                          <select
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-brand-bg/35 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none pl-10 pr-4 py-2.5 rounded-xl text-xs text-brand-dark appearance-none cursor-pointer font-bold"
                          >
                            <option value="">Select Time</option>
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot} {parseInt(slot.split(":")[0]) >= 12 ? "PM" : "AM"}
                              </option>
                            ))}
                          </select>
                          <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-dark/45 pointer-events-none" size={14} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Special Occasion</label>
                      <div className="relative">
                        <select
                          value={occasion}
                          onChange={(e) => setOccasion(e.target.value)}
                          className="w-full bg-brand-bg/35 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark appearance-none cursor-pointer"
                        >
                          {occasions.map((o) => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                        <Gift className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/45 pointer-events-none" size={14} />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brand-dark/60 block mb-1">Special Requests / Notes</label>
                      <textarea
                        rows={2}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Any food preferences, wheelchair access, decorations..."
                        className="w-full bg-brand-bg/35 border border-brand-gold/20 focus:border-brand-accent/60 focus:outline-none px-4 py-2 rounded-xl text-xs text-brand-dark shadow-inner"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-accent hover:bg-brand-dark text-white py-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-md border border-brand-accent/10 flex items-center justify-center gap-2"
                  >
                    <span>Request Reservation</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Seating Layout Side - 7 columns */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white border border-brand-gold/10 p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-start pb-4 border-b border-brand-dark/5 mb-6">
                      <div>
                        <h3 className="font-display font-bold text-lg text-brand-dark uppercase tracking-wider">
                          Select Table Preference
                        </h3>
                        <p className="text-[11px] text-brand-dark/60 mt-1">
                          Choose an available table from the visual dining layout below.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded" /> Available</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded" /> Chosen</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded animate-pulse" /> Reserved</span>
                      </div>
                    </div>

                    {!date || !time ? (
                      <div className="bg-brand-bg/40 border border-brand-gold/10 rounded-2xl py-24 px-6 text-center text-brand-dark/50">
                        <Clock size={36} className="mx-auto mb-3 opacity-35" />
                        <p className="text-sm font-medium">Please select a Date and Time slot first</p>
                        <p className="text-[11px] mt-1 opacity-70">Seating maps dynamically load depending on slot occupation.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Seating Map Grid */}
                        <div className="border border-brand-gold/10 bg-brand-bg/25 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
                          {/* Entrance/Counter Layout Markers */}
                          <div className="flex justify-between text-[9px] font-black text-brand-dark/30 tracking-widest uppercase mb-4">
                            <span className="border border-dashed border-brand-dark/20 px-4 py-1 rounded">🚪 MAIN ENTRANCE</span>
                            <span className="border border-dashed border-brand-dark/20 px-4 py-1 rounded">🥘 KITCHEN WINDOW</span>
                          </div>

                          {/* Seating Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-8">
                            {restaurantTables.map((table) => {
                              const isReserved = reservedTables.includes(table.id);
                              const isSelected = selectedTable === table.id;

                              let bgClass = "bg-white border-emerald-500/30 text-emerald-700 hover:bg-emerald-500 hover:text-white";
                              if (isReserved) {
                                bgClass = "bg-rose-100 border-rose-400 text-rose-700 cursor-not-allowed";
                              } else if (isSelected) {
                                bgClass = "bg-brand-gold border-brand-gold text-brand-dark shadow-md";
                              }

                              return (
                                <motion.div
                                  key={table.id}
                                  whileHover={!isReserved ? { scale: 1.03 } : {}}
                                  onClick={() => {
                                    if (isReserved) return;
                                    setSelectedTable(isSelected ? "" : table.id);
                                  }}
                                  className={`border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative ${bgClass}`}
                                >
                                  {isReserved && (
                                    <div className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black shadow" title="Fully Booked">
                                      ✕
                                    </div>
                                  )}
                                  <span className="text-xs font-black tracking-wide">{table.name}</span>
                                  <span className="text-[9px] opacity-75 font-semibold mt-1 uppercase tracking-widest">{table.section}</span>
                                </motion.div>
                              );
                            })}
                          </div>

                          {/* Counter / Bar marker */}
                          <div className="bg-brand-dark/5 border border-brand-dark/10 rounded-xl py-3 text-center text-[10px] font-black text-brand-dark/40 tracking-widest uppercase">
                            🍹 FAMILY SEATING BUFFET SECTION
                          </div>
                        </div>

                        {/* Capacity warning */}
                        {selectedTable && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-800 flex items-start gap-2.5">
                            <Users size={16} className="shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold uppercase tracking-wider">Table Details: {restaurantTables.find(t => t.id === selectedTable)?.name}</p>
                              <p className="mt-1 leading-relaxed">
                                This table accommodates up to {restaurantTables.find(t => t.id === selectedTable)?.capacity} guests. If your guest count exceeds this size, we may merge adjacent tables on arrival.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white border border-brand-gold/10 p-6 rounded-3xl shadow-sm text-center space-y-3">
                    <h4 className="font-display font-bold text-sm text-brand-dark uppercase tracking-wider">Online Booking Flow</h4>
                    <p className="text-[11px] text-brand-dark/60 leading-relaxed max-w-md mx-auto">
                      Upon submission, your booking enters a <strong>Pending Approval</strong> state. The manager reviews it against current seating occupancy and approves. You will receive final confirmations via WhatsApp.
                    </p>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (
            /* Success View */
            <motion.div
              key="booking-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto bg-white border border-brand-gold/15 p-8 sm:p-12 rounded-3xl shadow-2xl text-center space-y-8 relative overflow-hidden"
            >
              {/* Corner borders */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-brand-gold" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-brand-gold" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-brand-gold" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-brand-gold" />

              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Request Placed Successfully
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-dark leading-tight tracking-tight">
                  Reservation Received!
                </h2>
                <p className="text-xs sm:text-sm text-brand-dark/65 max-w-md mx-auto leading-relaxed">
                  Your reservation request has been logged. Our booking controller is reviewing availability.
                </p>
              </div>

              {/* Summary details */}
              <div className="bg-brand-bg/40 border border-brand-gold/10 rounded-2xl p-6 text-left space-y-3 max-w-md mx-auto text-xs">
                <div className="flex justify-between border-b border-brand-dark/5 pb-2">
                  <span className="text-brand-dark/50">Reservation ID</span>
                  <span className="font-bold text-brand-dark">{bookingSuccess.id}</span>
                </div>
                <div className="flex justify-between border-b border-brand-dark/5 pb-2">
                  <span className="text-brand-dark/50">Guest Name</span>
                  <span className="font-bold text-brand-dark">{bookingSuccess.name}</span>
                </div>
                <div className="flex justify-between border-b border-brand-dark/5 pb-2">
                  <span className="text-brand-dark/50">Date & Time</span>
                  <span className="font-bold text-brand-dark">{bookingSuccess.date} at {bookingSuccess.time}</span>
                </div>
                <div className="flex justify-between border-b border-brand-dark/5 pb-2">
                  <span className="text-brand-dark/50">Guests count</span>
                  <span className="font-bold text-brand-dark">{bookingSuccess.guests} {bookingSuccess.guests === 1 ? "Guest" : "Guests"}</span>
                </div>
                {bookingSuccess.tableNumber && (
                  <div className="flex justify-between">
                    <span className="text-brand-dark/50">Preferred Seating</span>
                    <span className="font-bold text-brand-accent">Table {bookingSuccess.tableNumber}</span>
                  </div>
                )}
              </div>

              {/* WhatsApp Action Buttons */}
              <div className="pt-4 space-y-3 max-w-md mx-auto">
                <button
                  onClick={() => handleWhatsAppAction("client")}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  <span>Get Confirmation on WhatsApp</span>
                </button>

                <button
                  onClick={() => handleWhatsAppAction("owner")}
                  className="w-full bg-brand-dark hover:bg-brand-accent text-brand-bg hover:text-brand-bg py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 border border-brand-dark/10"
                >
                  <MessageCircle size={14} />
                  <span>Notify Manager via WhatsApp</span>
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="text-xs text-brand-dark/50 hover:text-brand-accent underline"
                >
                  Make Another Reservation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
