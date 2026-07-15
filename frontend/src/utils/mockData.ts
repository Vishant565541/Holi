export interface HelicopterListing {
  id: string;
  name: string;
  model: string;
  tagline: string;
  price: number;
  capacity: number;
  speed: string;
  range: string;
  safetyRating: string;
  description: string;
  image: string;
  features: string[];
  specs: { [key: string]: string };
  schedules: string[];
  reviews: { author: string; rating: number; text: string; date: string }[];
}

export interface TourPackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  duration: string;
  rating: number;
  image: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; desc: string; stay: string; transport: string }[];
  reviews: { author: string; rating: number; text: string; date: string }[];
}

export interface HotelListing {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
  rooms: { name: string; price: number; capacity: string; size: string; features: string[] }[];
  reviews: { author: string; rating: number; text: string; date: string }[];
}

export interface BoatListing {
  id: string;
  name: string;
  location: string;
  price: number;
  capacity: number;
  duration: string;
  image: string;
  type: string;
  features: string[];
  reviews: { author: string; rating: number; text: string; date: string }[];
}

export const HELICOPTERS: HelicopterListing[] = [
  {
    id: "h-1",
    name: "Himalayan Sanctuary Charter",
    model: "Airbus H145 luxury",
    tagline: "Uncompromising comfort for elite high-altitude excursions",
    price: 245000,
    capacity: 4,
    speed: "240 km/h",
    range: "650 km",
    safetyRating: "5.0/5.0",
    description: "The Airbus H145 is the pinnacle of luxury aviation engineering. Featuring a spacious, vibration-isolated executive cabin, club-seating configurations, and large panoramic windows, it is the premier choice for VIP transfers to holy sanctuaries and high-altitude mountain locations.",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600&auto=format&fit=crop",
    features: ["Noise Cancellation Cabin", "Climate Control", "Panoramic Glass Windows", "Refreshment Bar", "VIP Lounge Boarding"],
    specs: {
      "Engine Type": "Dual Safran Arriel 2E",
      "Max Takeoff Weight": "3,700 kg",
      "Cabin Volume": "6.0 m³",
      "Avionics Suite": "Helionix digital cockpit",
      "Altitude Ceiling": "20,000 ft",
    },
    schedules: ["07:30 AM", "09:45 AM", "01:30 PM", "04:15 PM"],
    reviews: [
      { author: "Aditya Roy", rating: 5, text: "Flawless service. The landing near Kedarnath was incredibly smooth, and the views from the cabin were majestic.", date: "2026-06-12" },
      { author: "Sarah Jenkins", rating: 5, text: "A top-tier luxury charter. Exceeded my expectations in noise containment and comfort.", date: "2026-05-30" },
    ],
  },
  {
    id: "h-2",
    name: "Amalfi Coastline Interceptor",
    model: "Bell 429 GlobalRanger",
    tagline: "Twin-engine security combined with elegant Italian design aesthetics",
    price: 185000,
    capacity: 6,
    speed: "273 km/h",
    range: "720 km",
    safetyRating: "4.9/5.0",
    description: "Perfect for coastal cruising and dynamic island hopping. The Bell 429 offers state-of-the-art flight dynamics with an expansive flat-floor cabin that accommodates up to six passengers in full executive luxury.",
    image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=600&auto=format&fit=crop",
    features: ["Leather Club Seats", "LED Ambient Lighting", "Integrated Bluetooth Audio", "Extra Luggage Space", "Premium Snacks"],
    specs: {
      "Engine Type": "Pratt & Whitney PW207D1",
      "Max Takeoff Weight": "3,175 kg",
      "Cabin Volume": "5.8 m³",
      "Avionics Suite": "BFE Integrated Flight deck",
      "Altitude Ceiling": "18,700 ft",
    },
    schedules: ["08:00 AM", "11:00 AM", "02:30 PM", "05:00 PM"],
    reviews: [
      { author: "Elena Rossi", rating: 5, text: "We chartered this for our coastal anniversary trip. A memory of a lifetime.", date: "2026-06-25" },
    ],
  },
  {
    id: "h-3",
    name: "Urban VIP shuttle",
    model: "AugustaWestland AW109",
    tagline: "Swift, aerodynamic executive transport for business and transit",
    price: 160000,
    capacity: 5,
    speed: "285 km/h",
    range: "930 km",
    safetyRating: "4.9/5.0",
    description: "Built for speed and sleek aesthetic refinement, the AW109 features a highly retractable landing gear and aerodynamically streamlined build. Navigate urban traffic lanes and regional flyovers instantly.",
    image: "https://images.unsplash.com/photo-1498084393753-b411b2d26b34?q=80&w=600&auto=format&fit=crop",
    features: ["Super Silent Blades", "Mini Dining Table", "In-flight Wi-Fi", "Champagne Service", "Concierge Assist"],
    specs: {
      "Engine Type": "Pratt & Whitney PW206C",
      "Max Takeoff Weight": "3,000 kg",
      "Cabin Volume": "5.0 m³",
      "Avionics Suite": "Collins 3-Axis Duplex Autopilot",
      "Altitude Ceiling": "15,000 ft",
    },
    schedules: ["09:00 AM", "12:15 PM", "03:00 PM", "06:30 PM"],
    reviews: [
      { author: "Vikram Singhania", rating: 5, text: "The fastest airport transfer imaginable. Essential for busy executives.", date: "2026-06-18" },
    ],
  },
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: "p-1",
    name: "Himalayan Sacred Peaks Pilgrimage",
    tagline: "A majestic spiritual flight through Badrinath, Kedarnath & Gangotri",
    price: 499000,
    duration: "3 Days / 2 Nights",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop",
    inclusions: [
      "VIP Priority Darshan slots",
      "Private Airbus H145 helicopter charter",
      "5-Star accommodation at luxury mountain lodges",
      "Bespoke premium high-altitude catering",
      "Dedicated professional local guides & historians",
    ],
    exclusions: [
      "Personal spiritual offerings (Shringar puja kit)",
      "Alcoholic drinks at altitude temples",
      "International flights to Dehradun",
    ],
    itinerary: [
      {
        day: 1,
        title: "Departure Dehradun to Kedarnath Sanctuary",
        desc: "Morning takeoff from Sahastradhara helipad. Soar over snow-capped ridges of the Garhwal range, landing directly at Kedarnath base. Escorted VIP Darshan, followed by gourmet sunset dinner at the Himalayan Retreat.",
        stay: "Himalayan Sanctuary Retreat, Kedarnath",
        transport: "Airbus H145 helicopter & private Audi SUV transfer",
      },
      {
        day: 2,
        title: "Flight of the Gods: Kedarnath to Badrinath Valley",
        desc: "Wake up to ambient mountain soundscapes. Fly past the majestic Neelkanth Peak to the sacred Badrinath valley. Special private Vishnu prayer ceremonies and relaxing dip in hot springs.",
        stay: "Sarovar Luxury Suites, Badrinath",
        transport: "Airbus H145 helicopter",
      },
      {
        day: 3,
        title: "Alaknanda Flyover & Return to Dehradun",
        desc: "A mesmerizing morning flyover of the Devprayag confluence where Bhagirathi and Alaknanda form the Holy Ganges. Return landing and transfer to Dehradun Airport.",
        stay: "N/A",
        transport: "Airbus H145 helicopter",
      },
    ],
    reviews: [
      { author: "Manish Sharma", rating: 5, text: "A truly divine experience, handled with the utmost dignity and comfort.", date: "2026-06-05" },
    ],
  },
  {
    id: "p-2",
    name: "Goan Coastline Yacht & Sky Odyssey",
    tagline: "A double-luxury package covering panoramic flights and private yacht rentals",
    price: 350000,
    duration: "2 Days / 1 Night",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop",
    inclusions: [
      "2-Hour Scenic helicopter shoreline tour",
      "6-Hour Luxury yacht cruise with private chef",
      "Overnight stay at beach villa at Taj Exotica",
      "Champagne sunset dinner aboard",
      "Limousine pickup & drop services",
    ],
    exclusions: ["Jetski rentals", "Tips for yacht crew"],
    itinerary: [
      {
        day: 1,
        title: "Coastal Sky Tour & Villa Check-in",
        desc: "VIP airport pickup via Mercedes S-Class. Takeoff for a 2-hour helicopter flight along Goa's golden shoreline, tracking historic Portuguese forts. Relax in your private villa pool.",
        stay: "Taj Exotica beachfront villa, Goa",
        transport: "Bell 429 helicopter & Limousine",
      },
      {
        day: 2,
        title: "Yacht Cruise: Island Concourse",
        desc: "Embark on our luxury 75ft catamaran. Sail into the deep ocean with an open bar, snorkeling gear, and freshly prepared seafood. Return in the evening for airport transit.",
        stay: "N/A",
        transport: "AURA Yacht & Private Luxury Van",
      },
    ],
    reviews: [
      { author: "Karan Johar", rating: 5, text: "Unmatched luxury. The yacht chef served a Michelin-quality dinner.", date: "2026-06-20" },
    ],
  },
];

