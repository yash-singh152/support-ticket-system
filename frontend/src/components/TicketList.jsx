
import React, { useEffect, useState } from 'react';
import api from '../api';

const TicketList = ({ refreshTrigger }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        priority: '',
        search: ''
    });

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.category) params.append('category', filters.category);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.search) params.append('search', filters.search);

            const response = await api.get(`/api/tickets/?${params.toString()}`);
            if (response.data.results) {
                setTickets(response.data.results);
            } else {
                setTickets(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filters, refreshTrigger]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.patch(`/api/tickets/${id}/`, { status: newStatus });
            // Optimistic update
            setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Failed to update status", error);
            fetchTickets(); // Revert on fail
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return;
        try {
            await api.delete(`/api/tickets/${id}/`);
            setTickets(tickets.filter(t => t.id !== id));
        } catch (error) {
            console.error("Failed to delete ticket", error);
            alert("Failed to delete ticket");
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2>Tickets</h2>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        style={{ width: '150px', marginBottom: 0 }}
                    />
                    <select name="status" value={filters.status} onChange={handleFilterChange} style={{ width: '120px', marginBottom: 0 }}>
                        <option value="">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select name="priority" value={filters.priority} onChange={handleFilterChange} style={{ width: '120px', marginBottom: 0 }}>
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <p>Loading tickets...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tickets.length === 0 && <p>No tickets found.</p>}
                    {tickets.map(ticket => (
                        <div key={ticket.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{ticket.title}</h3>
                                <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                {new Date(ticket.created_at).toLocaleString()} • {ticket.category}
                            </p>
                            <p style={{ marginBottom: '1rem' }}>{ticket.description}</p>

                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span className={`badge status-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>

                                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Change Status:</span>
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusUpdate(ticket.id, e.target.value)}
                                        style={{ marginBottom: 0, width: 'auto', padding: '0.25rem' }}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                    <button
                                        onClick={() => handleDelete(ticket.id)}
                                        className="btn-delete"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TicketList;
