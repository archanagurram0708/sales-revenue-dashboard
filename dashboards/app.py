"""
Sales & Revenue Analysis Dashboard
Interactive Streamlit application for analyzing sales and revenue data.
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import os


# Page configuration
st.set_page_config(
    page_title="Sales & Revenue Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
        .metric-card {
            background-color: #f0f2f6;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .kpi-value {
            font-size: 32px;
            font-weight: bold;
            color: #1f77b4;
        }
        .kpi-label {
            font-size: 14px;
            color: #666;
            margin-top: 5px;
        }
    </style>
""", unsafe_allow_html=True)


@st.cache_data
def load_data(filepath: str) -> pd.DataFrame:
    """Load and cache the cleaned sales data."""
    if not os.path.exists(filepath):
        st.error(f"❌ Data file not found: {filepath}")
        st.info("Please run: `python scripts/data_prep.py`")
        st.stop()
    
    df = pd.read_csv(filepath)
    df['Date'] = pd.to_datetime(df['Date'])
    return df


def display_kpis(df_filtered: pd.DataFrame) -> None:
    """Display key performance indicators."""
    
    # Calculate metrics
    total_revenue = df_filtered['Gross_Revenue'].sum()
    total_profit = df_filtered['Net_Profit'].sum()
    profit_margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
    total_units = df_filtered['Quantity'].sum()
    avg_order_value = total_revenue / len(df_filtered) if len(df_filtered) > 0 else 0
    
    # Display metrics in columns
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.metric(
            label="Total Revenue",
            value=f"${total_revenue:,.2f}",
            help="Sum of all gross revenue"
        )
    
    with col2:
        st.metric(
            label="Total Net Profit",
            value=f"${total_profit:,.2f}",
            help="Sum of all net profit"
        )
    
    with col3:
        st.metric(
            label="Profit Margin",
            value=f"{profit_margin:.1f}%",
            help="Net Profit / Total Revenue"
        )
    
    with col4:
        st.metric(
            label="Total Units Sold",
            value=f"{total_units:,.0f}",
            help="Sum of all quantities sold"
        )
    
    with col5:
        st.metric(
            label="Avg Order Value",
            value=f"${avg_order_value:,.2f}",
            help="Total Revenue / Number of Orders"
        )


def display_filters(df: pd.DataFrame) -> pd.DataFrame:
    """Display interactive filters in the sidebar."""
    
    st.sidebar.header("🔍 Filters")
    
    # Date range filter
    min_date = df['Date'].min().date()
    max_date = df['Date'].max().date()
    
    date_range = st.sidebar.date_input(
        "📅 Select Date Range",
        value=(min_date, max_date),
        min_value=min_date,
        max_value=max_date
    )
    
    # Handle single date selection (edge case)
    if len(date_range) == 2:
        start_date, end_date = date_range
    else:
        start_date = end_date = date_range[0]
    
    # Region multi-select filter
    regions = df['Region'].unique().tolist()
    selected_regions = st.sidebar.multiselect(
        "🌍 Select Regions",
        options=regions,
        default=regions
    )
    
    # Category multi-select filter
    categories = df['Category'].unique().tolist()
    selected_categories = st.sidebar.multiselect(
        "📦 Select Categories",
        options=categories,
        default=categories
    )
    
    # Apply filters
    df_filtered = df[
        (df['Date'].dt.date >= start_date) &
        (df['Date'].dt.date <= end_date) &
        (df['Region'].isin(selected_regions)) &
        (df['Category'].isin(selected_categories))
    ]
    
    # Display filter summary
    st.sidebar.markdown("---")
    st.sidebar.write(f"**Records shown:** {len(df_filtered)} / {len(df)}")
    
    return df_filtered


def plot_monthly_revenue_trend(df_filtered: pd.DataFrame) -> None:
    """Plot monthly revenue trend."""
    
    df_monthly = df_filtered.groupby(df_filtered['Date'].dt.to_period('M')).agg({
        'Gross_Revenue': 'sum',
        'Net_Profit': 'sum'
    }).reset_index()
    df_monthly['Date'] = df_monthly['Date'].dt.to_timestamp()
    
    fig = go.Figure()
    
    fig.add_trace(go.Scatter(
        x=df_monthly['Date'],
        y=df_monthly['Gross_Revenue'],
        mode='lines+markers',
        name='Gross Revenue',
        line=dict(color='#1f77b4', width=3),
        fill='tozeroy',
        hovertemplate='<b>%{x|%B %Y}</b><br>Revenue: $%{y:,.0f}<extra></extra>'
    ))
    
    fig.update_layout(
        title="📈 Monthly Revenue Trends",
        xaxis_title="Month",
        yaxis_title="Revenue ($)",
        hovermode='x unified',
        height=400,
        template='plotly_light'
    )
    
    st.plotly_chart(fig, use_container_width=True)


