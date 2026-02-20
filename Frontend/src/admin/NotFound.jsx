import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px', 
      color: '#2c2c2c' 
    }}>
      <h1 style={{ 
        fontSize: '4rem', 
        color: '#800000', // Maroon
        marginBottom: '10px' 
      }}>
        404
      </h1>
      <h3>Page Not Found</h3>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        The admin module you are looking for does not exist.
      </p>
      
      <Link 
        to="/admin" 
        style={{
          textDecoration: 'none',
          background: '#800000',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;