import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCandidateById,
  deleteCandidate,
  updateCandidateStatus
} from "../services/api";

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  /* ---------------- LOAD CANDIDATE ---------------- */
  const loadCandidate = useCallback(async () => {
    try {
      const data = await getCandidateById(id);
      setCandidate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCandidate();
  }, [loadCandidate]);

  /* ---------------- DELETE ---------------- */
  async function handleDelete() {
    if (!window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      return;
    }
    try {
      await deleteCandidate(id);
      alert("Candidate deleted successfully");
      navigate("/candidates");
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  }

  /* ---------------- STATUS UPDATE ---------------- */
  async function handleStatusChange(newStatus) {
    setUpdatingStatus(true);
    try {
      const updated = await updateCandidateStatus(id, newStatus);
      setCandidate(updated);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  /* ---------------- HELPERS ---------------- */
  const getScoreColor = (score = 0) => {
    if (score >= 70) return "#10b981";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getExperienceBadge = (level) => {
    const badges = {
      JUNIOR: { label: "🟢 Junior", color: "#10b981" },
      MID_LEVEL: { label: "🟡 Mid-Level", color: "#f59e0b" },
      SENIOR: { label: "🔴 Senior", color: "#ef4444" }
    };
    return badges[level] || { label: level, color: "#6b7280" };
  };

  const parseSkills = (feedback) => {
    if (!feedback) return { strengths: [], weaknesses: [], recommendations: [] };

    const sections = feedback.split("\n\n");
    const get = (key) =>
      sections.find((s) => s.startsWith(key))?.replace(key, "").trim() || "";

    return {
      strengths: get("STRENGTHS:")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      weaknesses: get("WEAKNESSES:")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      recommendations: get("RECOMMENDATIONS:")
        .split("\n")
        .map((s) => s.replace("-", "").trim())
        .filter(Boolean)
    };
  };

  /* ---------------- STATES ---------------- */
  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading candidate...</p>;
  }

  if (error || !candidate) {
    return (
      <div>
        <p>{error || "Candidate not found"}</p>
        <button onClick={() => navigate("/candidates")}>Back</button>
      </div>
    );
  }

  const { strengths, weaknesses, recommendations } = parseSkills(
    candidate.feedback
  );

  /* ---------------- UI ---------------- */
  return (
    <div>
      <button onClick={() => navigate("/candidates")}>← Back</button>
      <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
        Delete
      </button>

      <h2>{candidate.name}</h2>
      <p>Email: {candidate.email}</p>
      <p>Phone: {candidate.phoneNumber || "N/A"}</p>
      <p>
        Role:{" "}
        {candidate.jobRole ? candidate.jobRole.roleName : "Not specified"}
      </p>

      <p style={{ color: getScoreColor(candidate.totalScore) }}>
        Score: {candidate.totalScore}
      </p>

      {candidate.experienceLevel && (
        <span
          style={{
            background: getExperienceBadge(candidate.experienceLevel).color,
            color: "white",
            padding: "5px 10px",
            borderRadius: "20px"
          }}
        >
          {getExperienceBadge(candidate.experienceLevel).label}
        </span>
      )}

      <h3>Status: {candidate.status}</h3>

      <button
        disabled={updatingStatus}
        onClick={() => handleStatusChange("SHORTLISTED")}
      >
        Shortlist
      </button>

      <button
        disabled={updatingStatus}
        onClick={() => handleStatusChange("REJECTED")}
        style={{ marginLeft: "10px" }}
      >
        Reject
      </button>

      <h3>Strengths</h3>
      <ul>{strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>

      <h3>Weaknesses</h3>
      <ul>{weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>

      <h3>Recommendations</h3>
      <ul>{recommendations.map((r, i) => <li key={i}>{r}</li>)}</ul>

      {candidate.resumeText && (
        <>
          <h3>Resume Text</h3>
          <pre>{candidate.resumeText}</pre>
        </>
      )}
    </div>
  );
}
