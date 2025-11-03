import React, { useState, useEffect } from 'react';
import { suggestionsAPI } from '../services/api';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';

const Suggestions = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [zipCode, setZipCode] = useState('');

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    try {
      setError('');
      const response = await suggestionsAPI.getSuggestions();
      setEvents(response.data.events || []);
      setZipCode(response.data.zipCode || '');
    } catch (err) {
      console.error('Error loading suggestions:', err);
      setError(err.response?.data?.error || 'Error loading event suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      await suggestionsAPI.refreshCache();
      await loadSuggestions();
    } catch (err) {
      console.error('Error refreshing:', err);
      setError('Error refreshing events');
    } finally {
      setRefreshing(false);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1>Event Suggestions</h1>
          <button
            onClick={handleRefresh}
            className="btn btn-primary"
            disabled={refreshing}
          >
            {refreshing ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>
          Personalized events for your family in ZIP code: <strong>{zipCode}</strong>
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {events.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>No events found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            We couldn't find any events for your area at this time. Try refreshing later or updating your profile.
          </p>
          <button onClick={handleRefresh} className="btn btn-primary">
            Refresh Events
          </button>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {events.map((event, index) => (
          <EventCard 
            key={index} 
            event={event} 
            onClick={() => handleEventClick(event)}
          />
        ))}
      </div>

      {selectedEvent && (
        <EventModal 
          event={selectedEvent} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Suggestions;
