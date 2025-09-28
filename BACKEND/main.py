from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from datetime import datetime, timedelta, date
from typing import Optional, List
import uvicorn
app = FastAPI()

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React + Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI is running"}

df = pd.read_csv("DATA/daily_stats.csv", parse_dates=["date"])

# ensure date column is plain date (no time)
df["date"] = pd.to_datetime(df["date"]).dt.date

# guard: make numeric conversions safe
df["total_revenue"] = pd.to_numeric(df["total_revenue"], errors="coerce").fillna(0.0)
df["total_customers"] = pd.to_numeric(df["total_customers"], errors="coerce").fillna(0).astype(int)
df["avg_order_value"] = pd.to_numeric(df["avg_order_value"], errors="coerce").fillna(0.0)

# Load sales data for product / hourly analysis (used by several endpoints)
try:
    sales_df = pd.read_csv("DATA/sales.csv", parse_dates=["date"]) if True else pd.DataFrame()
except Exception:
    # fallback to empty DataFrame with expected columns
    sales_df = pd.DataFrame(columns=["date", "time", "item_name", "category", "quantity", "price", "total"])

if "time" in sales_df.columns:
    # normalize hour column for grouping
    try:
        sales_df["hour"] = sales_df["time"].astype(str).str.split(":").str[0].astype(int)
    except Exception:
        sales_df["hour"] = None

