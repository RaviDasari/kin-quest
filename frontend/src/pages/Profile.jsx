import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';

const Profile = () => {
  const { user, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    zipCode: '',
    familyMembers: [{ name: '', dob: '', gender: '' }],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      if (response.data.zipCode) {
        setFormData({
          zipCode: response.data.zipCode,
          familyMembers: response.data.familyMembers.length > 0 
            ? response.data.familyMembers 
            : [{ name: '', dob: '', gender: '' }],
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleZipChange = (e) => {
    setFormData({ ...formData, zipCode: e.target.value });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.familyMembers];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, familyMembers: updatedMembers });
  };

  const addFamilyMember = () => {
    setFormData({
      ...formData,
      familyMembers: [...formData.familyMembers, { name: '', dob: '', gender: '' }],
    });
  };

  const removeFamilyMember = (index) => {
    if (formData.familyMembers.length > 1) {
      const updatedMembers = formData.familyMembers.filter((_, i) => i !== index);
      setFormData({ ...formData, familyMembers: updatedMembers });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Validate ZIP code
      if (!/^\d{5}$/.test(formData.zipCode)) {
        setError('ZIP code must be exactly 5 digits');
        setSaving(false);
        return;
      }

      // Validate family members
      for (const member of formData.familyMembers) {
        if (!member.name || !member.dob) {
          setError('All family members must have a name and date of birth');
          setSaving(false);
          return;
        }
      }

      await profileAPI.createProfile(formData);
      setSuccess('Profile saved successfully!');
      await refreshAuth();
      
      setTimeout(() => {
        navigate('/suggestions');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error saving profile');
    } finally {
      setSaving(false);
    }
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem' }}>Family Profile</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Your Information</h2>
            </div>
            
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={user?.name || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">ZIP Code *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter 5-digit ZIP code"
                value={formData.zipCode}
                onChange={handleZipChange}
                maxLength={5}
                pattern="\d{5}"
                required
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Family Members</h2>
            </div>

            {formData.familyMembers.map((member, index) => (
              <div key={index} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.125rem' }}>Member {index + 1}</h3>
                  {formData.familyMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFamilyMember(index)}
                      className="btn btn-danger"
                      style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={member.dob}
                    onChange={(e) => handleMemberChange(index, 'dob', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender (Optional)</label>
                  <select
                    className="form-select"
                    value={member.gender}
                    onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addFamilyMember}
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              + Add Family Member
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
