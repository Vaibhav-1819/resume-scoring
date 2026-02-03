import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="card" style={{textAlign: 'center', padding: '60px 30px'}}>
      <h1 style={{fontSize: '120px', margin: '0'}}>404</h1>
      <h2 style={{fontSize: '32px', marginBottom: '20px', color: '#666'}}>Page Not Found</h2>
      <p style={{fontSize: '18px', color: '#999', marginBottom: '30px'}}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary">
        🏠 Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;