import React, { useState, useEffect } from "react";
import { getAllCandidates, deleteCandidate } from "../services/api";
import { Link } from "react-router-dom";

export default function CandidatesList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      const data = await getAllCandidates();
      setCandidates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await deleteCandidate(id);
      // Remove from local state
      setCandidates(candidates.filter(c => c.id !== id));
      alert("Candidate deleted successfully");
    } catch (err) {
      alert("Failed to delete candidate: " + err.message);
    }
  }

  const getScoreBadge = (score) => {
    if (score >= 70) return "badge-success";
    if (score >= 40) return "badge-warning";
    return "badge-danger";
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'NEW': 'badge-info',
      'UNDER_REVIEW': 'badge-warning',
      'SHORTLISTED': 'badge-success',
      'INTERVIEWED': 'badge-primary',
      'SELECTED': 'badge-success',
      'REJECTED': 'badge-danger'
    };
    return statusColors[status] || 'badge-secondary';
  };

  const getExperienceBadge = (level) => {
    const badges = {
      'JUNIOR': { emoji: '🟢', color: '#10b981' },
      'MID_LEVEL': { emoji: '🟡', color: '#f59e0b' },
      'SENIOR': { emoji: '🔴', color: '#ef4444' }
    };
    return badges[level] || { emoji: '⚪', color: '#6b7280' };
  };

  const filteredAndSorted = () => {
    let filtered = candidates.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           c.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    switch(sortBy) {
      case "score":
        return filtered.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
      case "name":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "date":
      default:
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="spinner"></div>
        <p style={{textAlign: 'center', marginTop: '10px'}}>Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const displayCandidates = filteredAndSorted();

  return (
    <div className="card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 className="card-title">👥 All Candidates ({displayCandidates.length})</h2>
        <button onClick={loadCandidates} className="btn btn-secondary">
          🔄 Refresh
        </button>
      </div>

      <div style={{display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap'}}>
        <div className="form-group" style={{flex: '1', minWidth: '200px', marginBottom: '0'}}>
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-group" style={{minWidth: '150px', marginBottom: '0'}}>
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">📅 Latest First</option>
            <option value="score">⭐ Highest Score</option>
            <option value="name">🔤 Name (A-Z)</option>
          </select>
        </div>

        <div className="form-group" style={{minWidth: '150px', marginBottom: '0'}}>
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEWED">Interviewed</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {displayCandidates.length === 0 ? (
        <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
          <p style={{fontSize: '48px'}}>📭</p>
          <p style={{fontSize: '18px'}}>No candidates found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Experience</th>
                <th>Score</th>
                <th>Rank</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayCandidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>#{candidate.id}</td>
                  <td style={{fontWeight: '600'}}>{candidate.name}</td>
                  <td>{candidate.email}</td>
                  <td>
                    {candidate.jobRole ? (
                      <span style={{fontSize: '12px', color: '#667eea'}}>
                        {candidate.jobRole.roleName}
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    {candidate.experienceLevel && (
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        background: getExperienceBadge(candidate.experienceLevel).color + '20',
                        color: getExperienceBadge(candidate.experienceLevel).color
                      }}>
                        {getExperienceBadge(candidate.experienceLevel).emoji} {candidate.experienceLevel.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getScoreBadge(candidate.totalScore || 0)}`}>
                      {candidate.totalScore || 0}
                    </span>
                  </td>
                  <td>
                    {candidate.rankInRole && (
                      <span style={{fontWeight: '700', color: '#667eea'}}>
                        #{candidate.rankInRole}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td>{new Date(candidate.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <Link
                        to={`/candidate/${candidate.id}`}
                        className="btn btn-primary"
                        style={{padding: '6px 12px', fontSize: '14px'}}
                      >
                        👁️ View
                      </Link>
                      <button
                        onClick={() => handleDelete(candidate.id, candidate.name)}
                        className="btn btn-secondary"
                        style={{padding: '6px 12px', fontSize: '14px', background: '#ef4444'}}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}