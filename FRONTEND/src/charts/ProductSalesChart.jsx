import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import api from '../services/api';

export default function ProductSalesChart({ data = [] }) {
    const [products, setProducts] = useState(data || []);

    useEffect(() => {
        if (!data || data.length === 0) {
            api.get('/product-analytics').then(res => {
                setProducts(res.data.top_products || []);
            }).catch(() => { });
        } else {
            setProducts(data);
        }
    }, [data]);

    return (
        <Card sx={{ borderRadius: 10, boxShadow: '0 6px 18px rgba(11,106,63,0.04)' }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: '#0b6a3f', fontWeight: 700 }}>Top Products</Typography>
                <Box sx={{ mt: 2 }}>
                    <List>
                        {products.map((p, idx) => (
                            <ListItem key={idx} divider>
                                <ListItemText primary={p.item_name || p['item_name']} secondary={`Revenue: ₹${(p.revenue || p.total || 0).toLocaleString()}`} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </CardContent>
        </Card>
    );
}
