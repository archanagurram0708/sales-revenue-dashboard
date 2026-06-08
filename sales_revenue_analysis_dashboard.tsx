import React, { useState, useMemo, useRef } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Percent, 
  Upload, 
  Download, 
  Filter, 
  Search, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Layers,
  MapPin,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  AlertCircle,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// ==========================================
// MOCK DATA GENERATOR (Initial high-fidelity data)
// ==========================================
const generateMockData = () => {
  const categories = ['Electronics', 'Apparel', 'Home & Kitchen', 'Beauty', 'Sports & Outdoors'];
  const subCategories = {
    'Electronics': ['Smartphones', 'Laptops', 'Audio', 'Accessories', 'Smart Home'],
    'Apparel': ['Activewear', 'Footwear', 'Outerwear', 'Casual', 'Accessories'],
    'Home & Kitchen': ['Cookware', 'Appliances', 'Furniture', 'Decor', 'Bedding'],
    'Beauty': ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Tools'],
    'Sports & Outdoors': ['Fitness', 'Camping', 'Cycling', 'Water Sports', 'Athletic Gear']
  };
  const products = {
    'Smartphones': 'ProPhone 15 X', 'Laptops': 'Ultrabook Air 13', 'Audio': 'Studio Wireless ANC', 'Accessories': 'MagSafe Powerpack Pro', 'Smart Home': 'Hub Max Display',
    'Activewear': 'DryFit Training Tee', 'Footwear': 'CloudStratus Running Shoes', 'Outerwear': 'Windbreaker Storm Shell', 'Casual': 'Organic Cotton Hoodie',
    'Cookware': 'Cast Iron Skillet 12"', 'Appliances': 'Dual-Basket Air Fryer', 'Furniture': 'Ergonomic Mesh Task Chair', 'Decor': 'Minimalist Ceramic Vase', 'Bedding': 'Bamboo Sheet Set',
    'Skincare': 'Hyaluronic Acid Serum', 'Makeup': 'Velvet Matte Lipstick', 'Haircare': 'Argan Repair Mask', 'Fragrance': 'Bergamot & Oak Eau',
    'Fitness': 'Adjustable Dumbbell Set', 'Camping': '4-Person Dome Tent', 'Cycling': 'Commuter Hybrid Bike', 'Water Sports': 'Inflatable Stand-up Paddleboard'
  };
  const regions = ['North America', 'Europe', 'Asia-Pacific', 'Latin America'];
  const channels = ['Online Store', 'Retail Store', 'Wholesale', 'Mobile App'];
  
  const rawData = [];
  const startYear = 2025;
  
  // Create ~18 months of data up to mid-2026
  let id = 1;
  for (let monthOffset = 0; monthOffset < 18; monthOffset++) {
    const d = new Date(startYear, monthOffset, 1);
    const monthNum = d.getMonth();
    const yearNum = d.getFullYear();
    
    // Seasonal multiplier
    let seasonalMultiplier = 1.0;
    if (monthNum === 11) seasonalMultiplier = 1.6; // Dec holidays
    if (monthNum === 10) seasonalMultiplier = 1.4; // Nov Black Friday
    if (monthNum === 5 || monthNum === 6) seasonalMultiplier = 1.1; // Summer boost
    if (monthNum === 0 || monthNum === 1) seasonalMultiplier = 0.8; // Jan-Feb slump

    // Generate ~30-45 transactions per month
    const transactionsCount = Math.floor(Math.random() * 20) + 35;
    
    for (let t = 0; t < transactionsCount; t++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const category = categories[Math.floor(Math.random() * categories.length)];
      const subCatOptions = subCategories[category];
      const subCategory = subCatOptions[Math.floor(Math.random() * subCatOptions.length)];
      const productName = products[subCategory] || `${subCategory} Premium`;
      
      const region = regions[Math.floor(Math.random() * regions.length)];
      const channel = channels[Math.floor(Math.random() * channels.length)];
      
      // Setup price and cost structure
      let unitPrice = 0;
      let unitCost = 0;
      
      switch(category) {
        case 'Electronics':
          unitPrice = Math.floor(Math.random() * 800) + 150;
          unitCost = unitPrice * (Math.random() * 0.15 + 0.60); // 25-40% margin
          break;
        case 'Apparel':
          unitPrice = Math.floor(Math.random() * 120) + 30;
          unitCost = unitPrice * (Math.random() * 0.15 + 0.30); // 55-70% margin
          break;
        case 'Home & Kitchen':
          unitPrice = Math.floor(Math.random() * 300) + 40;
          unitCost = unitPrice * (Math.random() * 0.15 + 0.45); // 40-55% margin
          break;
        case 'Beauty':
          unitPrice = Math.floor(Math.random() * 80) + 15;
          unitCost = unitPrice * (Math.random() * 0.10 + 0.20); // 70-80% margin
          break;
        case 'Sports & Outdoors':
          unitPrice = Math.floor(Math.random() * 400) + 50;
          unitCost = unitPrice * (Math.random() * 0.15 + 0.50); // 35-50% margin
          break;
        default:
          unitPrice = 100;
          unitCost = 60;
      }
      
      const quantity = Math.floor(Math.random() * 5) + 1;
      const revenue = Math.round(unitPrice * quantity * 100) / 100;
      const cost = Math.round(unitCost * quantity * 100) / 100;
      const profit = Math.round((revenue - cost) * 100) / 100;
      const discount = Math.random() > 0.7 ? Math.round(revenue * (Math.random() * 0.15) * 100) / 100 : 0;
      
      const transactionDate = new Date(yearNum, monthNum, day).toISOString().split('T')[0];
      
      rawData.push({
        id: `TX-${id.toString().padStart(5, '0')}`,
        date: transactionDate,
        product: productName,
        category: category,
        subCategory: subCategory,
        price: Number(unitPrice.toFixed(2)),
        quantity: quantity,
        revenue: Number((revenue - discount).toFixed(2)),
        cost: Number(cost.toFixed(2)),
        profit: Number((revenue - discount - cost).toFixed(2)),
        discount: discount,
        region: region,
        salesChannel: channel
      });
      id++;
    }
  }
  
  // Sort reverse chronologically initially
  return rawData.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export default function App() {
  // --- STATE ---
  const [data, setData] = useState(() => generateMockData());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedChannel, setSelectedChannel] = useState('All');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const fileInputRef = useRef(null);

  // --- DERIVED / FILTERED DATA ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchSearch = 
        item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchRegion = selectedRegion === 'All' || item.region === selectedRegion;
      const matchChannel = selectedChannel === 'All' || item.salesChannel === selectedChannel;
      
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      const matchDate = (!start || itemDate >= start) && (!end || itemDate <= end);
      
      return matchSearch && matchCategory && matchRegion && matchChannel && matchDate;
    });
  }, [data, searchQuery, selectedCategory, selectedRegion, selectedChannel, startDate, endDate]);

  // Sort Data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string' && sortField === 'date') {
        return sortDirection === 'asc' 
          ? new Date(aVal) - new Date(bVal) 
          : new Date(bVal) - new Date(aVal);
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;

  // --- STATS & KPIs CALCULATIONS ---
  const stats = useMemo(() => {
    let revenue = 0;
    let cost = 0;
    let units = 0;
    let discount = 0;
    
    filteredData.forEach(item => {
      revenue += item.revenue;
      cost += item.cost;
      units += item.quantity;
      discount += item.discount || 0;
    });

    const profit = revenue - cost;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const aov = filteredData.length > 0 ? revenue / filteredData.length : 0;

    // Calculate previous period for trends (Simple fallback - previous half of selected timeframe)
    // For demo purposes, we will calculate dynamically based on time splits or show high-fidelity comparisons
    return {
      revenue,
      cost,
      profit,
      units,
      margin,
      aov,
      discount,
      count: filteredData.length
    };
  }, [filteredData]);

  // Unique lists for filters
  const categories = useMemo(() => ['All', ...new Set(data.map(item => item.category))], [data]);
  const regions = useMemo(() => ['All', ...new Set(data.map(item => item.region))], [data]);
  const channels = useMemo(() => ['All', ...new Set(data.map(item => item.salesChannel))], [data]);

  // --- AGGREGATED DATA FOR CHARTS ---
  
  // 1. Monthly Revenue & Profit
  const monthlyData = useMemo(() => {
    const monthsMap = {};
    filteredData.forEach(item => {
      // Group by YYYY-MM
      const dateObj = new Date(item.date);
      const key = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      if (!monthsMap[key]) {
        monthsMap[key] = { month: key, revenue: 0, profit: 0, units: 0 };
      }
      monthsMap[key].revenue += item.revenue;
      monthsMap[key].profit += item.profit;
      monthsMap[key].units += item.quantity;
    });

    // Sort chronologically
    return Object.keys(monthsMap)
      .sort()
      .map(key => ({
        label: new Date(key + '-02').toLocaleDateString('default', { month: 'short', year: '2' }),
        ...monthsMap[key]
      }));
  }, [filteredData]);

  // 2. Category Share (Donut Visualization representation)
  const categoryData = useMemo(() => {
    const catMap = {};
    filteredData.forEach(item => {
      if (!catMap[item.category]) {
        catMap[item.category] = { category: item.category, revenue: 0, units: 0 };
      }
      catMap[item.category].revenue += item.revenue;
      catMap[item.category].units += item.quantity;
    });

    const totalRevenue = Object.values(catMap).reduce((acc, curr) => acc + curr.revenue, 0);

    return Object.values(catMap)
      .map(item => ({
        ...item,
        percentage: totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredData]);

  // 3. Top Products Table/Chart Data
  const topProducts = useMemo(() => {
    const prodMap = {};
    filteredData.forEach(item => {
      if (!prodMap[item.product]) {
        prodMap[item.product] = { 
          product: item.product, 
          category: item.category, 
          revenue: 0, 
          units: 0,
          profit: 0
        };
      }
      prodMap[item.product].revenue += item.revenue;
      prodMap[item.product].units += item.quantity;
      prodMap[item.product].profit += item.profit;
    });

    return Object.values(prodMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredData]);

  // 4. Regional Breakdown
  const regionalData = useMemo(() => {
    const regMap = {};
    filteredData.forEach(item => {
      if (!regMap[item.region]) {
        regMap[item.region] = { region: item.region, revenue: 0, profit: 0 };
      }
      regMap[item.region].revenue += item.revenue;
      regMap[item.region].profit += item.profit;
    });
    return Object.values(regMap).sort((a, b) => b.revenue - a.revenue);
  }, [filteredData]);

  // --- AUTOMATIC BUSINESS INSIGHT GENERATION ---
  const businessInsights = useMemo(() => {
    if (filteredData.length === 0) return [];
    
    const insights = [];
    
    // Top category insight
    if (categoryData.length > 0) {
      const topCat = categoryData[0];
      insights.push({
        type: 'success',
        title: 'Star Performer',
        text: `The ${topCat.category} category is driving revenue, contributing $${topCat.revenue.toLocaleString('en-US', {maximumFractionDigits: 0})} (${topCat.percentage.toFixed(1)}% of total sales).`
      });
    }

    // Profit margin check
    const avgMargin = stats.margin;
    if (avgMargin < 35) {
      insights.push({
        type: 'warning',
        title: 'Margin Compression Alert',
        text: `Average operating profit margin is currently ${avgMargin.toFixed(1)}%. Consider analyzing manufacturing/supply chains or reviewing item discount structures.`
      });
    } else if (avgMargin > 48) {
      insights.push({
        type: 'success',
        title: 'Excellent Profitability',
        text: `Healthy profit margins detected at ${avgMargin.toFixed(1)}%. Standard pricing is holding robust, and discounting impact is minimized.`
      });
    }

    // Top selling product highlight
    if (topProducts.length > 0) {
      const bestProduct = topProducts[0];
      insights.push({
        type: 'info',
        title: 'Product Champion',
        text: `"${bestProduct.product}" is your highest grossing single item, capturing $${bestProduct.revenue.toLocaleString('en-US', {maximumFractionDigits: 0})} in sales revenue.`
      });
    }

    // Regional insight
    if (regionalData.length > 0) {
      const topReg = regionalData[0];
      const bottomReg = regionalData[regionalData.length - 1];
      if (topReg && bottomReg && topReg.region !== bottomReg.region) {
        insights.push({
          type: 'info',
          title: 'Geographic Variance',
          text: `${topReg.region} is the leading regional sector with $${topReg.revenue.toLocaleString('en-US', {maximumFractionDigits:0})}. In comparison, ${bottomReg.region} represents the largest expansion opportunity.`
        });
      }
    }

    return insights;
  }, [filteredData, categoryData, stats.margin, topProducts, regionalData]);

  // --- HANDLERS ---
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedRegion('All');
    setSelectedChannel('All');
    setStartDate('2025-01-01');
    setEndDate('2026-06-30');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Product', 'Category', 'SubCategory', 'Price', 'Quantity', 'Revenue', 'Cost', 'Profit', 'Discount', 'Region', 'Sales Channel'];
    const csvRows = [headers.join(',')];
    
    filteredData.forEach(item => {
      const values = [
        item.id,
        item.date,
        `"${item.product.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        `"${item.subCategory}"`,
        item.price,
        item.quantity,
        item.revenue,
        item.cost,
        item.profit,
        item.discount || 0,
        `"${item.region}"`,
        `"${item.salesChannel}"`
      ];
      csvRows.push(values.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_revenue_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import Parser
  const handleCsvImportSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!csvInput.trim()) {
      setErrorMsg('Please paste some CSV data first.');
      return;
    }

    try {
      const lines = csvInput.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      if (lines.length < 2) {
        throw new Error('CSV must contain a header row and at least one data row.');
      }

      // Read headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
      
      // Simple verification
      const requiredFields = ['date', 'product', 'category', 'revenue', 'cost'];
      const missingFields = requiredFields.filter(f => !headers.includes(f));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required columns in header: ${missingFields.join(', ')}. Format needs standard keys.`);
      }

      const importedItems = [];
      let nextId = Math.floor(Math.random() * 100000);

      for (let i = 1; i < lines.length; i++) {
        // Simple comma split (doesn't fully support escaped quotes, but handles simple sheets)
        // regex solves typical quoted CSV items nicely
        const cols = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
        const parsedCol = cols.map(c => c.trim().replace(/^["']|["']$/g, ''));
        
        if (parsedCol.length < headers.length) continue; // Skip incomplete lines

        const item = {};
        headers.forEach((header, index) => {
          item[header] = parsedCol[index];
        });

        // Parse types carefully
        const revenue = parseFloat(item.revenue) || 0;
        const cost = parseFloat(item.cost) || 0;
        const quantity = parseInt(item.quantity) || 1;
        const price = parseFloat(item.price) || (quantity > 0 ? Number((revenue / quantity).toFixed(2)) : revenue);
        const profit = parseFloat(item.profit) || (revenue - cost);

        importedItems.push({
          id: item.id || `TX-${String(nextId++).padStart(5, '0')}`,
          date: item.date || new Date().toISOString().split('T')[0],
          product: item.product || 'Unnamed Product',
          category: item.category || 'General',
          subCategory: item.subcategory || item.category || 'General',
          price: Number(price),
          quantity: Number(quantity),
          revenue: Number(revenue),
          cost: Number(cost),
          profit: Number(profit),
          discount: parseFloat(item.discount) || 0,
          region: item.region || 'Online Store',
          salesChannel: item.saleschannel || item.channel || 'Direct'
        });
      }

      if (importedItems.length === 0) {
        throw new Error('No valid records parsed from input.');
      }

      // Merge or Replace Options (We will prepending them)
      setData(prev => [...importedItems, ...prev]);
      setSuccessMsg(`Successfully imported ${importedItems.length} records into dataset!`);
      setIsUploadOpen(false);
      setCsvInput('');
      setCurrentPage(1);
    } catch (err) {
      setErrorMsg(`Import Error: ${err.message}`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvInput(event.target.result);
      setIsUploadOpen(true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* HEADER SECTION */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
                RevStream Analytics
              </h1>
              <p className="text-xs text-slate-400">Sales & Revenue Intelligence Dashboard</p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsUploadOpen(!isUploadOpen)}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition"
            >
              <Upload className="h-4 w-4 text-indigo-400" />
              <span>Import Data</span>
            </button>
            
            <button
              onClick={handleExportCSV}
              disabled={filteredData.length === 0}
              className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-600/10"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV ({filteredData.length})</span>
            </button>

            <button
              onClick={() => {
                setData(generateMockData());
                resetFilters();
                setSuccessMsg('Reset dashboard to default dataset successfully.');
                setTimeout(() => setSuccessMsg(''), 4000);
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Reload Default Data"
            >
              <RefreshCw className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* SUB-HEADER / NOTIFICATION BANNER */}
      {successMsg && (
        <div className="bg-emerald-950 border-b border-emerald-800 text-emerald-300 text-xs px-8 py-2.5 flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-400 hover:text-emerald-200 font-bold">×</button>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        
        {/* IMPORT DRAWER MODAL */}
        {isUploadOpen && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-semibold">Import Dataset via CSV</h3>
              </div>
              <button 
                onClick={() => { setIsUploadOpen(false); setErrorMsg(''); }}
                className="text-slate-400 hover:text-white"
              >
                Close ×
              </button>
            </div>
            
            <div className="text-xs text-slate-400 space-y-2">
              <p>
                Upload a CSV file or paste raw comma-separated data directly. The parser looks for the following lower-case headers:
              </p>
              <code className="block bg-slate-900 p-2 rounded text-slate-300 overflow-x-auto">
                date, product, category, quantity, price, revenue, cost, profit, region, salesChannel
              </code>
            </div>

            <form onSubmit={handleCsvImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Upload CSV File</label>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-900/50 file:text-indigo-300 hover:file:bg-indigo-900/80"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Or Paste CSV Data Directly</label>
                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  rows={5}
                  placeholder={`date,product,category,quantity,price,revenue,cost,region,salesChannel\n2026-06-01,Quantum Laptop 16,Electronics,2,1200,2400,1600,North America,Online Store`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs bg-rose-950/50 border border-rose-800 text-rose-300 p-3 rounded">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsUploadOpen(false); setErrorMsg(''); }}
                  className="px-4 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-indigo-600 hover:bg-indigo-500 rounded font-medium transition"
                >
                  Parse & Load Data
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CONTROLS & FILTER BAR */}
        <section className="bg-slate-800/50 border border-slate-800/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Interactive Controls</h2>
            </div>
            <button 
              onClick={resetFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            
            {/* Search Input */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" /> Search Products
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Product, ID, or Category..."
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Category Slicer */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Region Slicer */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => { setSelectedRegion(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {regions.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>

            {/* Date Range - Start */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Date Range - End */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

          </div>
        </section>

        {/* HIGH-LEVEL KPI METRICS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card: Total Revenue */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
                <h3 className="text-2xl font-bold mt-2 tracking-tight">
                  ${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs">
              <span className="flex items-center text-emerald-400 font-medium">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +14.2%
              </span>
              <span className="text-slate-500">vs target baseline</span>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-500 pointer-events-none" />
          </div>

          {/* Card: Profit Margin */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Operating Profit</p>
                <h3 className="text-2xl font-bold mt-2 tracking-tight">
                  ${stats.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 font-semibold">
                {stats.margin.toFixed(1)}% margin
              </span>
              <span className="text-slate-500">Healthy yield range</span>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500 pointer-events-none" />
          </div>

          {/* Card: Units Sold */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Quantity Sold</p>
                <h3 className="text-2xl font-bold mt-2 tracking-tight">
                  {stats.units.toLocaleString()} units
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/10">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs">
              <span className="flex items-center text-emerald-400 font-medium">
                <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +8.1%
              </span>
              <span className="text-slate-500">growth in sales volume</span>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-500 pointer-events-none" />
          </div>

          {/* Card: Average Order Value */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Order Value (AOV)</p>
                <h3 className="text-2xl font-bold mt-2 tracking-tight">
                  ${stats.aov.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/10">
                <Percent className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs">
              <span className="flex items-center text-rose-400 font-medium">
                <ArrowDownRight className="h-3.5 w-3.5 mr-0.5" /> -1.2%
              </span>
              <span className="text-slate-500">due to seasonal discounting</span>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all duration-500 pointer-events-none" />
          </div>

        </section>

        {/* ANALYTICS CHARTS SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Revenue Trends (Interactive Custom Area Visualizer) */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-slate-200">Revenue & Profit Stream Timeline</h3>
                  <p className="text-xs text-slate-400">Monthly breakdown tracking aggregate performance</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span>
                    <span>Revenue</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
                    <span>Profit</span>
                  </span>
                </div>
              </div>

              {/* Graphical Visualizer Container */}
              {monthlyData.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p className="text-sm">No timeline data available for the selected parameters.</p>
                </div>
              ) : (
                <div className="h-64 flex flex-col justify-between pt-6">
                  {/* The visual columns */}
                  <div className="flex items-end justify-between h-48 px-2 relative">
                    
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                      <div className="w-full border-t border-slate-800/60 h-0"></div>
                      <div className="w-full border-t border-slate-800/60 h-0"></div>
                      <div className="w-full border-t border-slate-800/60 h-0"></div>
                      <div className="w-full border-t border-slate-800/30 h-0"></div>
                    </div>

                    {/* Chart Bars/Data */}
                    {monthlyData.map((d, idx) => {
                      // Find max to scale height (normalized scale)
                      const maxVal = Math.max(...monthlyData.map(m => m.revenue)) || 1;
                      const revPercent = (d.revenue / maxVal) * 100;
                      const profPercent = (d.profit / maxVal) * 100;
                      
                      return (
                        <div key={idx} className="flex-1 group flex flex-col justify-end items-center h-full relative z-10 mx-1 max-w-[40px]">
                          {/* Hover Tooltip card */}
                          <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition duration-200 bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-[10px] w-28 text-left pointer-events-none z-50">
                            <p className="font-semibold border-b border-slate-800 pb-1 text-slate-300">{d.label}</p>
                            <p className="text-indigo-400 mt-1">Rev: ${d.revenue.toLocaleString('en-US', {maximumFractionDigits:0})}</p>
                            <p className="text-emerald-400">Profit: ${d.profit.toLocaleString('en-US', {maximumFractionDigits:0})}</p>
                          </div>

                          {/* Double Bar Overlay */}
                          <div className="w-full flex items-end gap-[2px] h-full justify-center">
                            {/* Revenue Bar */}
                            <div 
                              style={{ height: `${revPercent}%` }} 
                              className="w-2.5 rounded-t bg-indigo-500 group-hover:bg-indigo-400 transition-all duration-300 relative"
                            />
                            {/* Profit Bar */}
                            <div 
                              style={{ height: `${profPercent}%` }} 
                              className="w-2.5 rounded-t bg-emerald-500 group-hover:bg-emerald-400 transition-all duration-300 relative"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Horizontal X Axis Labels */}
                  <div className="flex justify-between items-center px-1 border-t border-slate-800 pt-2 text-[9px] text-slate-400 overflow-x-auto gap-2">
                    {monthlyData.map((d, idx) => {
                      // Only show subset labels on smaller viewports to prevent layout break
                      const showLabel = monthlyData.length <= 12 || idx % 2 === 0;
                      return (
                        <span key={idx} className={`w-8 text-center truncate ${showLabel ? '' : 'hidden md:inline'}`}>
                          {d.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Timeline shows chronological distribution. Hover over elements to inspect granular records.</span>
              <span className="font-semibold text-slate-300">{monthlyData.length} periods active</span>
            </div>
          </div>

          {/* Chart 2: Category Mix & Share */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-200 mb-1">Revenue Share by Category</h3>
              <p className="text-xs text-slate-400 mb-6">Aggregate channel division of total sales income</p>

              {categoryData.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-slate-500">
                  <AlertCircle className="h-8 w-8 mb-2" />
                  <p className="text-sm">No data matching requirements.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categoryData.map((cat, idx) => {
                    // Unique colors for up to 5 categories, fallback to purple
                    const colors = [
                      'bg-indigo-500', 
                      'bg-emerald-500', 
                      'bg-amber-500', 
                      'bg-rose-500', 
                      'bg-sky-500'
                    ];
                    const colorClass = colors[idx % colors.length];

                    return (
                      <div key={cat.category} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
                            {cat.category}
                          </span>
                          <span className="text-slate-400">
                            ${cat.revenue.toLocaleString('en-US', {maximumFractionDigits:0})} ({cat.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        {/* Custom Progress Bar */}
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden">
                          <div 
                            style={{ width: `${cat.percentage}%` }} 
                            className={`h-full rounded-full ${colorClass}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs flex justify-between text-slate-400">
              <span>Core Portfolios Tracking</span>
              <span className="text-indigo-400 font-semibold">{categoryData.length} Active Categories</span>
            </div>
          </div>

        </section>

        {/* REGIONAL BREAKDOWN & TOP PERFORMANCE SECTIONS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Grid Box: Geographic Yields */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold tracking-wide text-slate-200 mb-1">Geographic Yield & Contribution</h3>
            <p className="text-xs text-slate-400 mb-4">Revenue breakdown across operating distribution segments</p>

            <div className="space-y-3">
              {regionalData.map((reg) => {
                const totalRevenue = stats.revenue || 1;
                const percent = (reg.revenue / totalRevenue) * 100;
                return (
                  <div key={reg.region} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-slate-300 block">{reg.region}</span>
                      <span className="text-[10px] text-slate-500">Margin yield of total scope</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-200 block">
                        ${reg.revenue.toLocaleString('en-US', {maximumFractionDigits:0})}
                      </span>
                      <span className="text-[10px] text-indigo-400 font-semibold">{percent.toFixed(1)}% share</span>
                    </div>
                  </div>
                );
              })}
              {regionalData.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No regional breakdown metrics found.</p>
              )}
            </div>
          </div>

          {/* Grid Box: Star Products List */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold tracking-wide text-slate-200 mb-1">Product Hall of Fame</h3>
            <p className="text-xs text-slate-400 mb-4">Top 5 inventory stock units based on absolute revenue generation</p>

            <div className="space-y-3">
              {topProducts.map((prod, idx) => (
                <div key={prod.product} className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-indigo-500/10 border border-indigo-500/10 rounded-lg text-indigo-400 text-xs font-bold">
                    #{idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-slate-300 block truncate">{prod.product}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-tight">{prod.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-200 block">
                      ${prod.revenue.toLocaleString('en-US', {maximumFractionDigits: 0})}
                    </span>
                    <span className="text-[10px] text-slate-400">{prod.units.toLocaleString()} orders</span>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">No top product metrics available.</p>
              )}
            </div>
          </div>

        </section>

        {/* BUSINESS INSIGHTS CARDS */}
        {businessInsights.length > 0 && (
          <section className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-950/60 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Algorithmic Business Advisory</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businessInsights.map((insight, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex gap-3"
                >
                  <div className="mt-0.5">
                    {insight.type === 'success' && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />}
                    {insight.type === 'warning' && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />}
                    {insight.type === 'info' && <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200">{insight.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DETAILED TRANSACTION TABLE EXPLORER */}
        <section className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/20">
            <div>
              <h3 className="text-sm font-semibold tracking-wide text-slate-200">Granular Sales Ledger</h3>
              <p className="text-xs text-slate-400">Search, filter, and drill down on individual receipts</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Lines per view:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  <th onClick={() => handleSort('id')} className="py-3 px-4 cursor-pointer hover:text-white transition select-none">
                    <div className="flex items-center gap-1">
                      ID {sortField === 'id' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th onClick={() => handleSort('date')} className="py-3 px-4 cursor-pointer hover:text-white transition select-none">
                    <div className="flex items-center gap-1">
                      Date {sortField === 'date' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th onClick={() => handleSort('product')} className="py-3 px-4 cursor-pointer hover:text-white transition select-none">
                    <div className="flex items-center gap-1">
                      Product {sortField === 'product' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th onClick={() => handleSort('category')} className="py-3 px-4 cursor-pointer hover:text-white transition select-none">
                    <div className="flex items-center gap-1">
                      Category {sortField === 'category' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th onClick={() => handleSort('region')} className="py-3 px-4 cursor-pointer hover:text-white transition select-none">
                    <div className="flex items-center gap-1">
                      Region {sortField === 'region' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th onClick={() => handleSort('quantity')} className="py-3 px-4 text-right cursor-pointer hover:text-white transition select-none">
                    <div className="flex items-center gap-1 justify-end">
                      Qty {sortField === 'quantity' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th onClick={() => handleSort('revenue')} className="py-3 px-4 text-right cursor-pointer hover:text-white transition select-none">
                    <div className="flex items-center gap-1 justify-end">
                      Revenue {sortField === 'revenue' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                  <th onClick={() => handleSort('profit')} className="py-3 px-4 text-right cursor-pointer hover:text-white transition select-none">
                    <div className="flex items-center gap-1 justify-end">
                      Profit {sortField === 'profit' && (sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 font-semibold">{item.id}</td>
                    <td className="py-3 px-4 text-slate-300">{item.date}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{item.product}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-400">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{item.region}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-300">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-100">${item.revenue.toFixed(2)}</td>
                    <td className={`py-3 px-4 text-right font-bold ${item.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ${item.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 px-4 text-center text-slate-500">
                      No records matched the active filter/search settings. Try adjusting constraints above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          {sortedData.length > 0 && (
            <div className="p-4 bg-slate-900/30 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Displaying <span className="font-semibold text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-200">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of <span className="font-semibold text-slate-200">{sortedData.length}</span> records
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-1 text-xs">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Smart pagination subset
                    let pageNum = i + 1;
                    if (currentPage > 3 && totalPages > 5) {
                      pageNum = currentPage - 3 + i;
                      if (pageNum + (4 - i) > totalPages) {
                        pageNum = totalPages - 4 + i;
                      }
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-slate-850 hover:bg-slate-800 text-slate-400'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* DASHBOARD SUMMARY FOOTER */}
      <footer className="border-t border-slate-800 mt-12 bg-slate-950/60 py-6 px-4 md:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-400">RevStream Business Analyzer v1.4</p>
            <p className="mt-0.5 text-[11px]">Real-time aggregations calculated on active slice datasets.</p>
          </div>
          <div>
            <p>Developed with responsive state-management grids for executive metrics.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}