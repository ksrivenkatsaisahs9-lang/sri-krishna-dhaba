import type { Dish } from "../components/DishCard";
import { menuData as initialMenu } from "./menuData";

export interface Booking {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  guests: number;
  date: string;
  time: string;
  occasion: string;
  instructions?: string;
  tableNumber?: string;
  status: "Pending" | "Approved" | "Rejected" | "Arrived" | "Completed" | "Cancelled";
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  quote: string;
  date: string;
  source: string;
  avatar: string;
  status: "Pending" | "Approved" | "Rejected";
  pinned?: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: "Dishes" | "Tandoor" | "Sweets" | "Ambience";
  title: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "Pending" | "Resolved";
  createdAt: string;
}

export interface RestaurantSettings {
  discountPercent: number;
  whatsappNumber: string;
  maxGuestsPerBooking: number;
  maxReservationsPerSlot: number;
  advanceBookingDays: number;
  timings: string;
  holidayClosures: string[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  googleMapsEmbedUrl: string;
}

// Initial default reviews
const defaultReviews: Review[] = [
  {
    id: "rev-1",
    name: "Venkata Ratnam Rayala",
    role: "Local Guide • 1,288 reviews",
    rating: 5,
    quote: "Food was good (both quality and quantity wise) Family atmosphere and good staff. We ordered Paneer Chatpata, Butter Naan, Garlic Naan and Butter Roti from this place. Highly satisfied!",
    date: "8 months ago",
    source: "Google Reviews",
    avatar: "VR",
    status: "Approved",
    pinned: true
  },
  {
    id: "rev-2",
    name: "K Monesh Chary",
    role: "Local Guide",
    rating: 4,
    quote: "Nice restaurant with good ambience lighting need to bit more. Food was very tasty, and service is quick. Worth visiting with families.",
    date: "4 months ago",
    source: "Google Reviews",
    avatar: "KM",
    status: "Approved"
  },
  {
    id: "rev-3",
    name: "Sai Kumar",
    role: "2 reviews • 9 photos",
    rating: 4,
    quote: "Ordered Paneer Biryani and Tandoori Roti. The quantity was massive and the taste was authentic. Great experience in Pragathi Nagar.",
    date: "4 months ago",
    source: "Google Reviews",
    avatar: "SK",
    status: "Approved"
  },
  {
    id: "rev-4",
    name: "Jyothi Reddy",
    role: "Verified Customer",
    rating: 5,
    quote: "Excellent pure veg family dhaba on HMT road. Extremely hygienic and the staff is really humble. Highly recommended!",
    date: "2 months ago",
    source: "Swiggy",
    avatar: "JR",
    status: "Approved"
  },
  {
    id: "rev-5",
    name: "Abhinav Rao",
    role: "Foodie Guide",
    rating: 5,
    quote: "The Gobi 65 and Chana Masala were spot on. Real clay oven tandoor roti taste, which is hard to find in local restaurants here.",
    date: "1 month ago",
    source: "Zomato",
    avatar: "AR",
    status: "Approved"
  },
  {
    id: "rev-6",
    name: "Priya Darshini",
    role: "Local Guide",
    rating: 4,
    quote: "Comforting food. The Sweet Tomato Soup and Sweet Lassi are a must-try. Safe and friendly environment for kids and elderly.",
    date: "3 weeks ago",
    source: "Google Reviews",
    avatar: "PD",
    status: "Approved"
  }
];

// Initial default gallery items
const defaultGallery: GalleryItem[] = [
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
    url: "/images/gallery-naan-types.jpg",
    category: "Tandoor",
    title: "Different Naan Types (Kashmiri, Plain, Butter, Garlic)"
  },
  {
    id: "g-5",
    url: "/images/gallery-dish-paneer.jpg",
    category: "Dishes",
    title: "Paneer Butter Masala & Butter Naan Combo"
  },
  {
    id: "g-7",
    url: "/images/gallery-ambience-1.jpg",
    category: "Ambience",
    title: "Premium Family Dining Area"
  },
  {
    id: "g-8",
    url: "/images/gallery-ambience-2.jpg",
    category: "Ambience",
    title: "Cozy Dining with Artistic Decor"
  },
  {
    id: "g-9",
    url: "/images/gallery-ambience-3.jpg",
    category: "Ambience",
    title: "Spacious Banquet Seating Layout"
  }
];

