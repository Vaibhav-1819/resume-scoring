import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCandidateById, deleteCandidate, updateCandidateStatus } from "../services/api";

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadCandidate();
  }, [id]);

  async function loadCandidate() {
    try {
      const data = await getCandidateById(id);
      setCandidate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      return;
    }

    try {
      await deleteCandidate(id);
      alert("Candidate deleted successfully");
      navigate('/candidates');
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  }

  async function handleStatusChange(newStatus) {
    setUpdatingStatus(true);
    try {
      const updated = await updateCandidateStatus(id, newStatus);
      setCandidate(updated);
      alert("Status updated successfully");
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getExperienceBadge = (level) => {
    const badges = {
      'JUNIOR': { label: '🟢 Junior', color: '#10b981' },
      'MID_LEVEL': { label: '🟡 Mid-Level', color: '#f59e0b' },
      'SENIOR': { label: '🔴 Senior', color: '#ef4444' }
    };
    return badges[level] || { label: level, color: '#6b7280' };
  };

  const parseSkills = (feedback) => {
    if (!feedback) return { strengths: [], weaknesses: [], recommendations: [] };

    const sections = feedback.split('\n\n');
    const strengthsSection = sections.find(s => s.startsWith('STRENGTHS:'));
    const weaknessesSection = sections.find(s => s.startsWith('WEAKNESSES:'));
    const recommendationsSection = sections.find(s => s.startsWith('RECOMMENDATIONS:'));

    const strengths = strengthsSection
      ? strengthsSection.replace('STRENGTHS:', '').trim().split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const weaknesses = weaknessesSection
      ? weaknessesSection.replace('WEAKNESSES:', '').trim().split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const recommendations = recommendationsSection
      ? recommendationsSection.replace('RECOMMENDATIONS:', '').trim().split('\n').map(s => s.replace('-', '').trim()).filter(Boolean)
      : [];

    return { strengths, weaknesses, recommendations };
  };

  if (loading) {
    return (
      <div className="card">
        <div className="spinner"></div>
        <p style={{textAlign: 'center', marginTop: '10px'}}>Loading candidate details...</p>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error || "Candidate not found"}</span>
        </div>
        <button onClick={() => navigate('/candidates')} className="btn btn-primary">
          ← Back to Candidates
        </button>
      </div>
    );
  }

  const { strengths, weaknesses, recommendations } = parseSkills(candidate.feedback);

  return (
    <div>
      <div style={{display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap'}}>
        <button onClick={() => navigate('/candidates')} className="btn btn-secondary">
          ← Back to All Candidates
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-primary"
          style={{background: '#ef4444'}}
        >
          🗑️ Delete Candidate
        </button>
      </div>

      <div className="grid grid-2">
        {/* Left Column - Candidate Info */}
        <div className="card">
          <h2 className="card-title">👤 Candidate Information</h2>

          <div style={{marginBottom: '15px'}}>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '5px'}}>ID</p>
            <p style={{fontSize: '18px', fontWeight: '600'}}>#{candidate.id}</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '5px'}}>Name</p>
            <p style={{fontSize: '18px', fontWeight: '600'}}>{candidate.name}</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '5px'}}>Email</p>
            <p style={{fontSize: '16px'}}>{candidate.email}</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '5px'}}>Phone</p>
            <p style={{fontSize: '16px'}}>{candidate.phoneNumber || 'Not provided'}</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '5px'}}>Applied Role</p>
            <p style={{fontSize: '16px', fontWeight: '600', color: '#667eea'}}>
              {candidate.jobRole ? candidate.jobRole.roleName : 'Not specified'}
            </p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '5px'}}>Resume File</p>
            <p style={{fontSize: '16px'}}>📄 {candidate.fileName}</p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '5px'}}>Experience Level</p>
            {candidate.experienceLevel && (
              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '20px',
                background: getExperienceBadge(candidate.experienceLevel).color,
                color: 'white',
                fontWeight: '600'
              }}>
                {getExperienceBadge(candidate.experienceLevel).label}
              </div>
            )}
          </div>

          <div style={{marginBottom: '15px'}}>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '5px'}}>Rank in Role</p>
            <p style={{fontSize: '24px', fontWeight: '700', color: '#667eea'}}>
              {candidate.rankInRole ? `#${candidate.rankInRole}` : 'Not ranked'}
            </p>
          </div>

          <div>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '5px'}}>Submitted On</p>
            <p style={{fontSize: '16px'}}>
              {new Date(candidate.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Right Column - Score & Status */}
        <div className="card">
          <h2 className="card-title">⭐ Resume Score & Status</h2>

          <div className="score-circle" style={{'--score': `${candidate.totalScore || 0}%`}}>
            <div className="score-value" style={{color: getScoreColor(candidate.totalScore || 0)}}>
              {candidate.totalScore || 0}
            </div>
          </div>

          <p style={{textAlign: 'center', fontSize: '18px', fontWeight: '600', marginTop: '20px', marginBottom: '30px'}}>
            {candidate.totalScore >= 70 ? '🎉 Excellent Match!' :
             candidate.totalScore >= 40 ? '👍 Good Match' :
             '📝 Needs Improvement'}
          </p>

          {/* Status Management */}
          <div>
            <h3 style={{fontSize: '16px', marginBottom: '15px', color: '#555'}}>Current Status</h3>
            <p style={{
              padding: '12px',
              borderRadius: '8px',
              background: '#f8f9ff',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
              color: '#667eea'
            }}>
              {candidate.status}
            </p>

            <h3 style={{fontSize: '16px', marginTop: '25px', marginBottom: '15px', color: '#555'}}>
              Update Status
            </h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <button
                onClick={() => handleStatusChange('UNDER_REVIEW')}
                disabled={updatingStatus || candidate.status === 'UNDER_REVIEW'}
                className="btn btn-secondary"
                style={{width: '100%'}}
              >
                📋 Under Review
              </button>
              <button
                onClick={() => handleStatusChange('SHORTLISTED')}
                disabled={updatingStatus || candidate.status === 'SHORTLISTED'}
                className="btn btn-secondary"
                style={{width: '100%', background: '#10b981'}}
              >
                ✅ Shortlisted
              </button>
              <button
                onClick={() => handleStatusChange('INTERVIEWED')}
                disabled={updatingStatus || candidate.status === 'INTERVIEWED'}
                className="btn btn-secondary"
                style={{width: '100%', background: '#f59e0b'}}
              >
                💼 Interviewed
              </button>
              <button
                onClick={() => handleStatusChange('SELECTED')}
                disabled={updatingStatus || candidate.status === 'SELECTED'}
                className="btn btn-secondary"
                style={{width: '100%', background: '#10b981'}}
              >
                🎉 Selected
              </button>
              <button
                onClick={() => handleStatusChange('REJECTED')}
                disabled={updatingStatus || candidate.status === 'REJECTED'}
                className="btn btn-secondary"
                style={{width: '100%', background: '#ef4444'}}
              >
                ❌ Rejected
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="card">
        <h2 className="card-title">📊 Skills Analysis</h2>

        {strengths.length > 0 && (
          <div style={{marginBottom: '30px'}}>
            <h3 style={{fontSize: '18px', marginBottom: '15px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span>✅</span>
              <span>Strengths ({strengths.length})</span>
            </h3>
            <div className="skills-container">
              {strengths.map((skill, i) => (
                <span key={i} className="skill-tag skill-matched">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {weaknesses.length > 0 && (
          <div style={{marginBottom: '30px'}}>
            <h3 style={{fontSize: '18px', marginBottom: '15px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span>❌</span>
              <span>Weaknesses ({weaknesses.length})</span>
            </h3>
            <div className="skills-container">
              {weaknesses.map((skill, i) => (
                <span key={i} className="skill-tag skill-missing">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div>
            <h3 style={{fontSize: '18px', marginBottom: '15px', color: '#667eea', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span>💡</span>
              <span>Recommendations</span>
            </h3>
            <ul style={{paddingLeft: '20px', color: '#555'}}>
              {recommendations.map((rec, i) => (
                <li key={i} style={{marginBottom: '8px', lineHeight: '1.6'}}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Resume Text */}
      {candidate.resumeText && (
        <div className="card">
          <h2 className="card-title">📄 Extracted Resume Text</h2>
          <div style={{
            background: '#f8f9ff',
            padding: '20px',
            borderRadius: '10px',
            maxHeight: '400px',
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#555'
          }}>
            {candidate.resumeText}
          </div>
        </div>
      )}
    </div>
  );
}