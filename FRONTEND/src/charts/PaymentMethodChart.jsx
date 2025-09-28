import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, LinearProgress, Box } from '@mui/material';
import api from '../services/api';

export default function PaymentMethodChart({ data = [] }) {
    const [methods, setMethods] = useState(data || []);

    useEffect(() => {
        if (!data || data.length === 0) {
            api.get('/dashboard-data').then(res => {
                setMethods(res.data.payment_distribution || []);
            }).catch(() => { });
        } else {
            setMethods(data);
        }
    }, [data]);

    return (
        <Card sx={{ borderRadius: 10, boxShadow: '0 6px 18px rgba(11,106,63,0.04)' }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: '#0b6a3f', fontWeight: 700 }}>Payment Mix</Typography>
                <Box sx={{ mt: 2 }}>
                    <List>
                        {methods.map((m, idx) => (
                            <ListItem key={idx} sx={{ alignItems: 'center' }}>
                                <ListItemText primary={m.method} secondary={`₹${(m.revenue || 0).toLocaleString()}`} />
                                <Box sx={{ width: '40%' }}>
                                    <LinearProgress variant="determinate" value={m.pct || 0} sx={{ height: 8, borderRadius: 2, bgcolor: '#eef9ef', '& .MuiLinearProgress-bar': { bgcolor: '#2bb673' } }} />
                                </Box>
                                <Typography sx={{ ml: 2, color: 'rgba(0,0,0,0.6)' }}>{m.pct}%</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </CardContent>
        </Card>
    );
}