@app.get("/kpi/")
def get_kpi(
    query_date: Optional[str] = Query(None, description="Date in YYYY-MM-DD format (default: today)"),
    window: int = Query(5, ge=1, le=30, description="Number of days to aggregate (default 5)")
):
    if query_date is None:
        end_date = df["date"].max()   # use the most recent date in CSV
    else:
        try:
            end_date = datetime.strptime(query_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Date must be in YYYY-MM-DD format")

    start_date = end_date - timedelta(days=window - 1)
    ...

    # select rows in the date range
    mask = (df["date"] >= start_date) & (df["date"] <= end_date)
    selected = df.loc[mask]

    if selected.empty:
        raise HTTPException(status_code=404, detail=f"No data found between {start_date} and {end_date}")

    total_revenue = float(selected["total_revenue"].sum())
    total_transactions = int(selected["total_customers"].sum())

    # weighted average order value: total_revenue / total_transactions
    avg_order_value = round((total_revenue / total_transactions) if total_transactions else 0.0, 2)

    # round values for nicer display
    total_revenue = round(total_revenue, 2)

    return {
        "display_as_date": end_date.isoformat(),   # the date you asked (displayed as 'today')
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "days_aggregated": int(selected.shape[0]),
        "total_revenue": total_revenue,
        "total_transactions": total_transactions,
        "avg_order_value": avg_order_value
    }


@app.get("/dashboard-data")
def dashboard_data(period: Optional[str] = Query('7d')):
    """Return a compact payload used by the frontend dashboard: kpis, top products, small revenue trend."""
    # use kpi for last 7 days
    try:
        kpi_resp = get_kpi(window=7)
    except Exception:
        kpi_resp = {"total_revenue": 0, "total_transactions": 0, "avg_order_value": 0, "display_as_date": None}

    # top products by revenue
    top_products = []
    if not sales_df.empty:
        prod = sales_df.groupby('item_name').agg({'quantity': 'sum', 'total': 'sum'}).reset_index()
        prod = prod.sort_values('total', ascending=False).head(10)
        top_products = prod.to_dict(orient='records')

    # payment distribution (counts and revenue)
    payment_distribution = []
    if not sales_df.empty and 'payment_method' in sales_df.columns:
        pay = sales_df.groupby('payment_method').agg({'total': 'sum', 'quantity': 'sum'}).reset_index()
        total_rev = pay['total'].sum() if not pay.empty else 0
        for _, r in pay.iterrows():
            pct = float(r['total']) / total_rev * 100 if total_rev else 0
            payment_distribution.append({'method': r['payment_method'], 'revenue': float(r['total']), 'pct': round(pct, 1)})

    # small revenue trend (last 14 days) from daily stats
    trend = []
    try:
        recent = df.sort_values('date').tail(14)
        trend = recent[['date', 'total_revenue']].to_dict(orient='records')
        # convert dates to isoformat
        for r in trend:
            if hasattr(r['date'], 'date'):
                r['date'] = r['date'].date().isoformat()
            elif hasattr(r['date'], 'isoformat'):
                r['date'] = r['date'].isoformat()
    except Exception:
        trend = []

    # compute peak hour and avg order delta for KPIs
    peak_hour = None
    peak_hour_revenue = None
    try:
        if not sales_df.empty:
            # consider same period as kpi (last 7 days)
            end_d = df['date'].max()
            start_d = end_d - timedelta(days=6)
            s = sales_df.copy()
            try:
                s['date'] = pd.to_datetime(s['date']).dt.date
            except Exception:
                pass
            mask = (s['date'] >= start_d) & (s['date'] <= end_d)
            s = s.loc[mask]
            if 'hour' not in s.columns and 'time' in s.columns:
                try:
                    s['hour'] = s['time'].astype(str).str.split(':').str[0].astype(int)
                except Exception:
                    s['hour'] = 0

            grp_h = s.groupby('hour').agg({'quantity': 'sum', 'total': 'sum'}).reset_index()
            if not grp_h.empty:
                top = grp_h.sort_values('quantity', ascending=False).iloc[0]
                peak_hour = int(top['hour']) if pd.notna(top['hour']) else None
                peak_hour_revenue = float(top['total']) if pd.notna(top['total']) else None
    except Exception:
        peak_hour = None
        peak_hour_revenue = None

    # average order delta: compare latest day avg_order_value vs previous day
    avg_order_delta = None
    try:
        recent_two = df.sort_values('date').tail(2)
        if recent_two.shape[0] == 2:
            last = float(recent_two.iloc[-1]['avg_order_value'])
            prev = float(recent_two.iloc[-2]['avg_order_value'])
            if prev:
                avg_order_delta = round((last - prev) / prev * 100, 1)
    except Exception:
        avg_order_delta = None

    # attach enrichments to kpi_resp
    try:
        kpi_resp['peak_hour'] = f"{peak_hour}:00" if peak_hour is not None else None
        kpi_resp['peak_hour_revenue'] = round(peak_hour_revenue, 2) if peak_hour_revenue is not None else None
        kpi_resp['avg_order_delta'] = avg_order_delta
    except Exception:
        pass

    return {
        'kpi': kpi_resp,
        'top_products': top_products,
        'revenue_trend': trend,
        'payment_distribution': payment_distribution
    }


@app.get("/revenue-trends")
def revenue_trends(period: str = 'daily', start_date: Optional[str] = None, end_date: Optional[str] = None):
    """Return time series revenue data from daily_stats.csv"""
    data = df.copy()
    if start_date:
        try:
            sd = datetime.strptime(start_date, "%Y-%m-%d").date()
            data = data[data['date'] >= sd]
        except Exception:
            pass
    if end_date:
        try:
            ed = datetime.strptime(end_date, "%Y-%m-%d").date()
            data = data[data['date'] <= ed]
        except Exception:
            pass

    # For now only support daily
    results = data[['date', 'total_revenue']].sort_values('date')
    out = []
    for _, row in results.iterrows():
        d = row['date']
        try:
            out.append({'date': d.isoformat(), 'total_revenue': float(row['total_revenue'])})
        except Exception:
            out.append({'date': str(d), 'total_revenue': float(row['total_revenue'])})

    return {'period': period, 'data': out}


@app.get("/product-analytics")
def product_analytics(top: int = 10):
    """Return top products by revenue/quantity from sales.csv"""
    if sales_df.empty:
        return {'top_products': []}

    prod = sales_df.groupby('item_name').agg({'quantity': 'sum', 'total': 'sum'}).reset_index()
    prod = prod.sort_values('total', ascending=False).head(top)
    # convert dtypes
    prod_list = []
    for _, r in prod.iterrows():
        prod_list.append({'item_name': r['item_name'], 'quantity': int(r['quantity']), 'revenue': float(r['total'])})

    return {'top_products': prod_list}


@app.get("/hourly-analysis")
def hourly_analysis():
    """Return hourly transaction counts and revenue buckets"""
    if sales_df.empty or 'hour' not in sales_df.columns:
        return {'hourly_data': []}

    hr = sales_df.groupby('hour').agg({'quantity': 'sum', 'total': 'sum'}).reset_index().sort_values('hour')
    out = []
    for _, r in hr.iterrows():
        hour = int(r['hour']) if pd.notna(r['hour']) else None
        out.append({'hour': hour, 'quantity': int(r['quantity']), 'revenue': float(r['total'])})

    return {'hourly_data': out}


@app.get("/heatmap")
def heatmap(start_date: Optional[str] = None, end_date: Optional[str] = None):
    """Return a day x hour heatmap (quantity and revenue) aggregated from sales.csv"""
    if sales_df.empty:
        return {'heatmap': []}

    data = sales_df.copy()
    # filter by date range if provided
    if start_date:
        try:
            sd = datetime.strptime(start_date, "%Y-%m-%d").date()
            data = data[pd.to_datetime(data['date']).dt.date >= sd]
        except Exception:
            pass
    if end_date:
        try:
            ed = datetime.strptime(end_date, "%Y-%m-%d").date()
            data = data[pd.to_datetime(data['date']).dt.date <= ed]
        except Exception:
            pass

    # ensure date and hour columns exist
    try:
        data['date'] = pd.to_datetime(data['date'])
    except Exception:
        pass

    if 'hour' not in data.columns and 'time' in data.columns:
        try:
            data['hour'] = data['time'].astype(str).str.split(':').str[0].astype(int)
        except Exception:
            data['hour'] = 0

    data['weekday'] = data['date'].dt.day_name()

    grp = data.groupby(['weekday', 'hour']).agg({'quantity': 'sum', 'total': 'sum'}).reset_index()

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    out = []
    for day in days:
        for hour in range(24):
            row = grp[(grp['weekday'] == day) & (grp['hour'] == hour)]
            if not row.empty:
                qty = int(row['quantity'].iloc[0]) if pd.notna(row['quantity'].iloc[0]) else 0
                rev = float(row['total'].iloc[0]) if pd.notna(row['total'].iloc[0]) else 0.0
            else:
                qty = 0
                rev = 0.0
            out.append({'day': day, 'hour': int(hour), 'value': qty, 'revenue': rev})

    return {'heatmap': out}


@app.get('/feedback-summary')
def feedback_summary():
    """Return a simple feedback summary (positive %). Uses rating if present, otherwise basic keyword sentiment on text."""
    try:
        fb = pd.read_csv('DATA/feedback.csv')
    except FileNotFoundError:
        return {'positive_pct': None, 'count': 0}
    except Exception:
        return {'positive_pct': None, 'count': 0}

    # If structured ratings exist
    if 'rating' in fb.columns:
        fb['rating'] = pd.to_numeric(fb['rating'], errors='coerce')
        total = int(fb['rating'].count())
        if total == 0:
            return {'positive_pct': None, 'count': 0}
        positive = int(fb[fb['rating'] >= 4]['rating'].count())
        pct = round(positive / total * 100, 1)
        return {'positive_pct': pct, 'count': total}

    # Otherwise do a lightweight keyword sentiment on text column
    text_col = None
    for c in ['text', 'feedback', 'comment']:
        if c in fb.columns:
            text_col = c
            break

    if text_col is None:
        return {'positive_pct': None, 'count': fb.shape[0]}

    pos_words = ['good', 'great', 'love', 'excellent', 'amazing', 'delicious', 'nice', 'happy']
    neg_words = ['bad', 'slow', 'terrible', 'awful', 'disappoint', 'cold', 'stale', 'angry']

    def _sent(s: str):
        s = str(s).lower()
        if any(w in s for w in pos_words):
            return 1
        if any(w in s for w in neg_words):
            return -1
        return 0

    fb['s'] = fb[text_col].apply(_sent)
    total = int(fb.shape[0])
    if total == 0:
        return {'positive_pct': None, 'count': 0}
    positive = int((fb['s'] > 0).sum())
    pct = round(positive / total * 100, 1)
    return {'positive_pct': pct, 'count': total}


@app.get("/inventory")
def inventory():
    """Return inventory rows from DATA/inventory.csv"""
    try:
        inv = pd.read_csv("DATA/inventory.csv")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="inventory.csv not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # fill NaNs and convert to native python types where possible
    inv = inv.fillna("")
    records = inv.to_dict(orient='records')

    # helper to convert numpy scalars to python native types
    def _to_native(v):
        try:
            if hasattr(v, 'item'):
                return v.item()
        except Exception:
            pass
        return v

    cleaned = [{k: _to_native(v) for k, v in row.items()} for row in records]
    return {"inventory": cleaned}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)