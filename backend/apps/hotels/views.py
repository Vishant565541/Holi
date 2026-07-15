from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Hotel
from .serializers import HotelSerializer
from .booking_client import BookingDemandClient

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    @action(detail=False, methods=['post', 'get'], url_path='search')
    def search(self, request):
        # Allow POST or GET. If GET, fetch from query params; if POST, fetch from request body.
        data = request.data if request.method == 'POST' else request.query_params
        
        destination = data.get('destination', 'Udaipur')
        checkin = data.get('checkin', '2026-07-10')
        checkout = data.get('checkout', '2026-07-15')
        try:
            guests = int(data.get('guests', 2))
        except ValueError:
            guests = 2

        client = BookingDemandClient()
        # 1. Search availability
        search_res = client.search_accommodations(destination, checkin, checkout, guests)
        
        # 2. Resolve details for the found accommodations
        acc_ids = [item['id'] for item in search_res.get('data', [])]
        details_res = client.get_accommodation_details(acc_ids)
        
        # Combine search and details to return a rich list
        combined_results = []
        details_map = {item['id']: item for item in details_res.get('data', [])}
        
        for search_item in search_res.get('data', []):
            acc_id = search_item['id']
            detail_item = details_map.get(acc_id, {})
            
            # Map mock details and pricing together in a unified format
            # compatible with both Booking.com structure and frontend representation
            combined_results.append({
                "id": str(acc_id),
                "name": detail_item.get("name", {}).get("en", f"Hotel {acc_id}"),
                "description": detail_item.get("description", {}).get("en", ""),
                "location": detail_item.get("location", {}).get("address", detail_item.get("location", {}).get("city", "India")),
                "rating": str(detail_item.get("rating", {}).get("score", 5.0)),
                "price": float(search_item.get("price", {}).get("total", {}).get("booker_currency", 10000.0)),
                "image": detail_item.get("photos", [{}])[0].get("url", ""),
                "amenities": [f["name"] for f in detail_item.get("facilities", [])],
                # Map specific products/rooms
                "rooms": [
                    {
                        "name": r["name"]["en"],
                        # Match rooms with corresponding price
                        "price": float(next((p["price"]["total"]["booker_currency"] for p in search_item.get("products", []) if p["id"].endswith(r["id"])), 10000.0)),
                        "capacity": "2 Adults",
                        "size": r["description"]["en"].split(" featuring ")[0] if " featuring " in r["description"]["en"] else "600 sq ft",
                        "features": r["description"]["en"].split(" featuring ")[1].rstrip(".").split(", ") if " featuring " in r["description"]["en"] else []
                    }
                    for r in detail_item.get("rooms", [])
                ]
            })

        return Response(combined_results, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='locations')
    def locations(self, request):
        query = request.query_params.get('query', '')
        client = BookingDemandClient()
        results = client.get_locations(query)
        return Response(results, status=status.HTTP_200_OK)

