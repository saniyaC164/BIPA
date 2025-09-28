import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Slider,
    Button,
    Alert,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    Download as DownloadIcon,
    Settings as SettingsIcon,
    Analytics as AnalyticsIcon,
    CalendarToday as CalendarIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
    Area,
    AreaChart,
} from 'recharts';
import DashboardLayout from '../layout/DashboardLayout';
import Navbar from '../layout/Navbar';

const Reports = () => {
    const [selectedModel, setSelectedModel] = useState('prophet');
    const [forecastDays, setForecastDays] = useState(30);
    const [seasonalityStrength, setSeasonalityStrength] = useState(0.7);
    const [trendStrength, setTrendStrength] = useState(0.5);
    const [isForecasting, setIsForecasting] = useState(false);

    // Mock historical and forecast data
    const generateForecastData = () => {
        const baseData = [];
        const today = new Date();

        // Historical data (last 60 days)
        for (let i = 60; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Simulate realistic sales data with trends and seasonality
            const dayOfWeek = date.getDay();
            const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 1.2 : 1.0;
            const timeBoost = Math.sin((i / 60) * Math.PI * 2) * 0.2 + 1; // Seasonal variation
            const noise = Math.random() * 0.2 + 0.9; // Random variation

            const baseRevenue = 12000;
            const actualRevenue = Math.round(baseRevenue * weekendBoost * timeBoost * noise);

            baseData.push({
                date: date.toISOString().split('T')[0],
                actual: actualRevenue,
                type: 'historical'
            });
        }

        // Forecast data (future days)
        for (let i = 1; i <= forecastDays; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);

            const dayOfWeek = date.getDay();
            const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 1.2 : 1.0;
            const trendBoost = 1 + (trendStrength * 0.001 * i); // Slight upward trend
            const seasonalBoost = Math.sin((i / 365) * Math.PI * 2) * seasonalityStrength * 0.1 + 1;

            const baseRevenue = 12000;
            const predictedRevenue = Math.round(baseRevenue * weekendBoost * trendBoost * seasonalBoost);

            // Add confidence intervals
            const upperBound = Math.round(predictedRevenue * 1.15);
            const lowerBound = Math.round(predictedRevenue * 0.85);

            baseData.push({
                date: date.toISOString().split('T')[0],
                predicted: predictedRevenue,
                upperBound,
                lowerBound,
                type: 'forecast'
            });
        }

        return baseData;
    };

    const [forecastData, setForecastData] = useState(generateForecastData());

    const accuracyMetrics = {
        mae: 856.23,  // Mean Absolute Error
        rmse: 1247.89, // Root Mean Square Error
        mape: 7.8,    // Mean Absolute Percentage Error
        r2: 0.87      // R-squared
    };

    const nextWeekForecast = [
        { day: 'Monday', predicted: 11850, confidence: 0.89 },
        { day: 'Tuesday', predicted: 10920, confidence: 0.92 },
        { day: 'Wednesday', predicted: 11240, confidence: 0.88 },
        { day: 'Thursday', predicted: 12100, confidence: 0.91 },
        { day: 'Friday', predicted: 13450, confidence: 0.87 },
        { day: 'Saturday', predicted: 15200, confidence: 0.83 },
        { day: 'Sunday', predicted: 14800, confidence: 0.85 }
    ];

    const handleRunForecast = () => {
        setIsForecasting(true);
        setTimeout(() => {
            setForecastData(generateForecastData());
            setIsForecasting(false);
        }, 2000);
    };

    const ForecastSummaryCards = () => {
        const totalPredicted = forecastData
            .filter(d => d.type === 'forecast')
            .reduce((sum, d) => sum + (d.predicted || 0), 0);

        const avgDaily = Math.round(totalPredicted / forecastDays);

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                    <Card sx={{ backgroundColor: '#2d2d2d', border: '1px solid #333' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <TrendingUpIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                ₹{Math.round(totalPredicted / 100000)}L
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Next {forecastDays} Days Revenue
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card sx={{ backgroundColor: '#2d2d2d', border: '1px solid #333' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <CalendarIcon sx={{ fontSize: 32, color: '#42a5f5', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                ₹{avgDaily.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Avg Daily Revenue
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card sx={{ backgroundColor: '#2d2d2d', border: '1px solid #333' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <AssessmentIcon sx={{ fontSize: 32, color: '#ff9800', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                {accuracyMetrics.r2 * 100}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Model Accuracy
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card sx={{ backgroundColor: '#2d2d2d', border: '1px solid #333' }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <AnalyticsIcon sx={{ fontSize: 32, color: '#9c27b0', mb: 1 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                                {accuracyMetrics.mape}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Prediction Error
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    const ModelParametersPanel = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Model Configuration
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Forecasting Model</InputLabel>
                            <Select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                label="Forecasting Model"
                                sx={{
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4caf50' }
                                }}
                            >
                                <MenuItem value="prophet">Prophet (Facebook)</MenuItem>
                                <MenuItem value="arima">ARIMA</MenuItem>
                                <MenuItem value="lstm">LSTM Neural Network</MenuItem>
                                <MenuItem value="linear">Linear Regression</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Forecast Period: {forecastDays} days
                        </Typography>
                        <Slider
                            value={forecastDays}
                            onChange={(e, value) => setForecastDays(value)}
                            min={7}
                            max={90}
                            step={1}
                            marks={[
                                { value: 7, label: '1w' },
                                { value: 30, label: '1m' },
                                { value: 90, label: '3m' }
                            ]}
                            sx={{
                                color: '#4caf50',
                                '& .MuiSlider-thumb': { backgroundColor: '#4caf50' },
                                '& .MuiSlider-track': { backgroundColor: '#4caf50' },
                                '& .MuiSlider-rail': { backgroundColor: '#333' }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Seasonality: {seasonalityStrength.toFixed(2)}
                        </Typography>
                        <Slider
                            value={seasonalityStrength}
                            onChange={(e, value) => setSeasonalityStrength(value)}
                            min={0}
                            max={1}
                            step={0.1}
                            sx={{
                                color: '#42a5f5',
                                '& .MuiSlider-thumb': { backgroundColor: '#42a5f5' },
                                '& .MuiSlider-track': { backgroundColor: '#42a5f5' },
                                '& .MuiSlider-rail': { backgroundColor: '#333' }
                            }}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleRunForecast}
                        disabled={isForecasting}
                        startIcon={<TrendingUpIcon />}
                        sx={{
                            backgroundColor: '#4caf50',
                            '&:hover': { backgroundColor: '#45a049' }
                        }}
                    >
                        {isForecasting ? 'Running Forecast...' : 'Run Forecast'}
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        sx={{
                            borderColor: '#42a5f5',
                            color: '#42a5f5',
                            '&:hover': {
                                borderColor: '#1976d2',
                                backgroundColor: 'rgba(66, 165, 245, 0.1)'
                            }
                        }}
                    >
                        Export Forecast
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    const ForecastChart = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Revenue Forecast - Historical vs Predicted
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    {selectedModel.toUpperCase()} model prediction with confidence intervals
                </Typography>

                <Box sx={{ height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecastData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="date"
                                stroke="rgba(255,255,255,0.7)"
                                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.7)"
                                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                                labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                                formatter={(value, name) => [
                                    `₹${value?.toLocaleString() || 'N/A'}`,
                                    name === 'actual' ? 'Actual Revenue' :
                                        name === 'predicted' ? 'Predicted Revenue' :
                                            name === 'upperBound' ? 'Upper Bound' : 'Lower Bound'
                                ]}
                            />
                            <Legend />

                            {/* Historical data */}
                            <Line
                                type="monotone"
                                dataKey="actual"
                                stroke="#42a5f5"
                                strokeWidth={2}
                                dot={false}
                                connectNulls={false}
                            />

                            {/* Predicted data */}
                            <Line
                                type="monotone"
                                dataKey="predicted"
                                stroke="#4caf50"
                                strokeWidth={2}
                                strokeDasharray="5,5"
                                dot={false}
                                connectNulls={false}
                            />

                            {/* Confidence intervals */}
                            <Line
                                type="monotone"
                                dataKey="upperBound"
                                stroke="rgba(76, 175, 80, 0.3)"
                                strokeWidth={1}
                                dot={false}
                                connectNulls={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="lowerBound"
                                stroke="rgba(76, 175, 80, 0.3)"
                                strokeWidth={1}
                                dot={false}
                                connectNulls={false}
                            />

                            {/* Reference line for today */}
                            <ReferenceLine x={new Date().toISOString().split('T')[0]} stroke="rgba(255, 255, 255, 0.5)" strokeDasharray="2,2" label="Today" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );

    const AccuracyMetricsPanel = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Model Accuracy Metrics
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Performance evaluation on historical data
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: 'white' }}>R² Score</Typography>
                            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                {(accuracyMetrics.r2 * 100).toFixed(1)}%
                            </Typography>
                        </Box>
                        <Box sx={{
                            width: '100%',
                            height: 8,
                            backgroundColor: '#333',
                            borderRadius: 1,
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                width: `${accuracyMetrics.r2 * 100}%`,
                                height: '100%',
                                backgroundColor: '#4caf50'
                            }} />
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                            Mean Absolute Error:
                            <Chip
                                label={`₹${accuracyMetrics.mae.toLocaleString()}`}
                                size="small"
                                sx={{ ml: 1, backgroundColor: '#42a5f5', color: 'white' }}
                            />
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                            Root Mean Square Error:
                            <Chip
                                label={`₹${accuracyMetrics.rmse.toLocaleString()}`}
                                size="small"
                                sx={{ ml: 1, backgroundColor: '#ff9800', color: 'white' }}
                            />
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                            Mean Absolute Percentage Error:
                            <Chip
                                label={`${accuracyMetrics.mape}%`}
                                size="small"
                                sx={{
                                    ml: 1,
                                    backgroundColor: accuracyMetrics.mape < 10 ? '#4caf50' : '#f44336',
                                    color: 'white'
                                }}
                            />
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    const NextWeekTable = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Next 7 Days Forecast
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Daily revenue predictions with confidence levels
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Day
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Predicted Revenue
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Confidence
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    vs Yesterday
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {nextWeekForecast.map((day, index) => (
                                <TableRow key={day.day}>
                                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                                        {day.day}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        ₹{day.predicted.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{
                                                width: 60,
                                                height: 6,
                                                backgroundColor: '#333',
                                                borderRadius: 1,
                                                overflow: 'hidden'
                                            }}>
                                                <Box sx={{
                                                    width: `${day.confidence * 100}%`,
                                                    height: '100%',
                                                    backgroundColor: day.confidence > 0.9 ? '#4caf50' :
                                                        day.confidence > 0.8 ? '#ff9800' : '#f44336'
                                                }} />
                                            </Box>
                                            <Typography variant="caption" sx={{ color: 'white' }}>
                                                {(day.confidence * 100).toFixed(0)}%
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {index > 0 && (
                                            <Chip
                                                label={`${((day.predicted - nextWeekForecast[index - 1].predicted) / nextWeekForecast[index - 1].predicted * 100).toFixed(1)}%`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: day.predicted > (nextWeekForecast[index - 1]?.predicted || day.predicted) ? '#4caf50' : '#f44336',
                                                    color: 'white'
                                                }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );

    const ScenarioAnalysis = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Scenario Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    What-if analysis for different business scenarios
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Marketing Boost: +{Math.round(trendStrength * 100)}%
                        </Typography>
                        <Slider
                            value={trendStrength}
                            onChange={(e, value) => setTrendStrength(value)}
                            min={0}
                            max={1}
                            step={0.1}
                            sx={{
                                color: '#4caf50',
                                '& .MuiSlider-thumb': { backgroundColor: '#4caf50' },
                                '& .MuiSlider-track': { backgroundColor: '#4caf50' },
                                '& .MuiSlider-rail': { backgroundColor: '#333' }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Alert
                            severity="info"
                            sx={{
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                color: 'white',
                                '& .MuiAlert-icon': { color: '#42a5f5' }
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Best Case:</strong><br />
                                +25% revenue increase<br />
                                ₹{Math.round(15000 * 1.25).toLocaleString()}/day
                            </Typography>
                        </Alert>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Alert
                            severity="warning"
                            sx={{
                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                color: 'white',
                                '& .MuiAlert-icon': { color: '#ff9800' }
                            }}
                        >
                            <Typography variant="body2">
                                <strong>Conservative:</strong><br />
                                Current trend continues<br />
                                ₹{Math.round(12000).toLocaleString()}/day
                            </Typography>
                        </Alert>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );

    useEffect(() => {
        setForecastData(generateForecastData());
    }, [forecastDays, selectedModel, seasonalityStrength, trendStrength]);

    return (
        <Box>
            <Navbar />
            <DashboardLayout>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                        AI Sales Forecasting
                    </Typography>

                    {/* Summary Cards */}
                    <Box mb={4}>
                        <ForecastSummaryCards />
                    </Box>

                    {/* Model Parameters */}
                    <Box mb={4}>
                        <ModelParametersPanel />
                    </Box>

                    <Grid container spacing={3}>
                        {/* Forecast Chart */}
                        <Grid item xs={12} lg={8}>
                            <ForecastChart />
                        </Grid>

                        {/* Accuracy Metrics */}
                        <Grid item xs={12} lg={4}>
                            <AccuracyMetricsPanel />
                        </Grid>

                        {/* Next Week Table */}
                        <Grid item xs={12} lg={6}>
                            <NextWeekTable />
                        </Grid>

                        {/* Scenario Analysis */}
                        <Grid item xs={12} lg={6}>
                            <ScenarioAnalysis />
                        </Grid>
                    </Grid>

                    {/* Additional Insights */}
                    <Box sx={{ mt: 4 }}>
                        <Alert
                            severity="success"
                            sx={{
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                border: '1px solid rgba(76, 175, 80, 0.3)',
                                color: 'white',
                                '& .MuiAlert-icon': { color: '#4caf50' }
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                📈 Forecast Insights
                            </Typography>
                            <Typography variant="body2">
                                The model predicts a steady growth pattern with weekend peaks. Consider increasing inventory for Fridays and Saturdays.
                                The {accuracyMetrics.r2 > 0.8 ? 'high' : 'moderate'} accuracy score ({(accuracyMetrics.r2 * 100).toFixed(1)}%)
                                suggests reliable predictions for the next {forecastDays} days.
                            </Typography>
                        </Alert>
                    </Box>
                </Box>
            </DashboardLayout>
        </Box>
    );
};

export default Reports;