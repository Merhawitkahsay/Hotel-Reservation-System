// // client/src/pages/Auth/Login.tsx
// import React from 'react';

// const Login = () => {
//   return (
//     <div>
//       <h1>Login Page</h1>
//       <p>Coming soon...</p>
//     </div>
//   );
// };

// export default Login;


import React from 'react';

const Login = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Hotel Reservation System</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h2>
        <form>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input 
              type="email" 
              style={{ 
                width: '100%', 
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              placeholder="Enter your email"
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              style={{ 
                width: '100%', 
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
          Demo: Use admin@example.com / any password
        </p>
      </div>
    </div>
  );
};

export default Login;