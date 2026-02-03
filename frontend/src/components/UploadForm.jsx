import React, { useState, useEffect } from "react";
import { uploadResume, getAllRoles } from "../services/api";

export default function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Load roles on component mount
  useEffect(() => {
    loadRoles();
  }, []);

  async function loadRoles() {
    try {
      const rolesData = await getAllRoles();
      setRoles(rolesData);
      if (rolesData.length > 0) {
        setRoleId(rolesData[0].id); // Set first role as default
      }
    } catch (err) {
      setError("Failed to load job roles");
    }
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return setFile(null);
    if (f.type !== "application/pdf") {
      setError("Please upload a PDF file");
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file || !name || !email || !roleId) {
      setError("Please provide name, email, job role, and a PDF file.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const json = await uploadResume(file, name, email, phone, roleId);
      setResult(json);
      onUploadSuccess?.(json);
      // Reset form
      setFile(null);
      setName("");
      setEmail("");
      setPhone("");
      e.target.reset();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
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

  const getExperienceBadge = (level) => {
    const badges = {
      'JUNIOR': { label: '🟢 Junior', color: '#10b981' },
      'MID_LEVEL': { label: '🟡 Mid-Level', color: '#f59e0b' },
      'SENIOR': { label: '🔴 Senior', color: '#ef4444' }
    };
    return badges[level] || { label: level, color: '#6b7280' };
  };

  return (
    <div className="card">
      <h2 className="card-title">📄 Upload Resume</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Job Role *</label>
          <select
            className="form-control"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            required
          >
            <option value="">Select a job role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Resume (PDF only)</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="resume-file"
              className="file-input"
              accept="application/pdf"
              onChange={handleFile}
            />
            <label htmlFor="resume-file" className="file-input-label">
              <span>📎</span>
              <span>{file ? file.name : 'Choose PDF file...'}</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone (optional)</label>
          <input
            type="tel"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 234 567 8900"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" style={{width: '20px', height: '20px', borderWidth: '3px'}}></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Upload & Analyze</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="alert alert-error" style={{marginTop: '20px'}}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div style={{marginTop: '30px', padding: '20px', background: '#f8f9ff', borderRadius: '15px'}}>
          <h3 style={{textAlign: 'center', marginBottom: '20px', color: '#333'}}>
            ✨ Analysis Complete!
          </h3>

          <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px'}}>
            <div>
              <div className="score-circle" style={{'--score': `${result.score}%`}}>
                <div className="score-value" style={{color: getScoreColor(result.score)}}>
                  {result.score}
                </div>
              </div>
              <p style={{textAlign: 'center', fontSize: '16px', fontWeight: '600', marginTop: '10px'}}>
                Resume Score
              </p>
            </div>

            {result.experienceLevel && (
              <div style={{textAlign: 'center'}}>
                <div style={{
                  padding: '12px 24px',
                  borderRadius: '20px',
                  background: getExperienceBadge(result.experienceLevel).color,
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {getExperienceBadge(result.experienceLevel).label}
                </div>
                <p style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
                  Experience Level
                </p>
              </div>
            )}

            {result.rank && (
              <div style={{textAlign: 'center'}}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#667eea',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: '700'
                }}>
                  #{result.rank}
                </div>
                <p style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
                  Rank in Role
                </p>
              </div>
            )}
          </div>

          {result.feedback && (
            <div style={{marginTop: '20px'}}>
              <h4 style={{marginBottom: '10px', color: '#555'}}>📊 Detailed Analysis</h4>

              {(() => {
                const { strengths, weaknesses, recommendations } = parseSkills(result.feedback);
                return (
                  <>
                    {strengths.length > 0 && (
                      <div style={{marginBottom: '15px'}}>
                        <p style={{fontWeight: '600', marginBottom: '8px', color: '#10b981'}}>
                          ✅ Strengths ({strengths.length})
                        </p>
                        <div className="skills-container">
                          {strengths.map((skill, i) => (
                            <span key={i} className="skill-tag skill-matched">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {weaknesses.length > 0 && (
                      <div style={{marginBottom: '15px'}}>
                        <p style={{fontWeight: '600', marginBottom: '8px', color: '#ef4444'}}>
                          ❌ Weaknesses ({weaknesses.length})
                        </p>
                        <div className="skills-container">
                          {weaknesses.map((skill, i) => (
                            <span key={i} className="skill-tag skill-missing">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {recommendations.length > 0 && (
                      <div>
                        <p style={{fontWeight: '600', marginBottom: '8px', color: '#667eea'}}>
                          💡 Recommendations
                        </p>
                        <ul style={{paddingLeft: '20px', color: '#555'}}>
                          {recommendations.map((rec, i) => (
                            <li key={i} style={{marginBottom: '5px'}}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          <div className="alert alert-success" style={{marginTop: '20px'}}>
            <span>✅</span>
            <span>Candidate saved successfully! ID: {result.candidateId}</span>
          </div>
        </div>
      )}
    </div>
  );
}