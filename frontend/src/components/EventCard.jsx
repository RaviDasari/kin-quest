import React from 'react';

const EventCard = ({ event, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="card" 
      onClick={onClick}
      style={{ 
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow)';
      }}
    >
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ 
          display: 'inline-block',
          padding: '0.25rem 0.5rem',
          backgroundColor: 'var(--primary-color)',
          color: 'white',
          borderRadius: '0.25rem',
          fontSize: '0.875rem',
          marginBottom: '0.5rem'
        }}>
          {formatDate(event.date)}
        </div>
        {event.time && (
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            ⏰ {event.time}
          </div>
        )}
      </div>

      <h3 style={{ 
        fontSize: '1.125rem', 
        fontWeight: '600',
        marginBottom: '0.5rem',
        lineHeight: '1.4'
      }}>
        {event.title}
      </h3>

      {event.location && (
        <div style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-secondary)',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.25rem'
        }}>
          <span>📍</span>
          <span>{event.location}</span>
        </div>
      )}

      <p style={{ 
        color: 'var(--text-secondary)',
        fontSize: '0.9375rem',
        marginBottom: '0.75rem',
        flex: 1
      }}>
        {truncateText(event.description, 120)}
      </p>

      <div style={{ 
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        marginTop: 'auto'
      }}>
        {event.ageHints && (
          <span style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '0.25rem',
            color: 'var(--text-secondary)'
          }}>
            👶 {event.ageHints}
          </span>
        )}
        {event.genderHints && !event.genderHints.toLowerCase().includes('all') && (
          <span style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '0.25rem',
            color: 'var(--text-secondary)'
          }}>
            {event.genderHints}
          </span>
        )}
      </div>
    </div>
  );
};

export default EventCard;
