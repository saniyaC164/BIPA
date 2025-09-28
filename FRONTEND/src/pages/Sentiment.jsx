import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Paper,
    Alert,
    LinearProgress,
    IconButton,
    Collapse,
} from '@mui/material';
import {
    SentimentSatisfied as PositiveIcon,
    SentimentDissatisfied as NegativeIcon,
    SentimentNeutral as NeutralIcon,
    CloudUpload as UploadIcon,
    ExpandMore as ExpandIcon,
    ExpandLess as CollapseIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from 'recharts';
import DashboardLayout from '../layout/DashboardLayout';
import Navbar from '../layout/Navbar';

const Sentiment = () => {
    const [feedbackText, setFeedbackText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [expandedRows, setExpandedRows] = useState(new Set());

    // Mock sentiment data
    const sentimentData = [
        { name: 'Positive', value: 68, count: 342, color: '#4caf50' },
        { name: 'Neutral', value: 22, count: 110, color: '#ff9800' },
        { name: 'Negative', value: 10, count: 50, color: '#f44336' }
    ];

    const trendData = [
        { date: '2024-01-01', positive: 65, neutral: 25, negative: 10 },
        { date: '2024-01-02', positive: 70, neutral: 20, negative: 10 },
        { date: '2024-01-03', positive: 68, neutral: 22, negative: 10 },
        { date: '2024-01-04', positive: 72, neutral: 18, negative: 10 },
        { date: '2024-01-05', positive: 69, neutral: 21, negative: 10 },
        { date: '2024-01-06', positive: 71, neutral: 19, negative: 10 },
        { date: '2024-01-07', positive: 68, neutral: 22, negative: 10 },
    ];

    const mockFeedback = [
        {
            id: 1,
            text: "Amazing coffee and great atmosphere! The staff is very friendly and the service is quick.",
            sentiment: 'positive',
            confidence: 0.92,
            timestamp: '2024-01-07 14:30',
            keywords: ['amazing', 'great', 'friendly', 'quick']
        },
        {
            id: 2,
            text: "The coffee was okay, but the wait time was quite long. Could be improved.",
            sentiment: 'neutral',
            confidence: 0.78,
            timestamp: '2024-01-07 13:15',
            keywords: ['okay', 'long', 'improved']
        },
        {
            id: 3,
            text: "Terrible experience. Coffee was cold and the staff seemed uninterested.",
            sentiment: 'negative',
            confidence: 0.89,
            timestamp: '2024-01-07 12:45',
            keywords: ['terrible', 'cold', 'uninterested']
        },
        {
            id: 4,
            text: "Love this place! Best cappuccino in town and the pastries are delicious.",
            sentiment: 'positive',
            confidence: 0.95,
            timestamp: '2024-01-07 11:20',
            keywords: ['love', 'best', 'delicious']
        },
        {
            id: 5,
            text: "Average coffee, nothing special. Pricing is reasonable though.",
            sentiment: 'neutral',
            confidence: 0.71,
            timestamp: '2024-01-07 10:30',
            keywords: ['average', 'reasonable']
        }
    ];

    const wordCloudData = [
        { text: 'great', value: 45, sentiment: 'positive' },
        { text: 'coffee', value: 38, sentiment: 'neutral' },
        { text: 'service', value: 32, sentiment: 'neutral' },
        { text: 'friendly', value: 28, sentiment: 'positive' },
        { text: 'delicious', value: 25, sentiment: 'positive' },
        { text: 'slow', value: 18, sentiment: 'negative' },
        { text: 'expensive', value: 15, sentiment: 'negative' },
        { text: 'atmosphere', value: 22, sentiment: 'positive' },
        { text: 'clean', value: 20, sentiment: 'positive' },
        { text: 'staff', value: 30, sentiment: 'neutral' },
        { text: 'quality', value: 26, sentiment: 'positive' },
        { text: 'wait', value: 16, sentiment: 'negative' }
    ];

    const getSentimentIcon = (sentiment) => {
        switch (sentiment) {
            case 'positive':
                return <PositiveIcon sx={{ color: '#4caf50' }} />;
            case 'negative':
                return <NegativeIcon sx={{ color: '#f44336' }} />;
            default:
                return <NeutralIcon sx={{ color: '#ff9800' }} />;
        }
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'positive':
                return '#4caf50';
            case 'negative':
                return '#f44336';
            default:
                return '#ff9800';
        }
    };

    const handleAnalyzeFeedback = () => {
        if (!feedbackText.trim()) return;

        setAnalyzing(true);

        // Simulate API call
        setTimeout(() => {
            const randomSentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)];
            const confidence = Math.random() * 0.3 + 0.7; // 0.7 to 1.0

            alert(`Analysis Complete!\nSentiment: ${randomSentiment}\nConfidence: ${(confidence * 100).toFixed(1)}%`);
            setFeedbackText('');
            setAnalyzing(false);
        }, 2000);
    };

    const toggleRowExpansion = (id) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const SentimentOverviewCards = () => (
        <Grid container spacing={3}>
            {sentimentData.map((data, index) => (
                <Grid item xs={12} sm={4} key={index}>
                    <Card sx={{
                        backgroundColor: '#2d2d2d',
                        border: '1px solid #333',
                        borderRadius: 3,
                        height: '100%'
                    }}>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Box sx={{ mb: 2 }}>
                                {data.name === 'Positive' && <PositiveIcon sx={{ fontSize: 40, color: data.color }} />}
                                {data.name === 'Neutral' && <NeutralIcon sx={{ fontSize: 40, color: data.color }} />}
                                {data.name === 'Negative' && <NegativeIcon sx={{ fontSize: 40, color: data.color }} />}
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                                {data.value}%
                            </Typography>
                            <Typography variant="h6" sx={{ color: data.color, mb: 1 }}>
                                {data.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {data.count} reviews
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    const FeedbackUploadSection = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Analyze New Feedback
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Paste customer feedback text below for real-time sentiment analysis
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Enter customer feedback here..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#1a1a1a',
                            color: 'white',
                            '& fieldset': { borderColor: '#333' },
                            '&:hover fieldset': { borderColor: '#4caf50' },
                            '&.Mui-focused fieldset': { borderColor: '#4caf50' }
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }
                    }}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleAnalyzeFeedback}
                        disabled={analyzing || !feedbackText.trim()}
                        startIcon={analyzing ? <LinearProgress size={20} /> : <TrendingUpIcon />}
                        sx={{
                            backgroundColor: '#4caf50',
                            '&:hover': { backgroundColor: '#45a049' }
                        }}
                    >
                        {analyzing ? 'Analyzing...' : 'Analyze Sentiment'}
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        sx={{
                            borderColor: '#42a5f5',
                            color: '#42a5f5',
                            '&:hover': {
                                borderColor: '#1976d2',
                                backgroundColor: 'rgba(66, 165, 245, 0.1)'
                            }
                        }}
                    >
                        Upload File
                    </Button>
                </Box>

                {analyzing && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress sx={{
                            backgroundColor: '#333',
                            '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' }
                        }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', mt: 1, display: 'block' }}>
                            Processing feedback with AI sentiment analysis...
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    const SentimentDistributionChart = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Sentiment Distribution
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Overall customer sentiment breakdown
                </Typography>

                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {sentimentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );

    const SentimentTrendChart = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Sentiment Trends Over Time
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Daily sentiment percentages for the past week
                </Typography>

                <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
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
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="positive" stroke="#4caf50" strokeWidth={2} />
                            <Line type="monotone" dataKey="neutral" stroke="#ff9800" strokeWidth={2} />
                            <Line type="monotone" dataKey="negative" stroke="#f44336" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );

    const WordCloudVisualization = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Keyword Word Cloud
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Most frequently mentioned words in customer feedback
                </Typography>

                <Box sx={{
                    height: 300,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    p: 2
                }}>
                    {wordCloudData.map((word, index) => {
                        const fontSize = Math.max(12, Math.min(36, word.value / 2));
                        const color = getSentimentColor(word.sentiment);

                        return (
                            <Box
                                key={index}
                                sx={{
                                    fontSize: `${fontSize}px`,
                                    color: color,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        opacity: 0.8
                                    }
                                }}
                                title={`${word.text}: mentioned ${word.value} times (${word.sentiment})`}
                            >
                                {word.text}
                            </Box>
                        );
                    })}
                </Box>
            </CardContent>
        </Card>
    );

    const FeedbackTable = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    Recent Feedback Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                    Latest customer feedback with sentiment scores and keywords
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Timestamp
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Sentiment
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Confidence
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Feedback
                                </TableCell>
                                <TableCell sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 'bold' }}>
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockFeedback.map((feedback) => (
                                <React.Fragment key={feedback.id}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white' }}>
                                            {feedback.timestamp}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getSentimentIcon(feedback.sentiment)}
                                                <Chip
                                                    label={feedback.sentiment.toUpperCase()}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: getSentimentColor(feedback.sentiment),
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={feedback.confidence * 100}
                                                    sx={{
                                                        width: 60,
                                                        backgroundColor: '#333',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: feedback.confidence > 0.8 ? '#4caf50' :
                                                                feedback.confidence > 0.6 ? '#ff9800' : '#f44336'
                                                        }
                                                    }}
                                                />
                                                <Typography variant="caption" sx={{ color: 'white', ml: 1 }}>
                                                    {(feedback.confidence * 100).toFixed(0)}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: 'white', maxWidth: 400 }}>
                                            <Typography variant="body2" sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: expandedRows.has(feedback.id) ? 'normal' : 'nowrap'
                                            }}>
                                                {feedback.text}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => toggleRowExpansion(feedback.id)}
                                                sx={{ color: 'rgba(255,255,255,0.7)' }}
                                            >
                                                {expandedRows.has(feedback.id) ? <CollapseIcon /> : <ExpandIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                                            <Collapse in={expandedRows.has(feedback.id)} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1, p: 2, backgroundColor: '#1a1a1a', borderRadius: 1 }}>
                                                    <Typography variant="subtitle2" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                                                        Key Keywords:
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                                        {feedback.keywords.map((keyword, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={keyword}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    borderColor: getSentimentColor(feedback.sentiment),
                                                                    color: getSentimentColor(feedback.sentiment)
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                                        <strong>Full Feedback:</strong> {feedback.text}
                                                    </Typography>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );

    const InsightsPanel = () => (
        <Card sx={{
            backgroundColor: '#2d2d2d',
            border: '1px solid #333',
            borderRadius: 3,
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                    AI Insights & Recommendations
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                            Positive Trend Detected
                        </Typography>
                        <Typography variant="body2">
                            Customer satisfaction has improved by 3% this week. Staff friendliness and coffee quality are the top positive mentions.
                        </Typography>
                    </Alert>

                    <Alert
                        severity="warning"
                        sx={{
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            border: '1px solid rgba(255, 152, 0, 0.3)',
                            color: 'white',
                            '& .MuiAlert-icon': { color: '#ff9800' }
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            Action Required: Wait Times
                        </Typography>
                        <Typography variant="body2">
                            "Wait" and "slow" appear frequently in neutral/negative feedback. Consider optimizing service flow during peak hours.
                        </Typography>
                    </Alert>

                    <Alert
                        severity="info"
                        sx={{
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                            color: 'white',
                            '& .MuiAlert-icon': { color: '#42a5f5' }
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                            Growth Opportunity
                        </Typography>
                        <Typography variant="body2">
                            Customers love the atmosphere and quality. Promote these strengths in marketing to attract more customers.
                        </Typography>
                    </Alert>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box>
            <Navbar />
            <DashboardLayout>
                <Box>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                        Customer Sentiment Analysis
                    </Typography>

                    {/* Sentiment Overview Cards */}
                    <Box mb={4}>
                        <SentimentOverviewCards />
                    </Box>

                    {/* Feedback Upload Section */}
                    <Box mb={4}>
                        <FeedbackUploadSection />
                    </Box>

                    <Grid container spacing={3}>
                        {/* Sentiment Distribution Chart */}
                        <Grid item xs={12} md={4}>
                            <SentimentDistributionChart />
                        </Grid>

                        {/* Sentiment Trends */}
                        <Grid item xs={12} md={8}>
                            <SentimentTrendChart />
                        </Grid>

                        {/* Word Cloud */}
                        <Grid item xs={12} md={8}>
                            <WordCloudVisualization />
                        </Grid>

                        {/* Insights Panel */}
                        <Grid item xs={12} md={4}>
                            <InsightsPanel />
                        </Grid>

                        {/* Feedback Table */}
                        <Grid item xs={12}>
                            <FeedbackTable />
                        </Grid>
                    </Grid>
                </Box>
            </DashboardLayout>
        </Box>
    );
};

export default Sentiment;