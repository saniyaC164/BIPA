import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function Navbar() {
    return (
        <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: '#f7faf7', borderBottom: '1px solid #e6f3ea' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, color: '#1b8a51', fontWeight: 600 }}>
                    Café Analytics
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton size="small" aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <IconButton size="small" aria-label="notifications">
                        <NotificationsIcon />
                    </IconButton>
                    <Avatar alt="User" src="/vite.svg" sx={{ width: 32, height: 32 }} />
                </Box>
            </Toolbar>
        </AppBar>
    );
}
