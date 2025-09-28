import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
from faker import Faker
import csv

# Initialize faker for generating realistic names and data
fake = Faker()

# Configuration
START_DATE = datetime(2024, 1, 1)
END_DATE = datetime(2024, 9, 22)  # Current date
DAYS = (END_DATE - START_DATE).days

# Menu configuration with realistic pricing and costs
MENU_ITEMS = {
    'Coffee': {
        'Cappuccino': {'price': 4.50, 'cost': 1.20, 'prep_time': 3},
        'Latte': {'price': 5.00, 'cost': 1.50, 'prep_time': 4},
        'Americano': {'price': 3.50, 'cost': 0.90, 'prep_time': 2},
        'Espresso': {'price': 2.50, 'cost': 0.70, 'prep_time': 1},
        'Mocha': {'price': 5.50, 'cost': 1.80, 'prep_time': 5},
        'Cold Brew': {'price': 4.00, 'cost': 1.10, 'prep_time': 2}
    },
    'Food': {
        'Croissant': {'price': 3.25, 'cost': 1.10, 'prep_time': 1},
        'Sandwich': {'price': 7.50, 'cost': 3.20, 'prep_time': 5},
        'Muffin': {'price': 3.75, 'cost': 1.40, 'prep_time': 1},
        'Bagel': {'price': 4.25, 'cost': 1.60, 'prep_time': 3},
        'Cake Slice': {'price': 4.75, 'cost': 2.10, 'prep_time': 1},
        'Salad': {'price': 8.50, 'cost': 3.80, 'prep_time': 4}
    },
    'Beverages': {
        'Fresh Juice': {'price': 4.25, 'cost': 1.90, 'prep_time': 2},
        'Smoothie': {'price': 6.00, 'cost': 2.50, 'prep_time': 4},
        'Tea': {'price': 2.75, 'cost': 0.60, 'prep_time': 2},
        'Hot Chocolate': {'price': 4.00, 'cost': 1.30, 'prep_time': 3}
    }
}

STAFF_NAMES = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emma Wilson', 'Alex Brown']
PAYMENT_METHODS = ['Card', 'Cash', 'Mobile Pay']
WEATHER_CONDITIONS = ['Sunny', 'Rainy', 'Cloudy', 'Foggy']

# Inventory items
INVENTORY_ITEMS = [
    {'name': 'Coffee Beans', 'category': 'Supplies', 'unit_cost': 12.50, 'reorder_level': 10},
    {'name': 'Milk', 'category': 'Dairy', 'unit_cost': 2.80, 'reorder_level': 5},
    {'name': 'Sugar', 'category': 'Supplies', 'unit_cost': 0.80, 'reorder_level': 5},
    {'name': 'Bread', 'category': 'Food', 'unit_cost': 1.20, 'reorder_level': 8},
    {'name': 'Cheese', 'category': 'Dairy', 'unit_cost': 4.50, 'reorder_level': 3},
    {'name': 'Vegetables', 'category': 'Fresh', 'unit_cost': 3.20, 'reorder_level': 5},
    {'name': 'Flour', 'category': 'Baking', 'unit_cost': 2.10, 'reorder_level': 15},
    {'name': 'Chocolate', 'category': 'Baking', 'unit_cost': 6.80, 'reorder_level': 2}
]

