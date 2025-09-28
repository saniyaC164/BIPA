import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Chip,
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    DateRange as DateIcon,
    Category as CategoryIcon,
    TrendingUp as TrendingUpIcon,
    AttachMoney as MoneyIcon,
    ShoppingCart as CartIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import DashboardLayout from '../layout/DashboardLayout';
import Navbar from '../layout/Navbar';
import KPIGrid from '../kpis/KPIGrid';
import RevenueChart from '../charts/RevenueChart';
import ProductSalesChart from '../charts/ProductSalesChart';
import PaymentMethodChart from '../charts/PaymentMethodChart';
import api from '../services/api';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter states
    const [dateRange, setDateRange] = useState('7d');
    const [category, setCategory] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hourlyData, setHourlyData] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);
    const [feedbackSummary, setFeedbackSummary] = useState(null);
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query parameters based on filters
            const params = new URLSearchParams();
            if (dateRange !== 'custom') {
                params.append('period', dateRange);
            } else if (startDate && endDate) {
                params.append('start_date', startDate);
                params.append('end_date', endDate);
            }

            // Fetch comprehensive dashboard data
            const [dashboardResponse, revenueResponse, productResponse, hourlyResponse] = await Promise.all([
                api.get('/dashboard-data'),
                api.get(`/revenue-trends?period=daily&${params.toString()}`),
                api.get('/product-analytics'),
                api.get('/hourly-analysis')
            ]);

            console.log('dashboardResponse', dashboardResponse.data);
            console.log('revenueResponse', revenueResponse.data);

            // Normalize dashboard payload
            const dd = dashboardResponse.data || {};

            // Normalize revenue series: backend may return { period, data: [...] } or an array directly
            const revenueSeries = Array.isArray(revenueResponse.data)
                ? revenueResponse.data
                : (revenueResponse.data?.data ?? []);

            // If dashboard kpi is present but zeroed, compute fallbacks from revenue/product/hourly arrays
            const kpi = dd.kpi || {};
            // compute total_revenue from revenueSeries if backend kpi total_revenue is falsy
            if ((!kpi.total_revenue || kpi.total_revenue === 0) && revenueSeries.length > 0) {
                const totalRevenue = revenueSeries.reduce((s, r) => s + (Number(r.total_revenue) || 0), 0);
                kpi.total_revenue = totalRevenue;
            }
            // compute total_transactions from top_products quantities if needed
            if ((!kpi.total_transactions || kpi.total_transactions === 0) && Array.isArray(dd.top_products)) {
                const tx = dd.top_products.reduce((s, p) => s + (Number(p.quantity) || 0), 0);
                kpi.total_transactions = tx;
            }
            // avg_order_value fallback
            if ((!kpi.avg_order_value || kpi.avg_order_value === 0) && kpi.total_revenue && kpi.total_transactions) {
                kpi.avg_order_value = Number((kpi.total_revenue / Math.max(1, kpi.total_transactions)).toFixed(2));
            }

            // Attach normalized shapes back
            dd.kpi = kpi;
            setDashboardData(dd);
            setRevenueData(revenueSeries || []);
            setProductData(productResponse.data.top_products || productResponse.data?.top_products || []);
            setHourlyData(hourlyResponse.data.hourly_data || hourlyResponse.data?.hourly_data || []);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch heatmap and feedback summary from backend
    const fetchExtraData = async () => {
        try {
            const params = new URLSearchParams();
            if (dateRange !== 'custom') params.append('period', dateRange);
            if (startDate && endDate) {
                params.append('start_date', startDate);
                params.append('end_date', endDate);
            }

            const [heatRes, fbRes] = await Promise.all([
                api.get(`/heatmap?${params.toString()}`),
                api.get('/feedback-summary')
            ]);

            setHeatmapData(heatRes.data.heatmap || []);
            setFeedbackSummary(fbRes.data || null);
        } catch (e) {
            console.warn('Failed to load additional dashboard data', e);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchExtraData();
    }, [dateRange, category, startDate, endDate]);

    const handleRefresh = () => {
        fetchDashboardData();
    };

    const handleDateRangeChange = (event) => {
        setDateRange(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };


    const HeatmapCell = ({ data }) => {
        const intensity = data.value / 120; // Normalize to 0-1
        const backgroundColor = `rgba(76, 175, 80, ${intensity})`;

        return (
            <div
                style={{
                    backgroundColor,
                    width: '30px',
                    height: '20px',
                    border: '1px solid #333',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: intensity > 0.5 ? 'white' : '#666',
                }}
                title={`${data.day} ${data.hour}:00 - Revenue: ₹${data.revenue}`}
            >
                {data.value}
            </div>
        );
    };

    const TimeHeatmap = ({ data }) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const hours = Array.from({ length: 24 }, (_, i) => i);

        return (
            <Card sx={{
                backgroundColor: '#2d2d2d',
                border: '1px solid #333',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        mb: 2
                    }}>
                        Sales Heatmap - Peak Hours
                    </Typography>
                    <Typography variant="body2" sx={{
                        color: 'rgba(255,255,255,0.7)',
                        mb: 3,
                        fontSize: '0.875rem'
                    }}>
                        Transaction intensity by day and hour
                    </Typography>

                    <Box sx={{ overflowX: 'auto' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '800px' }}>
                            {/* Hour labels */}
                            <div style={{ display: 'flex', gap: '2px', marginLeft: '40px' }}>
                                {hours.map(hour => (
                                    <div key={hour} style={{
                                        width: '30px',
                                        fontSize: '10px',
                                        textAlign: 'center',
                                        color: 'rgba(255,255,255,0.7)'
                                    }}>
                                        {hour}
                                    </div>
                                ))}
                            </div>

                            {/* Heatmap grid */}
                            {days.map((day, dayIndex) => (
                                <div key={day} style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '35px',
                                        fontSize: '11px',
                                        color: 'rgba(255,255,255,0.7)',
                                        textAlign: 'right',
                                        marginRight: '5px'
                                    }}>
                                        {day}
                                    </div>
                                    {hours.map(hour => {
                                        const cellData = data.find(d =>
                                            d.day === ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex] &&
                                            d.hour === hour
                                        ) || { value: 0, revenue: 0 };

                                        return (
                                            <HeatmapCell key={`${day}-${hour}`} data={{
                                                ...cellData,
                                                day,
                                                hour
                                            }} />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                                Low
                            </Typography>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
                                    <div key={intensity} style={{
                                        width: '20px',
                                        height: '12px',
                                        backgroundColor: `rgba(76, 175, 80, ${intensity})`,
                                        border: '1px solid #333'
                                    }} />
                                ))}
                            </div>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>
                                High
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    if (loading) {
        return (
            <Box>
                <Navbar />
                <DashboardLayout>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <Box textAlign="center">
                            <CircularProgress size={60} />
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Loading Dashboard...
                            </Typography>
                        </Box>
                    </Box>
                </DashboardLayout>
            </Box>
        );
    }

    if (error) {
        return (
            <Box>
                <Navbar />
                <DashboardLayout>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <Alert
                            severity="error"
                            action={
                                <Button color="inherit" size="small" onClick={handleRefresh}>
                                    Retry
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    </Box>
                </DashboardLayout>
            </Box>
        );
    }

    return (
        <Box>
            <Navbar />
            <DashboardLayout>
                <Box>
                    {/* Filters Bar */}
                    <Paper className="card-neutral" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Date Range</InputLabel>
                                    <Select
                                        value={dateRange}
                                        onChange={handleDateRangeChange}
                                        label="Date Range"
                                        sx={{
                                            color: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' }
                                        }}
                                    >
                                        <MenuItem value="7d">Last 7 Days</MenuItem>
                                        <MenuItem value="30d">Last 30 Days</MenuItem>
                                        <MenuItem value="90d">Last 90 Days</MenuItem>
                                        <MenuItem value="custom">Custom Range</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {dateRange === 'custom' && (
                                <>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            type="date"
                                            label="Start Date"
                                            size="small"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            sx={{
                                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white',
                                                    '& fieldset': { borderColor: '#333' },
                                                    '&:hover fieldset': { borderColor: '#4caf50' }
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <TextField
                                            type="date"
                                            label="End Date"
                                            size="small"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            sx={{
                                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                                '& .MuiOutlinedInput-root': {
                                                    color: 'white',
                                                    '& fieldset': { borderColor: '#333' },
                                                    '&:hover fieldset': { borderColor: '#4caf50' }
                                                }
                                            }}
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Category</InputLabel>
                                    <Select
                                        value={category}
                                        onChange={handleCategoryChange}
                                        label="Category"
                                        sx={{
                                            color: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' }
                                        }}
                                    >
                                        <MenuItem value="all">All Categories</MenuItem>
                                        <MenuItem value="coffee">Coffee</MenuItem>
                                        <MenuItem value="food">Food</MenuItem>
                                        <MenuItem value="desserts">Desserts</MenuItem>
                                        <MenuItem value="beverages">Beverages</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="outlined"
                                    onClick={handleRefresh}
                                    startIcon={<RefreshIcon />}
                                    fullWidth
                                    sx={{
                                        borderColor: '#4caf50',
                                        color: '#4caf50',
                                        '&:hover': {
                                            borderColor: '#45a049',
                                            backgroundColor: 'rgba(76, 175, 80, 0.1)'
                                        }
                                    }}
                                >
                                    Refresh
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Top section: Today's Highlights (left) and KPI cards (right) */}
                    <Box mb={4}>
                        <Grid container spacing={3} alignItems="flex-start">
                            <Grid item xs={12} md={3}>
                                <Card className="card-neutral" sx={{ borderRadius: 3, height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom sx={{ color: 'rgba(0,0,0,0.87)', fontWeight: '700' }}>
                                            Today's Highlights
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <TrendingUpIcon sx={{ color: 'var(--accent)' }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.87)' }}>
                                                        Peak Hour: {dashboardData?.kpi?.peak_hour || '—'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'var(--muted)' }}>
                                                        ₹{dashboardData?.kpi?.peak_hour_revenue ?? '—'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <MoneyIcon sx={{ color: '#42a5f5' }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: 'white' }}>
                                                        Avg. Order Value: ₹{dashboardData?.kpi?.avg_order_value ?? '—'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                        {dashboardData?.kpi?.avg_order_delta ? `${dashboardData.kpi.avg_order_delta}% from yesterday` : ''}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <CartIcon sx={{ color: '#ff9800' }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: 'white' }}>
                                                        Top Item: {dashboardData?.top_products?.[0]?.item_name ?? '—'}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                                        {dashboardData?.top_products?.[0]?.quantity ?? '—'} orders today
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <PeopleIcon sx={{ color: '#9c27b0' }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ color: 'white' }}>
                                                        Customer Satisfaction
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                        <Chip label={feedbackSummary?.positive_pct ? `${feedbackSummary.positive_pct}% Positive` : '—'} size="small"
                                                            sx={{ bgcolor: '#4caf50', color: 'white', fontSize: '0.7rem' }} />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={9}>
                                <KPIGrid data={dashboardData} loading={loading} />
                            </Grid>

                            {/* Revenue Trend and Top Products */}
                            <Grid item xs={12} md={8}>
                                <RevenueChart data={revenueData} loading={loading} />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <ProductSalesChart data={productData} loading={loading} />
                            </Grid>

                            {/* Payment Distribution and Sales Heatmap */}
                            <Grid item xs={12} md={4}>
                                <PaymentMethodChart
                                    data={dashboardData?.payment_distribution}
                                    loading={loading}
                                />
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <TimeHeatmap data={heatmapData} />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </DashboardLayout>
        </Box>
    );
};

export default Dashboard;