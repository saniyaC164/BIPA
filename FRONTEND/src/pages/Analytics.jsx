import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Analytics() {
    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }} elevation={2}>
                <Typography variant="h4" gutterBottom>
                    Analytics
                </Typography>
                <Typography variant="body1">This page will host charts, KPIs and time-series analytics.</Typography>
            </Paper>
        </Box>
    );
}