def generate_sales_data():
    """Generate realistic sales transaction data"""
    sales_data = []
    
    for day in range(DAYS):
        current_date = START_DATE + timedelta(days=day)
        
        # Weekend boost (20% more customers)
        is_weekend = current_date.weekday() >= 5
        base_customers = random.randint(80, 150)
        if is_weekend:
            daily_customers = int(base_customers * 1.2)
        else:
            daily_customers = base_customers
            
        # Seasonal adjustments
        month = current_date.month
        seasonal_multiplier = 1.0
        if month in [12, 1, 2]:  # Winter - more hot drinks
            seasonal_multiplier = 1.1
        elif month in [6, 7, 8]:  # Summer - more cold drinks
            seasonal_multiplier = 1.05
            
        daily_customers = int(daily_customers * seasonal_multiplier)
        
        for _ in range(daily_customers):
            # Generate realistic time distribution (peak hours)
            hour_weights = [1, 1, 1, 1, 1, 1, 8, 12, 10, 6, 4, 8, 12, 8, 6, 4, 6, 8, 6, 4, 2, 2, 1, 1]
            hour = random.choices(range(24), weights=hour_weights)[0]
            minute = random.randint(0, 59)
            time_str = f"{hour:02d}:{minute:02d}"
            
            # Select items (1-3 items per transaction)
            num_items = random.choices([1, 2, 3], weights=[60, 30, 10])[0]
            
            for _ in range(num_items):
                # Choose category based on time of day
                if hour < 11:  # Morning - more coffee
                    category = random.choices(['Coffee', 'Food', 'Beverages'], weights=[70, 25, 5])[0]
                elif hour < 15:  # Lunch - more food
                    category = random.choices(['Coffee', 'Food', 'Beverages'], weights=[40, 50, 10])[0]
                else:  # Afternoon/Evening - balanced
                    category = random.choices(['Coffee', 'Food', 'Beverages'], weights=[50, 30, 20])[0]
                
                # Seasonal item preferences
                if month in [12, 1, 2] and category == 'Coffee':
                    # Winter: prefer hot drinks
                    item_name = random.choice(['Cappuccino', 'Latte', 'Mocha', 'Hot Chocolate'])
                elif month in [6, 7, 8] and category == 'Coffee':
                    # Summer: more cold brew
                    item_name = random.choices(list(MENU_ITEMS[category].keys()), 
                                             weights=[15, 15, 10, 5, 10, 45])[0]
                else:
                    item_name = random.choice(list(MENU_ITEMS[category].keys()))
                
                quantity = random.choices([1, 2], weights=[85, 15])[0]
                # Ensure the item's actual category is used for lookup. Some seasonal choices
                # (e.g. 'Hot Chocolate') live in a different category than the one selected
                # earlier. Find the real category to avoid KeyError.
                actual_category = None
                for cat, items in MENU_ITEMS.items():
                    if item_name in items:
                        actual_category = cat
                        break
                if actual_category is None:
                    # Fallback: keep chosen category (this shouldn't normally happen)
                    actual_category = category

                price = MENU_ITEMS[actual_category][item_name]['price']
                total = round(quantity * price, 2)
                
                sales_data.append({
                    'date': current_date.strftime('%Y-%m-%d'),
                    'time': time_str,
                    'item_name': item_name,
                    'category': actual_category,
                    'quantity': quantity,
                    'price': price,
                    'total': total,
                    'payment_method': random.choice(PAYMENT_METHODS),
                    'staff_name': random.choice(STAFF_NAMES)
                })
    
    return pd.DataFrame(sales_data)

def generate_feedback_data():
    """Generate customer feedback data"""
    feedback_data = []
    
    # Generate 3-5 feedback entries per week
    for week in range(0, DAYS, 7):
        num_feedback = random.randint(3, 5)
        
        for _ in range(num_feedback):
            feedback_date = START_DATE + timedelta(days=week + random.randint(0, 6))
            
            # Generate correlated ratings
            overall_sentiment = random.choices(['positive', 'neutral', 'negative'], weights=[60, 25, 15])[0]
            
            if overall_sentiment == 'positive':
                rating = random.randint(4, 5)
                service_rating = random.randint(4, 5)
                food_rating = random.randint(4, 5)
                reviews = [
                    "Great coffee and friendly staff!",
                    "Love this place, always consistent quality",
                    "Best café in the area, highly recommended",
                    "Amazing atmosphere and delicious food",
                    "Perfect spot for morning coffee"
                ]
            elif overall_sentiment == 'negative':
                rating = random.randint(1, 2)
                service_rating = random.randint(1, 3)
                food_rating = random.randint(1, 3)
                reviews = [
                    "Coffee was cold when served",
                    "Long wait time and average food",
                    "Poor service, staff seemed uninterested",
                    "Overpriced for the quality received",
                    "Noisy environment, hard to concentrate"
                ]
            else:  # neutral
                rating = 3
                service_rating = random.randint(2, 4)
                food_rating = random.randint(2, 4)
                reviews = [
                    "Decent coffee, nothing special",
                    "Average café experience",
                    "Good location but could improve service",
                    "Fair prices, standard quality",
                    "It's okay, might come back"
                ]
            
            feedback_data.append({
                'date': feedback_date.strftime('%Y-%m-%d'),
                'rating': rating,
                'review': random.choice(reviews),
                'service_rating': service_rating,
                'food_rating': food_rating
            })
    
    return pd.DataFrame(feedback_data)

