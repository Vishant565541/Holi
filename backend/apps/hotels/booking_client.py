import os
import requests
import uuid
from django.conf import settings

# Booking.com Demand API v3.2 Endpoints configuration
BOOKING_AFFILIATE_ID = os.getenv("BOOKING_API_AFFILIATE_ID")
BOOKING_TOKEN = os.getenv("BOOKING_API_TOKEN")

MOCK_ACCOMMODATIONS = {
    10001: {
        "id": 10001,
        "name": {"en": "Taj Lake Palace"},
        "description": {"en": "Floating on the calm waters of Lake Pichola, this majestic 18th-century palace offers ultra-luxury rooms with historic artwork, Jiva Spa, and royal dining halls."},
        "rating": 4.9,
        "location": {
            "city": "Udaipur",
            "address": "Lake Pichola, Udaipur, Rajasthan, India",
            "coordinates": {"latitude": 24.5756, "longitude": 73.6806}
        },
        "photos": [
            {"url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop"},
            {"url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600&auto=format&fit=crop"}
        ],
        "facilities": [
            {"id": 1, "name": "Private Boat Transfers"},
            {"id": 2, "name": "Jiva Luxury Spa"},
            {"id": 3, "name": "Butler Service"},
            {"id": 4, "name": "Royal Dining Halls"},
            {"id": 5, "name": "Historic Lake Views"}
        ],
        "rooms": [
            {
                "id": "room_101",
                "name": "Palace Suite (Lake View)",
                "size": "650 sq ft",
                "capacity": "2 Adults",
                "price": 75000.0,
                "features": ["King Bed", "Historic Artwork", "Heritage Balcony"]
            },
            {
                "id": "room_102",
                "name": "Grand Royal Suite",
                "size": "1100 sq ft",
                "capacity": "2 Adults + 1 Child",
                "price": 120000.0,
                "features": ["Antique Furnishings", "Personal Butler", "Full Lake Panorama"]
            }
        ]
    },
    10002: {
        "id": 10002,
        "name": {"en": "Aman-i-Khas Wilds"},
        "description": {"en": "A sanctuary on the threshold of Ranthambore National Park, Aman-i-Khas is a premium wilderness camp offering guests custom safari escorts, organic campfire dining, and unparalleled comfort in canvas tents."},
        "rating": 5.0,
        "location": {
            "city": "Ranthambore",
            "address": "Ranthambore National Park, Sawai Madhopur, Rajasthan, India",
            "coordinates": {"latitude": 26.0173, "longitude": 76.5026}
        },
        "photos": [
            {"url": "https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?q=80&w=600&auto=format&fit=crop"},
            {"url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop"}
        ],
        "facilities": [
            {"id": 1, "name": "Tiger Safari Escorts"},
            {"id": 2, "name": "Luxury Canvas Tents"},
            {"id": 3, "name": "Organic Campfire Dining"},
            {"id": 4, "name": "Ayurvedic Massages"},
            {"id": 5, "name": "Private Helipad access"}
        ],
        "rooms": [
            {
                "id": "room_201",
                "name": "Luxury Wilderness Canopy",
                "size": "1000 sq ft",
                "capacity": "2 Adults",
                "price": 95000.0,
                "features": ["Freestanding Tub", "Sundeck", "Air conditioning", "Bedside Lounge"]
            }
        ]
    },
    10003: {
        "id": 10003,
        "name": {"en": "The Leela Palace"},
        "description": {"en": "Nestled in lush gardens, this landmark hotel is inspired by the grand architectural heritage of the Royal Palace of Mysore, offering ultra-luxurious suites and dining."},
        "rating": 4.8,
        "location": {
            "city": "Bengaluru",
            "address": "Old Airport Road, Bengaluru, Karnataka, India",
            "coordinates": {"latitude": 12.9606, "longitude": 77.6484}
        },
        "photos": [
            {"url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=600&auto=format&fit=crop"},
            {"url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600&auto=format&fit=crop"}
        ],
        "facilities": [
            {"id": 1, "name": "Outdoor Lagoon Pool"},
            {"id": 2, "name": "Award-winning Dining"},
            {"id": 3, "name": "Private Gym"},
            {"id": 4, "name": "Valet Parking"},
            {"id": 5, "name": "Helipad Access"}
        ],
        "rooms": [
            {
                "id": "room_301",
                "name": "Deluxe Palace Suite",
                "size": "700 sq ft",
                "capacity": "2 Adults",
                "price": 45000.0,
                "features": ["Lagoon Views", "Pillow Menu", "Italian Marble Bath"]
            },
            {
                "id": "room_302",
                "name": "Maharaja Suite",
                "size": "1500 sq ft",
                "capacity": "2 Adults + 2 Children",
                "price": 180000.0,
                "features": ["Bulletproof Glass", "Private Steam Room", "Luxury Dining Area"]
            }
        ]
    },
    10004: {
        "id": 10004,
        "name": {"en": "Taj Exotica Resort & Spa"},
        "description": {"en": "Overlooking the Arabian Sea, this Mediterranean-style oasis is spread across 56 acres of manicured gardens, offering pure beachside luxury and private villa pools."},
        "rating": 4.9,
        "location": {
            "city": "Goa",
            "address": "Benaulim Beach, Salcete, Goa, India",
            "coordinates": {"latitude": 15.2471, "longitude": 73.9238}
        },
        "photos": [
            {"url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&auto=format&fit=crop"},
            {"url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop"}
        ],
        "facilities": [
            {"id": 1, "name": "Beach Access"},
            {"id": 2, "name": "Private Beach Villa Pools"},
            {"id": 3, "name": "Catamaran Cruises"},
            {"id": 4, "name": "Golf Course"},
            {"id": 5, "name": "Ayurvedic Sanctuary"}
        ],
        "rooms": [
            {
                "id": "room_401",
                "name": "Beach Villa with Private Pool",
                "size": "1200 sq ft",
                "capacity": "2 Adults",
                "price": 110000.0,
                "features": ["Plunge Pool", "Outdoor Showers", "Hammock", "Direct Beach Gate"]
            }
        ]
    }
}

