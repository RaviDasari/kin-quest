import React from 'react';

const EventModal = ({ event, onClose }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="card"
        style={{
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            lineHeight: 1
          }}
        >
          ×
        </button>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '0.375rem 0.75rem',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}>
            {formatDate(event.date)}
          </div>
          {event.time && (
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              ⏰ {event.time}
            </div>
          )}
        </div>

        <h2 style={{ 
          fontSize: '1.75rem', 
          fontWeight: '600',
          marginBottom: '1rem',
          paddingRight: '2rem'
        }}>
          {event.title}
        </h2>

        {event.location && (
          <div style={{ 
            fontSize: '1rem', 
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <span>📍</span>
            <span>{event.location}</span>
          </div>
        )}

        {event.description && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Description
            </h3>
            <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
              {event.description}
            </p>
          </div>
        )}

        <div style={{ 
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}>
          {event.ageHints && (
            <div style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}>
              <strong>Age:</strong> {event.ageHints}
            </div>
          )}
          {event.genderHints && (
            <div style={{
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}>
              <strong>Audience:</strong> {event.genderHints}
            </div>
          )}
        </div>

        {event.llmRationale && (
          <div style={{ 
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#dbeafe',
            borderRadius: '0.375rem',
            borderLeft: '4px solid var(--primary-color)'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e40af' }}>
              💡 Why this event?
            </h3>
            <p style={{ color: '#1e40af', fontSize: '0.9375rem' }}>
              {event.llmRationale}
            </p>
          </div>
        )}

        {event.link && (
          <div style={{ marginTop: '1.5rem' }}>
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              View Event Details
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;