def generate_inventory_data():
    """Generate current inventory snapshot"""
    inventory_data = []
    
    for item in INVENTORY_ITEMS:
        # Random current stock (between reorder level and 3x reorder level)
        current_stock = random.randint(item['reorder_level'], item['reorder_level'] * 3)
        
        inventory_data.append({
            'item_name': item['name'],
            'category': item['category'],
            'current_stock': current_stock,
            'reorder_level': item['reorder_level'],
            'unit_cost': item['unit_cost'],
            'last_updated': (END_DATE - timedelta(days=random.randint(0, 7))).strftime('%Y-%m-%d')
        })
    
    return pd.DataFrame(inventory_data)

def generate_menu_data():
    """Generate menu items with pricing"""
    menu_data = []
    
    for category, items in MENU_ITEMS.items():
        for item_name, details in items.items():
            menu_data.append({
                'item_name': item_name,
                'category': category,
                'price': details['price'],
                'cost_to_make': details['cost'],
                'prep_time_mins': details['prep_time']
            })
    
    return pd.DataFrame(menu_data)

def generate_daily_stats():
    """Generate daily operational statistics"""
    daily_stats = []
    
    for day in range(DAYS):
        current_date = START_DATE + timedelta(days=day)
        
        # Calculate from sales data patterns
        is_weekend = current_date.weekday() >= 5
        base_customers = random.randint(80, 150)
        if is_weekend:
            total_customers = int(base_customers * 1.2)
        else:
            total_customers = base_customers
        
        # Revenue calculation (average order value: $12-18)
        avg_order_value = random.uniform(12, 18)
        total_revenue = round(total_customers * avg_order_value, 2)
        
        # Peak hour
        peak_hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '17:00']
        peak_hour = random.choice(peak_hours)
        
        daily_stats.append({
            'date': current_date.strftime('%Y-%m-%d'),
            'total_customers': total_customers,
            'total_revenue': total_revenue,
            'avg_order_value': round(avg_order_value, 2),
            'weather': random.choice(WEATHER_CONDITIONS),
            'peak_hour': peak_hour
        })
    
    return pd.DataFrame(daily_stats)

def save_datasets():
    """Generate and save all datasets as CSV files"""
    print("Generating synthetic café analytics dataset...")
    
    # Generate all datasets
    sales_df = generate_sales_data()
    feedback_df = generate_feedback_data()
    inventory_df = generate_inventory_data()
    menu_df = generate_menu_data()
    daily_stats_df = generate_daily_stats()
    
    # Save to CSV files
    sales_df.to_csv('sales.csv', index=False)
    feedback_df.to_csv('feedback.csv', index=False)
    inventory_df.to_csv('inventory.csv', index=False)
    menu_df.to_csv('menu.csv', index=False)
    daily_stats_df.to_csv('daily_stats.csv', index=False)
    
    print(f"✅ Generated datasets:")
    print(f"   - sales.csv: {len(sales_df)} transactions")
    print(f"   - feedback.csv: {len(feedback_df)} reviews")
    print(f"   - inventory.csv: {len(inventory_df)} items")
    print(f"   - menu.csv: {len(menu_df)} menu items")
    print(f"   - daily_stats.csv: {len(daily_stats_df)} days")
    
    return {
        'sales': sales_df,
        'feedback': feedback_df,
        'inventory': inventory_df,
        'menu': menu_df,
        'daily_stats': daily_stats_df
    }

# Run the data generation
if __name__ == "__main__":
    datasets = save_datasets()
    
    # Display sample data
    print("\n📊 Sample Data Preview:")
    print("\nSales Data (first 5 rows):")
    print(datasets['sales'].head())
    
    print("\nFeedback Data (first 3 rows):")
    print(datasets['feedback'].head(3))
    
    print("\nInventory Data:")
    print(datasets['inventory'])