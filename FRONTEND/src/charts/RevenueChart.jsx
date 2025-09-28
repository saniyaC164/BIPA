import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import api from '../services/api';

function formatCurrency(val) {
    if (val == null) return '₹0';
    return `₹${Number(val).toLocaleString()}`;
}

export default function RevenueChart({ data = [] }) {
    const [trend, setTrend] = useState(data || []);

    useEffect(() => {
        if (!data || data.length === 0) {
            api.get('/revenue-trends').then(res => {
                const raw = res.data.data || [];
                // normalize data points: ensure date and total_revenue keys
                const normalized = raw.map(item => ({
                    date: item.date || item[0] || '',
                    total_revenue: Number(item.total_revenue ?? item[1] ?? 0)
                }));
                setTrend(normalized);
            }).catch(() => { setTrend([]); });
        } else {
            setTrend(data);
        }
    }, [data]);

    return (
        <Card sx={{ borderRadius: 10, boxShadow: '0 6px 18px rgba(11,106,63,0.04)' }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: '#0b6a3f', fontWeight: 700 }}>Sales Trend</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', mb: 2 }}>Daily revenue over selected range</Typography>

                <Box sx={{ height: 300 }}>
                    {trend && trend.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2bb673" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#2bb673" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e6f3ea" />
                                <XAxis dataKey="date" tick={{ fill: 'rgba(0,0,0,0.6)' }} />
                                <YAxis tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)} tick={{ fill: 'rgba(0,0,0,0.6)' }} />
                                <Tooltip formatter={(value) => formatCurrency(value)} labelStyle={{ color: 'rgba(0,0,0,0.7)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="total_revenue" stroke="#2bb673" strokeWidth={3} dot={false} fillOpacity={1} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1, bgcolor: '#fafdf9', border: '1px dashed #e6f3ea' }}>
                            <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.3)' }}>Sales Line Chart Placeholder</Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
