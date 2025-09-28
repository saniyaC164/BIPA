import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function Inventory() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }} elevation={2}>
        <Typography variant="h4" gutterBottom>
          Inventory
        </Typography>
        <Typography variant="body1">Inventory dashboard and reorder alerts will appear here.</Typography>
      </Paper>
    </Box>
  );
}
