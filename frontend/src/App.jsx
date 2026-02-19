
import React, { useState } from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import Stats from './components/Stats';

function App() {
    // Simple state to reload list and stats when a new ticket is added
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleTicketCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: 0, color: 'var(--primary-color)' }}>Support Ticket System</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Stats refreshTrigger={refreshTrigger} />

                <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <TicketForm onTicketCreated={handleTicketCreated} />
                    </div>
                    <div style={{ flex: '2', minWidth: '400px' }}>
                        <TicketList refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