def plot_top_products(df_filtered: pd.DataFrame) -> None:
    """Plot top 5 best-selling products by revenue."""
    
    top_products = df_filtered.groupby('Product_Name')['Gross_Revenue'].sum().nlargest(5).reset_index()
    top_products = top_products.sort_values('Gross_Revenue')
    
    fig = px.bar(
        top_products,
        y='Product_Name',
        x='Gross_Revenue',
        orientation='h',
        title="🏆 Top 5 Best-Selling Products by Revenue",
        labels={'Gross_Revenue': 'Revenue ($)', 'Product_Name': 'Product'},
        color='Gross_Revenue',
        color_continuous_scale='Blues',
        text_auto='.2s'
    )
    
    fig.update_layout(
        height=400,
        showlegend=False,
        hovermode='y unified',
        template='plotly_light'
    )
    
    st.plotly_chart(fig, use_container_width=True)


def plot_category_revenue_share(df_filtered: pd.DataFrame) -> None:
    """Plot revenue share by product category."""
    
    category_revenue = df_filtered.groupby('Category')['Gross_Revenue'].sum().reset_index()
    
    fig = px.pie(
        category_revenue,
        values='Gross_Revenue',
        names='Category',
        title="🥧 Revenue Share by Product Category",
        hole=0.3,
        color_discrete_sequence=px.colors.qualitative.Set3,
        hovertemplate='<b>%{label}</b><br>Revenue: $%{value:,.0f}<br>Share: %{percent}<extra></extra>'
    )
    
    fig.update_layout(
        height=400,
        template='plotly_light'
    )
    
    st.plotly_chart(fig, use_container_width=True)


def plot_region_performance(df_filtered: pd.DataFrame) -> None:
    """Plot revenue vs profit by region."""
    
    region_metrics = df_filtered.groupby('Region').agg({
        'Gross_Revenue': 'sum',
        'Net_Profit': 'sum'
    }).reset_index()
    
    fig = go.Figure()
    
    fig.add_trace(go.Bar(
        x=region_metrics['Region'],
        y=region_metrics['Gross_Revenue'],
        name='Gross Revenue',
        marker_color='#1f77b4',
        text=region_metrics['Gross_Revenue'].apply(lambda x: f'${x:,.0f}'),
        textposition='auto',
        hovertemplate='<b>%{x}</b><br>Revenue: $%{y:,.0f}<extra></extra>'
    ))
    
    fig.add_trace(go.Bar(
        x=region_metrics['Region'],
        y=region_metrics['Net_Profit'],
        name='Net Profit',
        marker_color='#2ca02c',
        text=region_metrics['Net_Profit'].apply(lambda x: f'${x:,.0f}'),
        textposition='auto',
        hovertemplate='<b>%{x}</b><br>Profit: $%{y:,.0f}<extra></extra>'
    ))
    
    fig.update_layout(
        title="💰 Revenue vs Profit by Region",
        xaxis_title="Region",
        yaxis_title="Amount ($)",
        barmode='group',
        height=400,
        hovermode='x unified',
        template='plotly_light'
    )
    
    st.plotly_chart(fig, use_container_width=True)


def display_data_explorer(df_filtered: pd.DataFrame) -> None:
    """Display interactive data table explorer."""
    
    st.markdown("---")
    st.subheader("📋 Data Explorer")
    
    # Search functionality
    search_term = st.text_input(
        "🔎 Search in Product Names",
        placeholder="e.g., Laptop, Jeans, Coffee..."
    )
    
    if search_term:
        df_search = df_filtered[df_filtered['Product_Name'].str.contains(search_term, case=False)]
    else:
        df_search = df_filtered
    
    # Display table
    display_cols = [
        'Transaction_ID', 'Date', 'Product_Name', 'Category', 
        'Quantity', 'Unit_Price', 'Gross_Revenue', 'Net_Profit', 'Region'
    ]
    
    # Format display dataframe
    df_display = df_search[display_cols].copy()
    df_display['Date'] = df_display['Date'].dt.strftime('%Y-%m-%d')
    
    st.dataframe(
        df_display,
        use_container_width=True,
        height=400,
        hide_index=True
    )
    
    st.caption(f"Showing {len(df_search)} of {len(df_filtered)} filtered records")


def main():
    """Main application function."""
    
    # Header
    st.title("📊 Sales & Revenue Analysis Dashboard")
    st.markdown("Real-time insights into sales performance, revenue trends, and product analysis")
    
    # Load data
    data_path = 'data/processed/cleaned_sales_data.csv'
    df = load_data(data_path)
    
    # Apply filters
    df_filtered = display_filters(df)
    
    # Check if any data is displayed
    if len(df_filtered) == 0:
        st.warning("⚠️ No data matches your filter selection. Please adjust your filters.")
        st.stop()
    
    # Display KPIs
    st.markdown("### 📈 Key Performance Indicators")
    display_kpis(df_filtered)
    
    # Display visualizations
    st.markdown("### 📊 Analytics & Insights")
    
    # Row 1: Monthly trend
    plot_monthly_revenue_trend(df_filtered)
    
    # Row 2: Top products and category share
    col1, col2 = st.columns(2)
    with col1:
        plot_top_products(df_filtered)
    with col2:
        plot_category_revenue_share(df_filtered)
    
    # Row 3: Region performance
    plot_region_performance(df_filtered)
    
    # Data explorer
    display_data_explorer(df_filtered)
    
    # Footer
    st.markdown("---")
    st.caption("Sales & Revenue Dashboard | Data updated from: data/processed/cleaned_sales_data.csv")


if __name__ == "__main__":
    main()
