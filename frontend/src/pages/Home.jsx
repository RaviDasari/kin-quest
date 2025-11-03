import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { authenticated, login, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (authenticated && user) {
      if (user.profileCompleted) {
        navigate('/suggestions');
      } else {
        navigate('/profile');
      }
    }
  }, [authenticated, user, navigate]);

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          Welcome to KinQuest
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Discover personalized family-friendly events in your local area
        </p>
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How it works</h2>
          <div style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>1. Sign in with Google</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Secure authentication to protect your family's information
              </p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>2. Create your family profile</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Tell us about your family members and your ZIP code
              </p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>3. Get personalized suggestions</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Receive curated event recommendations tailored to your family
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={login}
          className="btn btn-primary"
          style={{ marginTop: '2rem', fontSize: '1.125rem', padding: '0.875rem 2rem' }}
        >
          Get Started with Google
        </button>
      </div>
    </div>
  );
};

export default Home;
