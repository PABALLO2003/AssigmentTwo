import React from 'react';

function NotFound() {
  return (
    <div style={styles.container}>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={styles.link}>Go back to Login</a>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '80px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 0 12px rgba(0, 0, 0, 0.1)',
  },
  link: {
    marginTop: '20px',
    display: 'inline-block',
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};

export default NotFound;