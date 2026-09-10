from fastapi import FastAPI
from users.router import router as accounts_router
from todos.router import router as todos_router
from fastapi.middleware.cors import CORSMiddleware
from decouple import config

app = FastAPI(
    title="TodoApp API",
    description="This is a sample Todo FastAPI application.",
    version="1.0.0",
)

frontend_url = config("FRONTEND_URL", default="http://localhost:5173").rstrip("/")
allowed_origins = list({frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"})

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the TodoApp API!"}


app.include_router(accounts_router, tags=["Users"])
app.include_router(todos_router, tags=["Todos"])