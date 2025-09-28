import React, { useState } from 'react';

const Homepage = () => {
    const [todayStats] = useState({
        revenue: 15420,
        orders: 142,
        customers: 89,
        growth: 12.5
    });

    const moduleCards = [
        {
            title: 'Dashboard Analytics',
            description: 'Comprehensive business insights and KPI tracking',
            path: '/',
            color: '#42a5f5',
            features: ['Revenue Tracking', 'Sales Trends', 'Performance Metrics']
        },
        {
            title: 'Market Basket Analysis',
            description: 'Discover product associations and cross-selling opportunities',
            path: '/mba',
            color: '#ff9800',
            features: ['Product Associations', 'Upselling Strategy', 'Combo Offers']
        },
        {
            title: 'Sentiment Analysis',
            description: 'Customer feedback insights and satisfaction tracking',
            path: '/sentiment',
            color: '#4caf50',
            features: ['Feedback Analysis', 'Satisfaction Scores', 'Word Cloud']
        },
        {
            title: 'Sales Forecasting',
            description: 'AI-powered predictions for inventory and revenue planning',
            path: '/reports',
            color: '#9c27b0',
            features: ['Revenue Prediction', 'Demand Forecasting', 'Trend Analysis']
        }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleNavigation = (path) => {
        window.location.href = path;
    };

    const StatCard = ({ icon, value, label, color }) => (
        <div className="stat-card">
            <div className="stat-icon" style={{ color }}>
                {icon}
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );

    const ModuleCard = ({ module, index }) => (
        <div
            className="module-card"
            onClick={() => handleNavigation(module.path)}
            style={{ '--hover-color': module.color }}
        >
            <div className="module-icon" style={{ backgroundColor: `${module.color}20`, color: module.color }}>
                <div className="icon-placeholder">📊</div>
            </div>
            <h3 className="module-title">{module.title}</h3>
            <p className="module-description">{module.description}</p>
            <div className="module-features">
                {module.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">• {feature}</div>
                ))}
            </div>
            <button
                className="module-button"
                style={{ borderColor: module.color, color: module.color }}
            >
                Explore Module →
            </button>
        </div>
    );

    return (
        <div className="homepage">
            <style jsx>{`
                .homepage {
                    min-height: 100vh;
                    background: #0f0f0f;
                    color: white;
                    font-family: 'Roboto', sans-serif;
                }

                .header {
                    background: #1a1a1a;
                    padding: 1rem 0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }

                .header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .logo {
                    font-size: 2rem;
                    color: #4caf50;
                }

                .brand-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    background: linear-gradient(45deg, #4caf50, #81c784);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .ai-chip {
                    background: #4caf50;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .hero-section {
                    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%);
                    border-radius: 1rem;
                    padding: 3rem;
                    margin-bottom: 3rem;
                    border: 1px solid rgba(76, 175, 80, 0.2);
                    text-align: center;
                }

                .hero-title {
                    font-size: 3rem;
                    font-weight: bold;
                    background: linear-gradient(45deg, #4caf50, #42a5f5);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 1rem;
                }

                .hero-subtitle {
                    font-size: 1.2rem;
                    color: rgba(255,255,255,0.8);
                    margin-bottom: 3rem;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-bottom: 3rem;
                }

                .stat-card {
                    background: #2d2d2d;
                    border: 1px solid #333;
                    border-radius: 0.75rem;
                    padding: 2rem;
                    text-align: center;
                }

                .stat-icon {
                    font-size: 2rem;
                    margin-bottom: 1rem;
                }

                .stat-value {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: white;
                    margin-bottom: 0.5rem;
                }

                .stat-label {
                    color: rgba(255,255,255,0.7);
                    font-size: 0.9rem;
                }

                .cta-button {
                    background: #4caf50;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    font-size: 1.1rem;
                    font-weight: bold;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .cta-button:hover {
                    background: #45a049;
                }

                .section-title {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: white;
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .modules-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }

                .module-card {
                    background: #2d2d2d;
                    border: 1px solid #333;
                    border-radius: 0.75rem;
                    padding: 2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .module-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 24px rgba(66, 165, 245, 0.2);
                    border-color: var(--hover-color);
                }

                .module-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    font-size: 2rem;
                }

                .icon-placeholder {
                    font-size: 2rem;
                }

                .module-title {
                    font-size: 1.3rem;
                    font-weight: bold;
                    color: white;
                    text-align: center;
                    margin-bottom: 1rem;
                }

                .module-description {
                    color: rgba(255,255,255,0.7);
                    text-align: center;
                    margin-bottom: 1.5rem;
                    flex-grow: 1;
                }

                .module-features {
                    margin-bottom: 2rem;
                }

                .feature-item {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.85rem;
                    text-align: center;
                    margin-bottom: 0.5rem;
                }

                .module-button {
                    background: transparent;
                    border: 1px solid;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 100%;
                }

                .module-button:hover {
                    background: rgba(255,255,255,0.1);
                }

                .footer {
                    background: #1a1a1a;
                    border-top: 1px solid #333;
                    margin-top: 4rem;
                    padding: 3rem 0;
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                }

                .footer-section h3 {
                    color: white;
                    font-weight: bold;
                    margin-bottom: 1rem;
                }

                .footer-section p {
                    color: rgba(255,255,255,0.7);
                }

                .footer-links {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .footer-link {
                    color: rgba(255,255,255,0.7);
                    text-decoration: none;
                    font-size: 0.9rem;
                }

                .footer-link:hover {
                    color: white;
                }

                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 2rem;
                    }
                    
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .modules-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .footer-content {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <div className="logo-section">
                        <div className="logo">📈</div>
                        <div className="brand-title">Café Analytics Dashboard</div>
                    </div>
                    <div className="ai-chip">
                        <span>🤖</span>
                        AI Active
                    </div>
                </div>
            </header>

            <div className="container">
                {/* Hero Section */}
                <section className="hero-section">
                    <h1 className="hero-title">AI-Powered Café Intelligence</h1>
                    <p className="hero-subtitle">
                        Transform your café operations with comprehensive analytics, predictive insights,
                        and data-driven decision making tools.
                    </p>

                    {/* Today's Key Metrics */}
                    <div className="stats-grid">
                        <StatCard
                            icon="💰"
                            value={formatCurrency(todayStats.revenue)}
                            label="Today's Revenue"
                            color="#4caf50"
                        />
                        <StatCard
                            icon="📦"
                            value={todayStats.orders}
                            label="Orders Today"
                            color="#42a5f5"
                        />
                        <StatCard
                            icon="👥"
                            value={todayStats.customers}
                            label="Customers Served"
                            color="#ff9800"
                        />
                        <StatCard
                            icon="📈"
                            value={`+${todayStats.growth}%`}
                            label="Growth Rate"
                            color="#9c27b0"
                        />
                    </div>

                    <button className="cta-button" onClick={() => handleNavigation('/')}>
                        View Full Dashboard →
                    </button>
                </section>

                {/* Module Cards */}
                <h2 className="section-title">Business Intelligence Modules</h2>
                <div className="modules-grid">
                    {moduleCards.map((module, index) => (
                        <ModuleCard key={index} module={module} index={index} />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Café Analytics Dashboard</h3>
                        <p>Empowering café owners with AI-driven insights for better business decisions.</p>
                    </div>
                    <div className="footer-section">
                        <h3>Quick Links</h3>
                        <div className="footer-links">
                            {moduleCards.map((module, idx) => (
                                <a
                                    key={idx}
                                    href={module.path}
                                    className="footer-link"
                                >
                                    {module.title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;