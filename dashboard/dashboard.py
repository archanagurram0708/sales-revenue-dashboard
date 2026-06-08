import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

# 1. PAGE SETTINGS
st.set_page_config(page_title="Sales & Revenue Dashboard", page_icon="📊", layout="wide")
st.title("📊 Sales & Revenue Analysis Dashboard")
st.markdown("---")

# 2. GENERATE MOCK DATA AUTOMATICALLY (Ensures cloud deployment never fails for missing files)
@st.cache_data
def generate_or_load_data():
    np.random.seed(42)
    start_date = datetime(2025, 1, 1)
    dates = [start_date + timedelta(days=int(i)) for i in np.random.randint(0, 365, 1000)]
    
    categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Sports']
    regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America']
    products = {
        'Electronics': ['Laptop', 'Smartphone', 'Wireless Headphones', 'Smart Watch'],
        'Clothing': ['T-Shirt', 'Jeans', 'Jacket', 'Sneakers'],
        'Home & Kitchen': ['Blender', 'Coffee Maker', 'Air Fryer', 'Dinnerware Set'],
        'Books': ['Fiction Novel', 'Biography', 'Tech Manual', 'Cookbook'],
        'Sports': ['Yoga Mat', 'Dumbbells', 'Running Shoes', 'Backpack']
    }
    
    data = []
    for i, date in enumerate(dates):
        cat = np.random.choice(categories)
        prod = np.random.choice(products[cat])
        reg = np.random.choice(regions)
        qty = int(np.random.randint(1, 5))
        price = float(np.random.uniform(10, 1200))
        if cat == 'Books': price = float(np.random.uniform(12, 45))
        elif cat == 'Clothing': price = float(np.random.uniform(20, 150))
        
        revenue = qty * price
        cost = revenue * np.random.uniform(0.4, 0.7)
        profit = revenue - cost
        
        data.append([date, cat, prod, reg, qty, price, revenue, profit])
        
    df = pd.DataFrame(data, columns=['Date', 'Category', 'Product', 'Region', 'Quantity', 'Price', 'Revenue', 'Profit'])
    df = df.sort_values('Date').reset_index(drop=True)
    return df

df = generate_or_load_data()

# 3. INTERACTIVE FILTERS & SLICERS (Sidebar)
st.sidebar.header("🎯 Interactive Filters")

# Region Filter
all_regions = ["All Regions"] + list(df['Region'].unique())
selected_region = st.sidebar.selectbox("Select Region", all_regions)

# Category Filter
all_cats = ["All Categories"] + list(df['Category'].unique())
selected_cat = st.sidebar.selectbox("Select Product Category", all_cats)

# Filter Logic
filtered_df = df.copy()
if selected_region != "All Regions":
    filtered_df = filtered_df[filtered_df['Region'] == selected_region]
if selected_cat != "All Categories":
    filtered_df = filtered_df[filtered_df['Category'] == selected_cat]

# 4. KEY PERFORMANCE INDICATORS (KPIs)
total_revenue = filtered_df['Revenue'].sum()
total_profit = filtered_df['Profit'].sum()
total_units = filtered_df['Quantity'].sum()
avg_order = filtered_df['Revenue'].mean() if len(filtered_df) > 0 else 0

kpi1, kpi2, kpi3, kpi4 = st.columns(4)
kpi1.metric(label="💰 Total Revenue", value=f"${total_revenue:,.2f}")
kpi2.metric(label="📈 Total Profit", value=f"${total_profit:,.2f}")
kpi3.metric(label="📦 Units Sold", value=f"{total_units:,}")
kpi4.metric(label="🛒 Avg Order Value", value=f"${avg_order:,.2f}")

st.markdown("---")

# 5. CHARTS & VISUALIZATIONS
col1, col2 = st.columns(2)

with col1:
    st.subheader("📅 Monthly Revenue Trends")
    trend_df = filtered_df.groupby(filtered_df['Date'].dt.to_period('M')).agg({'Revenue': 'sum'}).reset_index()
    trend_df['Date'] = trend_df['Date'].astype(str)
    fig_line = px.line(trend_df, x='Date', y='Revenue', markers=True, 
                       labels={'Revenue': 'Revenue ($)', 'Date': 'Month'},
                       template="plotly_dark")
    fig_line.update_traces(line_color='#00DF89', line_width=3)
    st.plotly_chart(fig_line, use_container_width=True)

with col2:
    st.subheader("🍩 Revenue Breakdown by Category")
    cat_df = filtered_df.groupby('Category').agg({'Revenue': 'sum'}).reset_index()
    fig_donut = px.pie(cat_df, values='Revenue', names='Category', hole=0.4,
                       template="plotly_dark", color_discrete_sequence=px.colors.qualitative.Pastel)
    fig_donut.update_traces(textinfo='percent+label')
    st.plotly_chart(fig_donut, use_container_width=True)

# 6. TOP PERFORMING PRODUCTS
st.markdown("---")
st.subheader("🏆 Top Performing Products by Revenue")
prod_df = filtered_df.groupby(['Product', 'Category']).agg({'Revenue': 'sum', 'Quantity': 'sum'}).reset_index()
prod_df = prod_df.sort_values(by='Revenue', ascending=False).head(10)

fig_bar = px.bar(prod_df, x='Revenue', y='Product', orientation='h', color='Category',
                 labels={'Revenue': 'Total Revenue ($)', 'Product': 'Product'},
                 template="plotly_dark", color_discrete_sequence=px.colors.qualitative.Bold)
fig_bar.update_layout(yaxis={'categoryorder':'total ascending'})
st.plotly_chart(fig_bar, use_container_width=True)

# 7. INTERACTIVE DATA EXPLORER / TRANSACTION TABLE
st.markdown("---")
st.subheader("🔍 Transaction Data Explorer")
st.markdown("Use the search box inside the table below to filter rows instantly.")
st.dataframe(filtered_df, use_container_width=True, hide_index=True)
