import React from 'react';
import { Box, Container } from '@mui/material';

export default function DashboardLayout({ children }) {
    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'transparent', color: 'rgba(0,0,0,0.87)' }}>
            <Container maxWidth={false} className="page-container" sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
                {children}
            </Container>
        </Box>
    );
}
