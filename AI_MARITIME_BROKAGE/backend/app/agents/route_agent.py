import os
import pandas as pd


class RouteAgent:
    """
    Route Intelligence Agent

    Analyzes available shipping routes between origin and destination,
    scores them using weighted multi-factor analysis, and recommends
    the best route.

    Scoring Weights:
        Transit Time:    40%
        Cost:            30%
        Transshipments:  30%
    """

    def __init__(self):

        # Find the project root directory
        current_file = os.path.abspath(__file__)

        project_root = os.path.dirname(
            os.path.dirname(
                os.path.dirname(current_file)
            )
        )

        # Location of our route dataset
        self.dataset_path = os.path.join(
            project_root,
            "app",
            "data",
            "routes.csv"
        )

        # Load route dataset
        self.routes = pd.read_csv(self.dataset_path)

    def analyze_route(
        self,
        origin,
        destination,
        cargo_type,
        containers
    ):
        """
        Analyze available routes for a shipment request.

        Parameters:
            origin: Origin port name
            destination: Destination port name
            cargo_type: Type of cargo being shipped
            containers: Number of containers

        Returns:
            Dictionary with route analysis results including
            scored routes, alternatives, and recommendation
        """

        # 1. Find routes matching origin and destination
        matching_routes = self.routes[
            (self.routes["origin"].str.lower() == origin.lower())
            &
            (self.routes["destination"].str.lower() == destination.lower())
        ].copy()

        # 2. Handle no route found
        if matching_routes.empty:
            return {
                "routes_found": 0,
                "routes": [],
                "recommendation": (
                    f"No routes found from {origin} to "
                    f"{destination}. Please try a different "
                    f"origin/destination pair."
                )
            }

        # 3. Calculate scores using min-max normalization
        max_transit = matching_routes["transit_days"].max()
        min_transit = matching_routes["transit_days"].min()
        max_cost = matching_routes["base_freight_usd"].max()
        min_cost = matching_routes["base_freight_usd"].min()

        def calc_score(row):
            # Transit score (40% weight) — lower is better
            t_norm = (
                (row["transit_days"] - min_transit)
                / (max_transit - min_transit)
                if max_transit != min_transit
                else 0
            )

            # Cost score (30% weight) — lower is better
            c_norm = (
                (row["base_freight_usd"] - min_cost)
                / (max_cost - min_cost)
                if max_cost != min_cost
                else 0
            )

            # Transshipment penalty (30% weight)
            ts_penalty = row["transshipments"] * 0.15

            # Overall score: 100 minus weighted penalties
            raw = 100 - (
                t_norm * 40
                + c_norm * 30
                + ts_penalty * 30
            )
            return round(max(raw, 0), 1)

        def calc_transit_score(row):
            t_norm = (
                (row["transit_days"] - min_transit)
                / (max_transit - min_transit)
                if max_transit != min_transit
                else 0
            )
            return round(100 - t_norm * 100, 2)

        def calc_cost_score(row):
            c_norm = (
                (row["base_freight_usd"] - min_cost)
                / (max_cost - min_cost)
                if max_cost != min_cost
                else 0
            )
            return round(100 - c_norm * 100, 2)

        def calc_transshipment_score(row):
            return round(
                max(100 - row["transshipments"] * 20, 0),
                2
            )

        matching_routes["score"] = matching_routes.apply(
            calc_score, axis=1
        )
        matching_routes["transit_score"] = matching_routes.apply(
            calc_transit_score, axis=1
        )
        matching_routes["cost_score"] = matching_routes.apply(
            calc_cost_score, axis=1
        )
        matching_routes["transshipment_score"] = matching_routes.apply(
            calc_transshipment_score, axis=1
        )

        # 4. Sort by overall score (descending)
        matching_routes = matching_routes.sort_values(
            "score", ascending=False
        )

        best_id = matching_routes.iloc[0]["route_id"]

        # 5. Build routes list with full details
        routes_list = []
        for rank, (_, row) in enumerate(
            matching_routes.iterrows(), start=1
        ):
            total_cost = float(row["base_freight_usd"]) * containers

            routes_list.append({
                "route_id": row["route_id"],
                "route_name": f"{origin} → {destination}",
                "via": row.get("route_type", "Direct"),
                "transit_days": int(row["transit_days"]),
                "distance_nm": int(row["distance_nm"]),
                "transshipments": int(row["transshipments"]),
                "cost_per_container": float(
                    row["base_freight_usd"]
                ),
                "total_cost": total_cost,
                "score": float(row["score"]),
                "rank": rank,
                "is_best": row["route_id"] == best_id,
                "score_breakdown": {
                    "transit_score": float(
                        row["transit_score"]
                    ),
                    "cost_score": float(
                        row["cost_score"]
                    ),
                    "transshipment_score": float(
                        row["transshipment_score"]
                    ),
                },
            })

        best = routes_list[0]
        recommendation = (
            f"Recommended Route {best['route_id']}: "
            f"{best['transit_days']} days transit, "
            f"{best['distance_nm']} NM distance, "
            f"{best['transshipments']} transshipment(s), "
            f"${best['total_cost']:,.0f} total cost for "
            f"{containers} container(s). "
            f"Selected based on best overall score "
            f"({best['score']})."
        )

        return {
            "routes_found": len(routes_list),
            "candidate_routes": len(routes_list),
            "routes": routes_list,
            "recommendation": recommendation,
        }
