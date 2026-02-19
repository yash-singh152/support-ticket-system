
import React, { useEffect, useState } from 'react';
import api from '../api';

const Stats = ({ refreshTrigger }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/tickets/stats/');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, [refreshTrigger]);

    if (!stats) return null;

    return (
        <div className="card">
            <h2>Dashboard Stats</h2>
            <div className="grid">
                <div className="stat-card">
                    <div className="stat-value">{stats.total_tickets}</div>
                    <div className="stat-label">Total Tickets</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.open_tickets}</div>
                    <div className="stat-label">Open Tickets</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.avg_tickets_per_day}</div>
                    <div className="stat-label">Avg / Day</div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h3>By Priority</h3>
                    {Object.entries(stats.priority_breakdown).map(([key, count]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ textTransform: 'capitalize' }}>{key}</span>
                            <strong>{count}</strong>
                        </div>
                    ))}
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <h3>By Category</h3>
                    {Object.entries(stats.category_breakdown).map(([key, count]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ textTransform: 'capitalize' }}>{key}</span>
                            <strong>{count}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stats;
