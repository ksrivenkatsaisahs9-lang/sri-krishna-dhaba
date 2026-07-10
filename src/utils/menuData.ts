import type { Dish } from "../components/DishCard";

export const menuData: Dish[] = [
  // SOUPS
  {
    id: "soup-1",
    title: "Tomato Soup (Sweet)",
    teluguTitle: "టొమాటో సూప్",
    category: "Soups",
    description: "Creamy, sweet, and tangy tomato soup garnished with golden butter croutons and fresh cream.",
    price: 160,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?w=600&auto=format&fit=crop&q=80",
    isPopular: true,
    ingredients: ["Fresh Tomatoes", "Cream", "Butter", "Croutons", "Herbs"],
    allergens: ["Dairy", "Gluten"],
    prepTime: "10 mins"
  },
  {
    id: "soup-2",
    title: "Hot & Sour Soup",
    teluguTitle: "హాట్ అండ్ సోర్ సూప్",
    category: "Soups",
    description: "Spicy and tangy thick vegetable broth with bamboo shoots, mushrooms, and spring onions.",
    price: 170,
    rating: 3.8,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Cabbage", "Carrot", "Mushrooms", "Vinegar", "Soy Sauce", "Chilli"],
    allergens: ["Soy", "Gluten"],
    prepTime: "12 mins"
  },

  // STARTERS
  {
    id: "starter-1",
    title: "Veg Manchurian",
    teluguTitle: "వెజ్ మంచూరియా",
    category: "Starters",
    description: "Golden deep-fried mixed vegetable balls tossed in a rich, tangy, and spicy soy-chilli garlic sauce.",
    price: 220,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
    isPopular: true,
    ingredients: ["Cabbage", "Carrots", "Ginger", "Garlic", "Soy Sauce", "Spring Onion"],
    allergens: ["Soy", "Gluten"],
    prepTime: "15 mins"
  },
  {
    id: "starter-2",
    title: "Gobi 65",
    teluguTitle: "గోబీ 65",
    category: "Starters",
    description: "Crispy cauliflower florets marinated in spiced yoghurt and deep-fried to golden perfection.",
    price: 210,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Cauliflower", "Yoghurt", "Curry Leaves", "Ginger-Garlic Paste", "Garam Masala"],
    allergens: ["Dairy"],
    prepTime: "15 mins"
  },

  // SPECIAL STARTERS
  {
    id: "spec-starter-1",
    title: "Paneer Chatpata (Dry)",
    teluguTitle: "పనీర్ చటపటా",
    category: "Special Starters",
    description: "Cottage cheese chunks tossed in chef's special chatpata spice blend, onions, and capsicum.",
    price: 260,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    ingredients: ["Paneer", "Chaat Masala", "Capsicum", "Lemon Juice", "Coriander"],
    allergens: ["Dairy"],
    prepTime: "18 mins"
  },
  {
    id: "spec-starter-2",
    title: "Paneer Tikka",
    teluguTitle: "పనీర్ టిక్కా",
    category: "Special Starters",
    description: "Paneer cubes marinated in spiced yoghurt and grilled over hot clay tandoor coals.",
    price: 280,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80",
    isPopular: true,
    ingredients: ["Paneer", "Yoghurt marinade", "Bell Peppers", "Onions", "Ajwain"],
    allergens: ["Dairy"],
    prepTime: "20 mins"
  },

  // 65 SPECIALS
  {
    id: "65-spec-1",
    title: "Paneer 65",
    teluguTitle: "పనీర్ 65",
    category: "65 Specials",
    description: "Crispy fried cottage cheese chunks tossed in spicy, tempering yoghurt sauce and curry leaves.",
    price: 250,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Paneer", "Yoghurt", "Red Chilli Paste", "Curry Leaves", "Mustard Seeds"],
    allergens: ["Dairy", "Gluten"],
    prepTime: "15 mins"
  },
  {
    id: "65-spec-2",
    title: "Mushroom 65",
    teluguTitle: "మష్రూమ్ 65",
    category: "65 Specials",
    description: "Fresh button mushrooms coated in crispy spicy batter, fried and tempered with mustard and chillies.",
    price: 240,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1569460555907-8ffc8a8bd9cf?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Button Mushrooms", "Curry Leaves", "Yoghurt Sauce", "Spices"],
    allergens: ["Dairy"],
    prepTime: "15 mins"
  },

  // VEG CURRIES
  {
    id: "curry-1",
    title: "Chana Masala",
    teluguTitle: "చనా మసాలా",
    category: "Veg Curries",
    description: "Soft chickpeas cooked in a deeply flavorful tomato-onion gravy spiced with roasted cumin and amchoor.",
    price: 200,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Kabuli Chana", "Tomato Gravy", "Garam Masala", "Ginger", "Amchoor"],
    prepTime: "15 mins"
  },
  {
    id: "curry-2",
    title: "Kaju Tomato Curry",
    teluguTitle: "కాజు టొమాటో కర్రీ",
    category: "Veg Curries",
    description: "Rich, velvety cashew-based gravy topped with roasted whole cashews and juicy tomatoes.",
    price: 280,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    isPopular: true,
    ingredients: ["Cashew Nuts", "Tomatoes", "Onion Paste", "Butter", "Kasturi Methi"],
    allergens: ["Dairy", "Nuts"],
    prepTime: "18 mins"
  },
  {
    id: "curry-3",
    title: "Paneer Chatpata Masala",
    teluguTitle: "పనీర్ చటపటా మసాలా",
    category: "Veg Curries",
    description: "Cottage cheese cubes simmered in a hot, tangy gravy with rich North Indian dhaba spices.",
    price: 270,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    ingredients: ["Paneer", "Tangy Masala Sauce", "Capsicum", "Kasuri Methi"],
    allergens: ["Dairy"],
    prepTime: "18 mins"
  },

  // ROTIS/BREADS
  {
    id: "roti-1",
    title: "Butter Naan",
    teluguTitle: "బటర్ నాన్",
    category: "Rotis/Breads",
    description: "Super soft, leavened flatbread baked in our clay tandoor, brushed generously with pure butter.",
    price: 60,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80",
    isPopular: true,
    ingredients: ["Refined Flour", "Milk", "Butter"],
    allergens: ["Dairy", "Gluten"],
    prepTime: "5 mins"
  },
  {
    id: "roti-2",
    title: "Garlic Naan",
    teluguTitle: "గార్లిక్ నాన్",
    category: "Rotis/Breads",
    description: "Clay-oven baked flatbread infused with finely minced aromatic garlic and coriander, glazed with butter.",
    price: 70,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1549467130-f99a2d22220b?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Refined Flour", "Minced Garlic", "Coriander Leaves", "Butter"],
    allergens: ["Dairy", "Gluten"],
    prepTime: "6 mins"
  },
  {
    id: "roti-3",
    title: "Aloo Paratha",
    teluguTitle: "ఆలూ పరాటా",
    category: "Rotis/Breads",
    description: "Whole wheat bread stuffed with seasoned mashed potatoes, roasted on a griddle, served with butter.",
    price: 90,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Whole Wheat Flour", "Potato Stuffing", "Spices", "Ghee"],
    allergens: ["Dairy", "Gluten"],
    prepTime: "10 mins"
  },

  // BIRYANIS
  {
    id: "biryani-1",
    title: "Paneer Biryani",
    teluguTitle: "పనీర్ బిర్యానీ",
    category: "Biryanis",
    description: "Layers of long-grain Basmati rice, marinated paneer cubes, saffron, fried onions, and home-ground spices.",
    price: 290,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    isPopular: true,
    ingredients: ["Basmati Rice", "Paneer", "Saffron", "Rose Water", "Biryani Spices"],
    allergens: ["Dairy"],
    prepTime: "22 mins"
  },
  {
    id: "biryani-2",
    title: "Kaju Biryani",
    teluguTitle: "కాజు బిర్యానీ",
    category: "Biryanis",
    description: "Fragrant basmati rice slow-cooked with fresh premium cashews, rich spices, and fresh herbs in dum style.",
    price: 320,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Basmati Rice", "Roasted Cashew Nuts", "Brown Onions", "Cardamom", "Ghee"],
    allergens: ["Dairy", "Nuts"],
    prepTime: "20 mins"
  },
  {
    id: "biryani-3",
    title: "Kaju Paneer Biryani",
    teluguTitle: "కాజు పనీర్ బిర్యానీ",
    category: "Biryanis",
    description: "Our signature blend combining crispy golden cashews and tender marinated cottage cheese with Dum rice.",
    price: 340,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&auto=format&fit=crop&q=80",
    isChefSpecial: true,
    ingredients: ["Basmati Rice", "Paneer", "Cashew Nuts", "Dum Spices", "Kevra Water"],
    allergens: ["Dairy", "Nuts"],
    prepTime: "24 mins"
  },

  // DESSERTS
  {
    id: "dessert-1",
    title: "Gulab Jamun",
    teluguTitle: "గులాబ్ జామున్",
    category: "Desserts",
    description: "Soft, warm evaporated milk dumplings fried and soaked in cardamom-infused sugar syrup.",
    price: 90,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
    ingredients: ["Mawa", "Refined Flour", "Sugar Syrup", "Cardamom", "Rose Water"],
    allergens: ["Dairy", "Gluten"],
    prepTime: "5 mins"
  },

  // BEVERAGES
  {
    id: "bev-1",
    title: "Sweet Lassi",
    teluguTitle: "స్వీట్ లస్సీ",
    category: "Beverages",
    description: "Creamy, chilled yoghurt shake sweetened with sugar, flavored with cardamom, and served in clay glasses.",
    price: 80,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80",
    isPopular: true,
    ingredients: ["Yoghurt", "Sugar", "Cardamom", "Pistachio garnish"],
    allergens: ["Dairy", "Nuts"],
    prepTime: "5 mins"
  }
];