class BookingDemandClient:
    """
    Client for Booking.com Demand API v3.2.
    Integrates with official endpoints if credentials are provided;
    otherwise, falls back to a high-fidelity mockup engine.
    """

    def __init__(self):
        self.affiliate_id = BOOKING_AFFILIATE_ID
        self.token = BOOKING_TOKEN
        self.use_live = bool(self.affiliate_id and self.token)
        self.base_url = "https://demandapi-sandbox.booking.com/3.2"

    def _get_headers(self):
        return {
            "Authorization": f"Bearer {self.token}",
            "X-Affiliate-Id": str(self.affiliate_id),
            "Content-Type": "application/json"
        }

    def search_accommodations(self, destination, checkin, checkout, guests=2):
        """
        Implements /accommodations/search
        """
        if self.use_live:
            url = f"{self.base_url}/accommodations/search"
            # Format inputs based on OpenAPI searchInput schema
            payload = {
                "checkin": checkin,
                "checkout": checkout,
                "guests": {
                    "number_of_adults": guests,
                    "number_of_rooms": 1
                },
                "extras": ["extra_charges", "products"]
            }
            try:
                res = requests.post(url, json=payload, headers=self._get_headers())
                if res.status_code == 200:
                    return res.json()
            except Exception as e:
                # Log error and fallback
                pass

        # Mock implementation: filter mock accommodations by destination query
        filtered_data = []
        dest_lower = destination.lower()
        
        # If destination is general or empty, show all hotels
        is_general_query = dest_lower in ["", "india", "all locations", "harbors"]
        
        for acc_id, acc in MOCK_ACCOMMODATIONS.items():
            name_en = acc["name"]["en"].lower()
            city = acc["location"]["city"].lower()
            
            matches = (
                is_general_query or
                dest_lower in name_en or
                dest_lower in city or
                name_en in dest_lower or
                city in dest_lower or
                any(word in name_en or word in city for word in dest_lower.replace(",", " ").split() if len(word) > 2)
            )
            
            if matches:
                # Construct search product
                products = []
                for room in acc["rooms"]:
                    products.append({
                        "id": f"{acc_id}_{room['id']}",
                        "number_of_adults": guests,
                        "policies": {
                            "cancellation": {"type": "free_cancellation_until", "free_cancellation_until": "Flexible"},
                            "meal_plan": {"plan": "breakfast_included"}
                        },
                        "price": {
                            "base": {"booker_currency": room["price"]},
                            "total": {"booker_currency": room["price"]},
                            "display": {"booker_currency": room["price"]}
                        }
                    })

                # Cheapest price
                cheapest_price = min(room["price"] for room in acc["rooms"])

                filtered_data.append({
                    "id": acc_id,
                    "currency": {"accommodation": "INR", "booker": "INR"},
                    "deep_link_url": f"booking://hotel/{acc_id}?checkin={checkin}&checkout={checkout}",
                    "price": {
                        "total": {"booker_currency": cheapest_price},
                        "display": {"booker_currency": cheapest_price}
                    },
                    "products": products,
                    "url": f"https://www.booking.com/hotel/in/{acc['name']['en'].lower().replace(' ', '-')}.html"
                })

        return {
            "request_id": str(uuid.uuid4()),
            "data": filtered_data,
            "metadata": {
                "total_results": len(filtered_data)
            }
        }

    def get_accommodation_details(self, accommodation_ids):
        """
        Implements /accommodations/details
        """
        if self.use_live:
            url = f"{self.base_url}/accommodations/details"
            payload = {
                "accommodations": accommodation_ids,
                "extras": ["photos", "facilities", "description"]
            }
            try:
                res = requests.post(url, json=payload, headers=self._get_headers())
                if res.status_code == 200:
                    return res.json()
            except Exception as e:
                pass

        # Mock implementation: return detailed items matching the IDs requested
        details = []
        for aid in accommodation_ids:
            # Handle list of IDs which could be strings or ints
            try:
                aid_int = int(aid)
            except ValueError:
                continue

            if aid_int in MOCK_ACCOMMODATIONS:
                acc = MOCK_ACCOMMODATIONS[aid_int]
                # Format to look exactly like Booking.com details response
                details.append({
                    "id": acc["id"],
                    "name": acc["name"],
                    "description": acc["description"],
                    "location": acc["location"],
                    "photos": acc["photos"],
                    "facilities": acc["facilities"],
                    "rating": {"score": acc["rating"]},
                    "rooms": [
                        {
                            "id": r["id"],
                            "name": {"en": r["name"]},
                            "description": {"en": f"{r['size']} room featuring {', '.join(r['features'])}."},
                            "max_occupancy": {"adults": 2, "children": 1}
                        }
                        for r in acc["rooms"]
                    ]
                })

        return {
            "request_id": str(uuid.uuid4()),
            "data": details
        }

    def get_locations(self, query):
        """
        Autocomplete search for cities/hotels.
        """
        # Return mock matching items
        q = query.lower() if query else ""
        results = []
        
        # Search cities
        seen_cities = set()
        for acc in MOCK_ACCOMMODATIONS.values():
            city = acc["location"]["city"]
            if (not q or q in city.lower()) and city not in seen_cities:
                seen_cities.add(city)
                results.append({
                    "id": len(results) + 1,
                    "name": city,
                    "type": "city",
                    "country": "India"
                })

            if q and q in acc["name"]["en"].lower():
                results.append({
                    "id": acc["id"],
                    "name": acc["name"]["en"],
                    "type": "hotel",
                    "city": city,
                    "country": "India"
                })

        # Default fallback if query doesn't match and is empty
        if not results:
            results = [
                {"id": 1, "name": "Udaipur", "type": "city", "country": "India"},
                {"id": 2, "name": "Ranthambore", "type": "city", "country": "India"},
                {"id": 3, "name": "Bengaluru", "type": "city", "country": "India"},
                {"id": 4, "name": "Goa", "type": "city", "country": "India"}
            ]

        return results
