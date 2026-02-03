import React, { useState } from "react";
import { Link } from "react-router-dom";
import UploadForm from "../components/UploadForm";

const Home = () => {
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleUploadSuccess = (result) => {
    setUploadedCount(prev => prev + 1);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="card" style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{fontSize: '42px', marginBottom: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          Resume Scoring System
        </h1>
        <p style={{fontSize: '18px', color: '#666', marginBottom: '20px'}}>
          Upload resumes and get instant skill analysis powered by AI
        </p>
        <div style={{display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <Link to="/candidates" className="btn btn-primary">
            👥 View All Candidates
          </Link>
          <a href="#upload" className="btn btn-secondary">
            📄 Upload Resume
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-2" style={{marginBottom: '30px'}}>
        <div className="card" style={{textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
          <h3 style={{fontSize: '48px', marginBottom: '10px'}}>{uploadedCount}</h3>
          <p style={{fontSize: '18px', opacity: '0.9'}}>Resumes Analyzed This Session</p>
        </div>

        <div className="card" style={{textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white'}}>
          <h3 style={{fontSize: '48px', marginBottom: '10px'}}>18+</h3>
          <p style={{fontSize: '18px', opacity: '0.9'}}>Skills Tracked</p>
        </div>
      </div>

      {/* Upload Form */}
      <div id="upload">
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Features Section */}
      <div className="card" style={{marginTop: '30px'}}>
        <h2 className="card-title">✨ Features</h2>
        <div className="grid grid-2">
          <div style={{padding: '20px', background: '#f8f9ff', borderRadius: '10px'}}>
            <h3 style={{fontSize: '20px', marginBottom: '10px'}}>📊 Intelligent Scoring</h3>
            <p style={{color: '#666'}}>Automatically scores resumes based on skill matching against predefined criteria</p>
          </div>

          <div style={{padding: '20px', background: '#f8f9ff', borderRadius: '10px'}}>
            <h3 style={{fontSize: '20px', marginBottom: '10px'}}>🔍 Skill Analysis</h3>
            <p style={{color: '#666'}}>Identifies matched and missing skills to help with candidate evaluation</p>
          </div>

          <div style={{padding: '20px', background: '#f8f9ff', borderRadius: '10px'}}>
            <h3 style={{fontSize: '20px', marginBottom: '10px'}}>💾 Database Storage</h3>
            <p style={{color: '#666'}}>All candidate data is securely stored and easily retrievable</p>
          </div>

          <div style={{padding: '20px', background: '#f8f9ff', borderRadius: '10px'}}>
            <h3 style={{fontSize: '20px', marginBottom: '10px'}}>📄 PDF Support</h3>
            <p style={{color: '#666'}}>Extracts text from PDF resumes using Apache PDFBox</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;