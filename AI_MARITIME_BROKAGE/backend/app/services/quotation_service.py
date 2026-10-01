from app.agents.route_agent import RouteAgent
from app.agents.pricing_agent import PricingAgent


class QuotationService:
    """
    Coordinates the Route Agent and Pricing Agent
    to generate a complete freight quotation.

    Flow:
        Customer Request
              ↓
        Route Agent → Best Route
              ↓
        Pricing Agent → Cost Breakdown
              ↓
        Quotation Generated
    """

    def __init__(self):
        self.route_agent = RouteAgent()
        self.pricing_agent = PricingAgent()

    def generate_quotation(
        self,
        origin,
        destination,
        cargo_type,
        containers
    ):
        """
        Generate a complete quotation for a shipment.

        Parameters:
            origin: Origin port name
            destination: Destination port name
            cargo_type: Type of cargo
            containers: Number of containers

        Returns:
            Complete quotation dictionary with routing,
            pricing, and freight calculations
        """

        # Step 1: Ask Route Agent for the best route
        route_result = self.route_agent.analyze_route(
            origin=origin,
            destination=destination,
            cargo_type=cargo_type,
            containers=containers
        )

        # Stop if no route found
        if route_result.get("routes_found", 0) == 0:
            return {
                "status": "not_found",
                "message": (
                    f"No route found from {origin} "
                    f"to {destination}"
                )
            }

        # Step 2: Extract the best route
        best_route = None
        for route in route_result["routes"]:
            if route.get("is_best"):
                best_route = route
                break

        if not best_route:
            best_route = route_result["routes"][0]

        # Step 3: Get pricing data from Pricing Agent
        base_freight = best_route.get(
            "cost_per_container",
            best_route.get("total_cost", 0) / max(containers, 1)
        )

        pricing_result = self.pricing_agent.calculate_pricing(
            route_id=best_route["route_id"],
            base_freight=base_freight
        )

        # Step 4: Calculate freight
        if pricing_result["status"] == "success":
            freight_per_container = pricing_result[
                "demand_adjusted_cost_usd"
            ]
        else:
            # Fallback: use base freight if no pricing data
            freight_per_container = base_freight

        total_freight = freight_per_container * containers

        # Step 5: Build alternative route quotations
        alternatives = []
        for route in route_result["routes"]:
            if route["route_id"] == best_route["route_id"]:
                continue

            alt_base = route.get(
                "cost_per_container",
                route.get("total_cost", 0) / max(containers, 1)
            )
            alt_pricing = self.pricing_agent.calculate_pricing(
                route_id=route["route_id"],
                base_freight=alt_base
            )

            if alt_pricing["status"] == "success":
                alt_freight = alt_pricing["demand_adjusted_cost_usd"]
            else:
                alt_freight = alt_base

            alternatives.append({
                "route_id": route["route_id"],
                "via": route.get("via", "Direct"),
                "transit_days": route["transit_days"],
                "distance_nm": route["distance_nm"],
                "transshipments": route["transshipments"],
                "score": route["score"],
                "freight_per_container_usd": round(
                    alt_freight, 2
                ),
                "total_freight_usd": round(
                    alt_freight * containers, 2
                ),
            })

        # Step 6: Create quotation response
        quotation = {
            "status": "success",

            "origin": origin,
            "destination": destination,
            "cargo_type": cargo_type,
            "containers": containers,

            "recommended_route": best_route["route_id"],
            "route_type": best_route.get("via", "Direct"),
            "route_score": best_route["score"],

            "transit_time_days": best_route["transit_days"],
            "distance_nm": best_route["distance_nm"],
            "transshipments": best_route["transshipments"],

            "freight_per_container_usd": round(
                freight_per_container, 2
            ),
            "total_freight_usd": round(
                total_freight, 2
            ),

            "pricing_breakdown": (
                pricing_result
                if pricing_result["status"] == "success"
                else None
            ),

            "candidate_routes": route_result["routes_found"],
            "alternatives": alternatives,

            "recommendation": route_result.get(
                "recommendation", ""
            ),

            "message": "Quotation generated successfully."
        }

        return quotation
