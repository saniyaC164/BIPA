import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

export default function KPIGrid({ data = {} }) {
    // data.kpi expected from backend: { total_revenue, total_transactions, avg_order_value }
    const kpi = data.kpi || {};

    const items = [
        { label: 'Revenue', value: kpi.total_revenue ? `₹${kpi.total_revenue.toLocaleString()}` : '—', color: '#2bb673' },
        { label: 'Transactions', value: kpi.total_transactions ?? '—', color: '#6fb5ff' },
        { label: 'Avg Order', value: kpi.avg_order_value ? `₹${kpi.avg_order_value}` : '—', color: '#ffb347' }
    ];

    return (
        <Grid container spacing={2}>
            {items.map((it, idx) => (
                <Grid item xs={12} sm={4} key={idx}>
                    <Card sx={{ borderRadius: 10, boxShadow: '0 4px 10px rgba(27,138,81,0.06)' }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ color: 'rgba(0,0,0,0.6)' }}>{it.label}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0b6a3f' }}>{it.value}</Typography>
                                <Box sx={{ ml: 1, width: 10, height: 10, bgcolor: it.color, borderRadius: '50%' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
