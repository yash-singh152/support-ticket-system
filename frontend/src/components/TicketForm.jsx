
import React, { useState } from 'react';
import api from '../api';

const TicketForm = ({ onTicketCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'general',
        priority: 'low',
    });
    const [isClassifying, setIsClassifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDescriptionBlur = async () => {
        if (!formData.description.trim()) return;

        setIsClassifying(true);
        try {
            const response = await api.post('/api/tickets/classify/', {
                description: formData.description,
            });
            const { suggested_category, suggested_priority } = response.data;

            setFormData(prev => ({
                ...prev,
                category: suggested_category,
                priority: suggested_priority
            }));
        } catch (error) {
            console.error("Classification failed", error);
        } finally {
            setIsClassifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/api/tickets/', formData);
            setFormData({
                title: '',
                description: '',
                category: 'general',
                priority: 'low',
            });
            if (onTicketCreated) onTicketCreated();
        } catch (error) {
            console.error("Submission failed", error);
            alert("Failed to create ticket");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="card">
            <h2>Create New Ticket</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={200}
                        placeholder="Brief summary of the issue"
                    />
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleDescriptionBlur}
                        required
                        rows={4}
                        placeholder="Detailed description (AI will suggest category/priority on blur)"
                    />
                    {isClassifying && <span className="loading-spinner"></span>}
                    {isClassifying && <span style={{ marginLeft: '10px', color: 'var(--text-secondary)' }}>AI is analyzing...</span>}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="billing">Billing</option>
                            <option value="technical">Technical</option>
                            <option value="account">Account</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label>Priority</label>
                        <select name="priority" value={formData.priority} onChange={handleChange}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
            </form>
        </div>
    );
};

export default TicketForm;
