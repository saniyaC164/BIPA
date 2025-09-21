from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React + Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
async def read_root():
    return {"message": "Hello from FastAPI!"}

df = pd.read_csv("transactions.csv", sep=";")  # change delimiter if needed

@app.get("/kpi/total_revenue")
def total_revenue():
    total = df["Total_Bill"].sum()
    return {"total_revenue": round(total, 2)}

@app.get("/kpi/top_products")
def top_products():
    top = (
        df.groupby("product_detail")["transaction_qty"]
        .sum()
        .sort_values(ascending=False)
        .head(5)
        .reset_index()
        .to_dict(orient="records")
    )
    return {"top_products": top}

@app.get("/kpi/sales_by_hour")
def sales_by_hour():
    hourly = (
        df.groupby("Hour")["Total_Bill"]
        .sum()
        .reset_index()
        .to_dict(orient="records")
    )
    return {"sales_by_hour": hourly}