from pydantic import BaseModel


class RouteRequest(BaseModel):
    origin: str
    destination: str
    cargo_type: str
    containers: int


class QuotationRequest(BaseModel):
    origin: str
    destination: str
    cargo_type: str
    containers: int


class PDFQuotationRequest(BaseModel):
    id: str | None = "QT-2026-891"
    origin: str
    destination: str
    cargo_type: str | None = "General Cargo"
    containers: int = 1
    date: str | None = None
    status: str | None = "Active"
    transit_days: int | None = 14
    distance_nm: int | None = 6450
    route_type: str | None = "Direct Express"
    total_usd: float | None = None
    base_freight: float | None = None
    baf: float | None = None
    origin_thc: float | None = None
    dest_thc: float | None = None
