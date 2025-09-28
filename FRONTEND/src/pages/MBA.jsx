import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    Slider,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Paper,
    Button,
    Alert,
} from '@mui/material';
import {
    NetworkCheck as NetworkIcon,
    TrendingUp as TrendingUpIcon,
    ShoppingCart as CartIcon,
    Lightbulb as InsightIcon,
} from '@mui/icons-material';
import DashboardLayout from '../layout/DashboardLayout';
import Navbar from '../layout/Navbar';

const MBA = () => {
    const [minSupport, setMinSupport] = useState(0.1);
    const [minConfidence, setMinConfidence] = useState(0.5);
    const [associationRules, setAssociationRules] = useState([]);
    const [loading, setLoading] = useState(false);

    // Mock data for demonstration
    const mockRules = [
        {
            antecedents: ['Cappuccino'],
            consequents: ['Croissant'],
            support: 0.25,
            confidence: 0.78,
            lift: 1.8,
            conviction: 2.1
        },
        {
            antecedents: ['Latte'],
            consequents: ['Blueberry Muffin'],
            support: 0.18,
            confidence: 0.65,
            lift: 1.5,
            conviction: 1.7
        },
        {
            antecedents: ['Espresso'],
            consequents: ['Chocolate Cake'],
            support: 0.15,
            confidence: 0.72,
            lift: 2.1,
            conviction: 2.5
        },
        {
            antecedents: ['Green Tea'],
            consequents: ['Veggie Sandwich'],
            support: 0.12,
            confidence: 0.68,
            lift: 1.9,
            conviction: 2.2
        },
        {
            antecedents: ['Americano'],
            consequents: ['Cheesecake'],
            support: 0.20,
            confidence: 0.61,
            lift: 1.4,
            conviction: 1.6
        }
    ];

    const networkData = {
        nodes: [
            { id: 'Cappuccino', group: 'coffee', size: 30 },
            { id: 'Croissant', group: 'food', size: 25 },
            { id: 'Latte', group: 'coffee', size: 28 },
            { id: 'Blueberry Muffin', group: 'food', size: 20 },
            { id: 'Espresso', group: 'coffee', size: 26 },
            { id: 'Chocolate Cake', group: 'dessert', size: 22 },
            { id: 'Green Tea', group: 'tea', size: 18 },
            { id: 'Veggie Sandwich', group: 'food', size: 24 },
            { id: 'Americano', group: 'coffee', size: 27 },
            { id: 'Cheesecake', group: 'dessert', size: 21 }
        ],
        links: [
            { source: 'Cappuccino', target: 'Croissant', strength: 1.8 },
            { source: 'Latte', target: 'Blueberry Muffin', strength: 1.5 },
            { source: 'Espresso', target: 'Chocolate Cake', strength: 2.1 },
            { source: 'Green Tea', target: 'Veggie Sandwich', strength: 1.9 },
            { source: 'Americano', target: 'Cheesecake', strength: 1.4 }
        ]
    };

    const getGroupColor = (group) => {
        const colors = {
            coffee: '#8D4004',
            food: '#4caf50',
            dessert: '#ff9800',
            tea: '#4CAF50'
        };
        return colors[group] || '#42a5f5';
    };

    const NetworkVisualization = ({ data }) => {
        const svgWidth = 600;
        const svgHeight = 400;
        const centerX = svgWidth / 2;
        const centerY = svgHeight / 2;
        const radius = 150;

        // Position nodes in a circle
        const positionedNodes = data.nodes.map((node, index) => {
            const angle = (index / data.nodes.length) * 2 * Math.PI;
            return {
                ...node,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            };
        });

        return (
            <Card sx={{
                backgroundColor: '#2d2d2d',
                border: '1px solid #333',
                borderRadius: 3,
                height: '100%'
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                        Product Association Network
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                        Interactive network showing product relationships
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <svg width={svgWidth} height={svgHeight} style={{ border: '1px solid #333', borderRadius: '8px', backgroundColor: '#1a1a1a' }}>
                            {/* Links */}
                            {data.links.map((link, index) => {
                                const sourceNode = positionedNodes.find(n => n.id === link.source);
                                const targetNode = positionedNodes.find(n => n.id === link.target);
                                if (!sourceNode || !targetNode) return null;

                                const strokeWidth = link.strength * 2;
                                const opacity = Math.min(link.strength / 2, 0.8);

                                return (
                                    <line
                                        key={index}
                                        x1={sourceNode.x}
                                        y1={sourceNode.y}
                                        x2={targetNode.x}
                                        y2={targetNode.y}
                                        stroke="#4caf50"
                                        strokeWidth={strokeWidth}
                                        opacity={opacity}
                                    />
                                );
                            })}

                            {/* Nodes */}
                            {positionedNodes.map((node, index) => (
                                <g key={index}>
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={node.size}
                                        fill={getGroupColor(node.group)}
                                        stroke="#fff"
                                        strokeWidth="2"
                                        opacity="0.8"
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <text
                                        x={node.x}
                                        y={node.y + node.size + 15}
                                        textAnchor="middle"
                                        fill="rgba(255,255,255,0.8)"
                                        fontSize="11px"
                                        fontWeight="bold"
                                    >
                                        {node.id.length > 10 ? `${node.id.substring(0, 8)}...` : node.id}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </Box>

                    {/* Legend */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {Object.entries({ coffee: 'Coffee', food: 'Food', dessert: 'Dessert', tea: 'Tea' }).map(([key, label]) => (
                            <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        backgroundColor: getGroupColor(key),
                                        border: '1px solid #fff'
                                    }}
                                />
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        );
    };

    const SummaryCards = () => (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
                <Card sx={{ backgroundColor: '#2d2d2d', border: '1px solid #333' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <NetworkIcon sx={{ fontSize: 32, color: '#42a5f5', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {mockRules.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Association Rules
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card sx={{ backgroundColor: '#2d2d2d', border: '1px solid #333' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <TrendingUpIcon sx={{ fontSize: 32, color: '#4caf50', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {Math.max(...mockRules.map(r => r.lift)).toFixed(1)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Max Lift Score
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
                <Card sx={{ backgroundColor: '#2d2d2d', border: '1px solid #333' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                        <CartIcon sx={{ fontSize: 32, color: '#ff9800', mb: 1 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                            {(mockRules.reduce((sum, r) => sum + r.support, 0) / mockRules.length * 100).toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            Avg Support
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );

    const ControlPanel = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                    Analysis Parameters
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Minimum Support: {minSupport.toFixed(2)}
                        </Typography>
                        <Slider
                            value={minSupport}
                            onChange={(e, value) => setMinSupport(value)}
                            min={0.05}
                            max={0.5}
                            step={0.01}
                            sx={{
                                color: '#4caf50',
                                '& .MuiSlider-thumb': { backgroundColor: '#4caf50' },
                                '& .MuiSlider-track': { backgroundColor: '#4caf50' },
                                '& .MuiSlider-rail': { backgroundColor: '#333' }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography gutterBottom sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Minimum Confidence: {minConfidence.toFixed(2)}
                        </Typography>
                        <Slider
                            value={minConfidence}
                            onChange={(e, value) => setMinConfidence(value)}
                            min={0.1}
                            max={1.0}
                            step={0.01}
                            sx={{
                                color: '#42a5f5',
                                '& .MuiSlider-thumb': { backgroundColor: '#42a5f5' },
                                '& .MuiSlider-track': { backgroundColor: '#42a5f5' },
                                '& .MuiSlider-rail': { backgroundColor: '#333' }
                            }}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        onClick={() => setLoading(true)}
                        sx={{
                            backgroundColor: '#4caf50',
                            '&:hover': { backgroundColor: '#45a049' }
                        }}
                    >
                        Update Analysis
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );

    const AssociationRulesTable = ({ rules }) => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                    Association Rules
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2 }}>
                    Product associations sorted by lift score
                </Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    If Customer Buys
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Then Also Buys
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Support
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Confidence
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Lift
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rules
                                .filter(rule => rule.support >= minSupport && rule.confidence >= minConfidence)
                                .sort((a, b) => b.lift - a.lift)
                                .map((rule, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ color: 'white' }}>
                                            <Chip
                                                label={rule.antecedents.join(', ')}
                                                size="small"
                                                sx={{ backgroundColor: '#42a5f5', color: 'white' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            <Chip
                                                label={rule.consequents.join(', ')}
                                                size="small"
                                                sx={{ backgroundColor: '#4caf50', color: 'white' }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            {(rule.support * 100).toFixed(1)}%
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            {(rule.confidence * 100).toFixed(1)}%
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            <Chip
                                                label={rule.lift.toFixed(2)}
                                                size="small"
                                                sx={{
                                                    backgroundColor: rule.lift > 1.5 ? '#4caf50' :
                                                        rule.lift > 1.0 ? '#ff9800' : '#f44336',
                                                    color: 'white'
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );

    const InsightsPanel = () => {
        const insights = [
            {
                title: "Top Cross-Sell Opportunity",
                description: "Customers buying Espresso are 2.1x more likely to purchase Chocolate Cake",
                action: "Create 'Afternoon Treat' combo offer",
                impact: "Potential 15% revenue increase"
            },
            {
                title: "Healthy Options Pairing",
                description: "Green Tea and Veggie Sandwich show strong correlation (1.9x lift)",
                action: "Promote as 'Healthy Choice' menu section",
                impact: "Appeal to health-conscious customers"
            },
            {
                title: "Classic Coffee Combo",
                description: "Cappuccino and Croissant remain the strongest pairing (1.8x lift)",
                action: "Maintain as signature breakfast combo",
                impact: "Consistent revenue driver"
            }
        ];

        return (
            <Card sx={{
                backgroundColor: '#2d2d2d',
                border: '1px solid #333',
                borderRadius: 3,
            }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                        <InsightIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Key Insights & Recommendations
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {insights.map((insight, index) => (
                            <Alert
                                key={index}
                                severity="info"
                                sx={{
                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                    border: '1px solid rgba(33, 150, 243, 0.3)',
                                    color: 'white',
                                    '& .MuiAlert-icon': { color: '#42a5f5' }
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {insight.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    {insight.description}
                                </Typography>
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#4caf50' }}>
                                    💡 Action: {insight.action}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    📈 Impact: {insight.impact}
                                </Typography>
                            </Alert>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        );
    };

    useEffect(() => {
        setAssociationRules(mockRules);
    }, []);

    return (
        <Box>
            <Navbar />
            <DashboardLayout>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                        Market Basket Analysis
                    </Typography>

                    {/* Summary Cards */}
                    <Box mb={4}>
                        <SummaryCards />
                    </Box>

                    {/* Control Panel */}
                    <Box mb={4}>
                        <ControlPanel />
                    </Box>

                    <Grid container spacing={3}>
                        {/* Network Visualization */}
                        <Grid item xs={12} lg={8}>
                            <NetworkVisualization data={networkData} />
                        </Grid>

                        {/* Insights Panel */}
                        <Grid item xs={12} lg={4}>
                            <InsightsPanel />
                        </Grid>

                        {/* Association Rules Table */}
                        <Grid item xs={12}>
                            <AssociationRulesTable rules={associationRules} />
                        </Grid>
                    </Grid>
                </Box>
            </DashboardLayout>
        </Box>
    );
};

export default MBA;