export const HOTELS: HotelListing[] = [
  {
    id: "ht-1",
    name: "Taj Lake Palace",
    location: "Udaipur, Rajasthan",
    price: 75000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop",
    amenities: ["Private Boat Transfers", "Jiva Luxury Spa", "Butler Service", "Royal Dining Halls", "Historic Lake Views"],
    rooms: [
      { name: "Palace Suite (Lake View)", price: 75000, capacity: "2 Adults", size: "650 sq ft", features: ["King Bed", "Historic Artwork", "Heritage Balcony"] },
      { name: "Grand Royal Suite", price: 120000, capacity: "2 Adults + 1 Child", size: "1100 sq ft", features: ["Antique Furnishings", "Personal Butler", "Full Lake Panorama"] },
    ],
    reviews: [
      { author: "Rajesh K.", rating: 5, text: "An absolute dream. Floating on Lake Pichola in complete luxury.", date: "2026-06-01" },
    ],
  },
  {
    id: "ht-2",
    name: "Aman-i-Khas Wilds",
    location: "Ranthambore, Rajasthan",
    price: 95000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?q=80&w=600&auto=format&fit=crop",
    amenities: ["Tiger Safari Escorts", "Luxury Canvas Tents", "Organic Campfire Dining", "Aurvedic Massages", "Private Helipad access"],
    rooms: [
      { name: "Luxury Wilderness Canopy", price: 95000, capacity: "2 Adults", size: "1000 sq ft", features: ["Freestanding Tub", "Sundeck", "Air conditioning", "Bedside Lounge"] },
    ],
    reviews: [
      { author: "Sophia M.", rating: 5, text: "The perfect mix of wilderness and luxury. Saw three tigers!", date: "2026-05-15" },
    ],
  },
];

export const BOATS: BoatListing[] = [
  {
    id: "b-1",
    name: "AURA Prestige 75 Yacht",
    location: "Goa Harbor, Goa",
    price: 45000,
    capacity: 12,
    duration: "Per Hour (Min 3 hrs)",
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=600&auto=format&fit=crop",
    type: "Motor Yacht",
    features: ["Flybridge Sunbed", "Dual Luxury Cabins", "Jet Ski Attachment", "Sound System", "Crew of 4 included"],
    reviews: [
      { author: "Deepak S.", rating: 5, text: "Outstanding yacht. Ideal for sunset cruising with champagne.", date: "2026-06-10" },
    ],
  },
  {
    id: "b-2",
    name: "Kerala Backwaters Sovereign Suite",
    location: "Alleppey, Kerala",
    price: 85000,
    capacity: 6,
    duration: "Full Day / Overnight",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=600&auto=format&fit=crop",
    type: "Luxury Houseboat",
    features: ["Glass walled lounge", "Sprawling Upper Deck", "Traditional Chefs onboard", "Full AC Cabins"],
    reviews: [
      { author: "Priya Menon", rating: 5, text: "So peaceful. Floating past coco palms in absolute luxury.", date: "2026-06-22" },
    ],
  },
];
