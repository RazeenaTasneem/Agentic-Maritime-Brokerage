from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.models import RouteRequest, QuotationRequest, PDFQuotationRequest
from app.agents.route_agent import RouteAgent
from app.services.quotation_service import QuotationService
from app.services.pdf_service import PDFService


app = FastAPI(
    title="Agentic Maritime Brokerage Platform",
    description="AI-powered maritime freight quotation platform",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


route_agent = RouteAgent()
quotation_service = QuotationService()
pdf_service = PDFService()


@app.get("/")
def home():
    return {
        "message": "Agentic Maritime Brokerage API is running",
        "project": "Maritime Freight Quotation Platform",
        "milestone": "Milestone 1 - Route Intelligence"
    }


@app.post("/api/routes/analyze")
def analyze_route(request: RouteRequest):

    result = route_agent.analyze_route(
        origin=request.origin,
        destination=request.destination,
        cargo_type=request.cargo_type,
        containers=request.containers
    )

    return result


@app.post("/api/quotations/generate")
def generate_quotation(request: QuotationRequest):

    result = quotation_service.generate_quotation(
        origin=request.origin,
        destination=request.destination,
        cargo_type=request.cargo_type,
        containers=request.containers
    )

    return result


@app.post("/api/quotations/download-pdf")
def download_quotation_pdf(request: PDFQuotationRequest):
    pdf_bytes = pdf_service.generate_quotation_pdf(request.dict())
    filename = f"quotation_{request.id or 'QT'}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

