from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import router as todos_router
from .database import init_db


def create_app() -> FastAPI:
    app = FastAPI(title="MCP Testing TODO API", version="1.0.0")

    origins = [
        "http://localhost:3000",
        "https://localhost:3000",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def on_startup() -> None:
        init_db()

    @app.get("/health")
    async def health_check():
        return {"status": "ok"}

    app.include_router(todos_router)

    return app


app = create_app()