const defaultSettings: RestaurantSettings = {
  discountPercent: 10,
  whatsappNumber: "+91 90322 92421",
  maxGuestsPerBooking: 15,
  maxReservationsPerSlot: 4,
  advanceBookingDays: 30,
  timings: "Mon – Sun: 11:30 AM – 11:45 PM",
  holidayClosures: [],
  contactEmail: "contact@srikrishnadhaba.com",
  contactPhone: "+91 90322 92421",
  contactAddress: "A/1, Oop Godavari Cuts, Bajrang Towers, 6-109/1760, Pragathi Nagar Rd, Hyderabad, Telangana 500090",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.378779646875!2d78.3924395!3d17.5254461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8f0052362da1%3A0xd093fe41bf080e4d!2sSri%20Krishna%20Family%20Dhaba!5e0!3m2!1sen!2sin!4v1704481029192!5m2!1sen!2sin"
};

// Generates mock bookings to populate analytics
const generateMockBookings = (): Booking[] => {
  const list: Booking[] = [];
  const names = ["Ram Charan", "Vijay Devarakonda", "Niharika Konidela", "Allu Arjun", "Pooja Hegde", "Rashmika Mandanna", "Mahesh Babu", "K. R. Srinivas", "G. Lakshmi", "Priya Nair", "Nithin Kumar", "Sneha Rao", "Rohan Mehta", "Suresh G.", "Anusha Patel"];
  const occasions = ["None", "Birthday", "Anniversary", "Family Gathering", "Corporate Meeting", "Kitty Party"];
  const times = ["12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
  const statuses: Booking["status"][] = ["Approved", "Completed", "Arrived", "Cancelled", "Rejected"];

  const today = new Date();
  for (let i = 0; i < 45; i++) {
    const dateOffset = Math.floor(Math.random() * 8); // 0 to 7 days ago
    const bDate = new Date(today);
    bDate.setDate(today.getDate() - dateOffset);
    const dateStr = bDate.toISOString().split("T")[0];

    const hourStr = times[Math.floor(Math.random() * times.length)];
    const status = dateOffset === 0 ? "Pending" : statuses[Math.floor(Math.random() * statuses.length)];
    const phone = `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`;

    list.push({
      id: `r-${1000 + i}`,
      name: names[Math.floor(Math.random() * names.length)],
      phone,
      whatsapp: phone,
      email: Math.random() > 0.5 ? "guest@example.com" : undefined,
      guests: Math.floor(Math.random() * 6) + 1,
      date: dateStr,
      time: hourStr,
      occasion: occasions[Math.floor(Math.random() * occasions.length)],
      instructions: Math.random() > 0.7 ? "Extra chairs needed." : undefined,
      tableNumber: String(Math.floor(Math.random() * 10) + 1),
      status,
      notes: Math.random() > 0.8 ? "Frequent diner. Likes window seat." : undefined,
      createdAt: new Date(bDate.getTime() - 3600000).toISOString()
    });
  }
  return list;
};

const KEYS = {
  MENU: "skd_menu",
  BOOKINGS: "skd_bookings",
  REVIEWS: "skd_reviews",
  GALLERY: "skd_gallery",
  CONTACTS: "skd_contacts",
  SETTINGS: "skd_settings",
  VISITS: "skd_visits"
};

export const db = {
  init() {
    if (!localStorage.getItem(KEYS.MENU)) {
      const cleanedMenu = initialMenu.map((dish) => ({
        ...dish,
        outOfStock: false,
        hidden: false
      }));
      localStorage.setItem(KEYS.MENU, JSON.stringify(cleanedMenu));
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify(defaultReviews));
    }
    if (!localStorage.getItem(KEYS.GALLERY)) {
      localStorage.setItem(KEYS.GALLERY, JSON.stringify(defaultGallery));
    }
    if (!localStorage.getItem(KEYS.SETTINGS)) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(generateMockBookings()));
    }
    if (!localStorage.getItem(KEYS.CONTACTS)) {
      localStorage.setItem(KEYS.CONTACTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.VISITS)) {
      localStorage.setItem(KEYS.VISITS, String(254));
    }
  },

  // ─── MENU DB ─────────────────────────────────────────────────────────────
  getMenu(): Dish[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.MENU) || "[]");
  },

  addDish(dish: Omit<Dish, "id"> & { id?: string }): Dish {
    const menu = this.getMenu();
    const newDish = {
      ...dish,
      id: dish.id || `dish-${Date.now()}`,
      rating: dish.rating || 4.0
    } as Dish;
    menu.push(newDish);
    localStorage.setItem(KEYS.MENU, JSON.stringify(menu));
    return newDish;
  },

  updateDish(id: string, updates: Partial<Dish>): Dish {
    const menu = this.getMenu();
    const index = menu.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Dish not found");
    menu[index] = { ...menu[index], ...updates };
    localStorage.setItem(KEYS.MENU, JSON.stringify(menu));
    return menu[index];
  },

  deleteDish(id: string): void {
    const menu = this.getMenu();
    const filtered = menu.filter((d) => d.id !== id);
    localStorage.setItem(KEYS.MENU, JSON.stringify(filtered));
  },

  // ─── BOOKINGS DB ─────────────────────────────────────────────────────────
  getBookings(): Booking[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || "[]");
  },

  addBooking(booking: Omit<Booking, "id" | "status" | "createdAt"> & { status?: Booking["status"] }): Booking {
    const bookings = this.getBookings();
    const newBooking: Booking = {
      ...booking,
      id: `r-${Date.now().toString().slice(-4)}`,
      status: booking.status || "Pending",
      createdAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    return newBooking;
  },

  updateBookingStatus(id: string, status: Booking["status"], notes?: string): Booking {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Booking not found");
    bookings[index].status = status;
    if (notes !== undefined) bookings[index].notes = notes;
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[index];
  },

  updateBooking(id: string, updates: Partial<Booking>): Booking {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Booking not found");
    bookings[index] = { ...bookings[index], ...updates };
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings[index];
  },

  deleteBooking(id: string): void {
    const bookings = this.getBookings();
    const filtered = bookings.filter((b) => b.id !== id);
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(filtered));
  },

  // ─── REVIEWS DB ──────────────────────────────────────────────────────────
  getReviews(): Review[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.REVIEWS) || "[]");
  },

  addReview(review: Omit<Review, "id" | "avatar" | "date" | "status">): Review {
    const reviews = this.getReviews();
    const initials = review.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      avatar: initials || "G",
      date: "Just now",
      status: "Pending"
    };
    reviews.push(newReview);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    return newReview;
  },

  updateReviewStatus(id: string, status: Review["status"], pinned?: boolean): Review {
    const reviews = this.getReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Review not found");
    reviews[index].status = status;
    if (pinned !== undefined) reviews[index].pinned = pinned;
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
    return reviews[index];
  },

  deleteReview(id: string): void {
    const reviews = this.getReviews();
    const filtered = reviews.filter((r) => r.id !== id);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(filtered));
  },

  // ─── GALLERY DB ──────────────────────────────────────────────────────────
  getGallery(): GalleryItem[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.GALLERY) || "[]");
  },

  addImage(item: Omit<GalleryItem, "id">): GalleryItem {
    const gallery = this.getGallery();
    const newItem = {
      ...item,
      id: `g-${Date.now()}`
    };
    gallery.push(newItem);
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(gallery));
    return newItem;
  },

  deleteImage(id: string): void {
    const gallery = this.getGallery();
    const filtered = gallery.filter((g) => g.id !== id);
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(filtered));
  },

  updateGallery(items: GalleryItem[]): void {
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(items));
  },

  // ─── CONTACTS DB ─────────────────────────────────────────────────────────
  getContacts(): ContactInquiry[] {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.CONTACTS) || "[]");
  },

  addContact(inquiry: Omit<ContactInquiry, "id" | "status" | "createdAt">): ContactInquiry {
    const contacts = this.getContacts();
    const newInquiry: ContactInquiry = {
      ...inquiry,
      id: `c-${Date.now()}`,
      status: "Pending",
      createdAt: new Date().toISOString()
    };
    contacts.push(newInquiry);
    localStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
    return newInquiry;
  },

  updateContactStatus(id: string, status: ContactInquiry["status"]): ContactInquiry {
    const contacts = this.getContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Inquiry not found");
    contacts[index].status = status;
    localStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
    return contacts[index];
  },

  deleteContact(id: string): void {
    const contacts = this.getContacts();
    const filtered = contacts.filter((c) => c.id !== id);
    localStorage.setItem(KEYS.CONTACTS, JSON.stringify(filtered));
  },

  // ─── SETTINGS DB ─────────────────────────────────────────────────────────
  getSettings(): RestaurantSettings {
    this.init();
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS) || JSON.stringify(defaultSettings));
  },

  updateSettings(updates: Partial<RestaurantSettings>): RestaurantSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },

  // ─── ANALYTICS & STATS ───────────────────────────────────────────────────
  incrementWebsiteVisits(): number {
    this.init();
    const current = parseInt(localStorage.getItem(KEYS.VISITS) || "120", 10);
    const updated = current + 1;
    localStorage.setItem(KEYS.VISITS, String(updated));
    return updated;
  },

  getAnalytics() {
    const bookings = this.getBookings();
    const visits = parseInt(localStorage.getItem(KEYS.VISITS) || "250", 10);

    const todayStr = new Date().toISOString().split("T")[0];
    const todayBookings = bookings.filter((b) => b.date === todayStr);

    const pending = bookings.filter((b) => b.status === "Pending").length;
    const approved = bookings.filter((b) => b.status === "Approved").length;
    const completed = bookings.filter((b) => b.status === "Completed").length;
    const arrived = bookings.filter((b) => b.status === "Arrived").length;
    const cancelled = bookings.filter((b) => b.status === "Cancelled").length;

    const phoneMap = new Map<string, number>();
    bookings.forEach((b) => {
      phoneMap.set(b.phone, (phoneMap.get(b.phone) || 0) + 1);
    });

    let totalCustomers = phoneMap.size;
    let returningCustomers = 0;
    phoneMap.forEach((count) => {
      if (count > 1) returningCustomers++;
    });

    const hoursMap: { [key: string]: number } = {};
    bookings.forEach((b) => {
      hoursMap[b.time] = (hoursMap[b.time] || 0) + 1;
    });

    const conversionRate = visits > 0 ? ((bookings.length / visits) * 100).toFixed(1) : "0.0";

    return {
      visits,
      todayBookings: todayBookings.length,
      upcomingBookings: bookings.filter((b) => b.status === "Approved" || b.status === "Pending").length,
      pendingBookings: pending,
      cancelledBookings: cancelled + bookings.filter((b) => b.status === "Rejected").length,
      totalCustomers,
      returningCustomers,
      conversionRate,
      statusCounts: { pending, approved, completed, arrived, cancelled },
      busiestHours: Object.entries(hoursMap)
        .map(([time, count]) => ({ time, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    };
  },

  // ─── INTEGRATIONS WHATSAPP MESSENGER ─────────────────────────────────────
  formatBookingNotification(booking: Booking, isClientAck: boolean = false, isApproved: boolean = false, isRejected: boolean = false): string {
    const settings = this.getSettings();
    if (isClientAck) {
      return encodeURIComponent(
        `*SRI KRISHNA DHABA - RESERVATION RECEIVED*\n` +
        `----------------------------------------\n` +
        `Hello ${booking.name},\n` +
        `We have received your reservation request under ID: *${booking.id}*.\n\n` +
        `*Details:*\n` +
        `- Date: ${booking.date}\n` +
        `- Time: ${booking.time}\n` +
        `- Guests: ${booking.guests}\n\n` +
        `Your reservation is currently *PENDING APPROVAL*. We will notify you once confirmed by the restaurant.\n\n` +
        `Thank you for choosing Sri Krishna Dhaba!`
      );
    }

    if (isApproved) {
      return encodeURIComponent(
        `*SRI KRISHNA DHABA - RESERVATION CONFIRMED* ✅\n` +
        `----------------------------------------\n` +
        `Great news ${booking.name}! Your reservation *${booking.id}* has been *APPROVED*.\n\n` +
        `*Reservation Summary:*\n` +
        `- Date: ${booking.date}\n` +
        `- Time: ${booking.time}\n` +
        `- Guests: ${booking.guests} Guests\n` +
        `${booking.tableNumber ? `- Assigned Table: Table ${booking.tableNumber}\n` : ""}\n` +
        `*Restaurant Address:*\n` +
        `${settings.contactAddress}\n\n` +
        `*Google Maps Directions:*\n` +
        `https://maps.google.com/?q=Sri+Krishna+Family+Dhaba+Hyderabad\n\n` +
        `Need to modify? Call us at ${settings.contactPhone}. See you soon!`
      );
    }

    if (isRejected) {
      return encodeURIComponent(
        `*SRI KRISHNA DHABA - RESERVATION UPDATE*\n` +
        `----------------------------------------\n` +
        `Hello ${booking.name},\n` +
        `Thank you for requesting a reservation. Unfortunately, we are unable to accommodate your booking *${booking.id}* on ${booking.date} at ${booking.time} due to full occupancy.\n\n` +
        `We apologize for the inconvenience and hope to serve you another time. Please contact us directly at ${settings.contactPhone} for custom inquiries.`
      );
    }

    // Owner alert
    return encodeURIComponent(
      `*NEW WEB RESERVATION ALERT* 🚨\n` +
      `----------------------------------------\n` +
      `- ID: ${booking.id}\n` +
      `- Customer: ${booking.name}\n` +
      `- Mobile: ${booking.phone}\n` +
      `- Guests: ${booking.guests}\n` +
      `- Date/Time: ${booking.date} at ${booking.time}\n` +
      `- Occasion: ${booking.occasion}\n` +
      `- Notes: ${booking.instructions || "None"}\n\n` +
      `Manage dashboard: https://app22-seven.vercel.app/#/admin`
    );
  }
};
