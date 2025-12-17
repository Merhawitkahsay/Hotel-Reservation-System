// // client/src/pages/Dashboard/Dashboard.tsx
// import React from 'react';

// const Dashboard = () => {
//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>Coming soon...</p>
//     </div>
//   );
// };

// export default Dashboard;


import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Hotel Dashboard</h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginTop: '2rem'
      }}>
        <div 
          style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/guests')}
        >
          <h3>👥 Guests</h3>
          <p>Manage guest information</p>
        </div>
        
        <div 
          style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/rooms')}
        >
          <h3>🏨 Rooms</h3>
          <p>View and manage rooms</p>
        </div>
        
        <div 
          style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/reservations')}
        >
          <h3>📅 Reservations</h3>
          <p>Bookings and check-ins</p>
        </div>
        
        <div 
          style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/reports')}
        >
          <h3>📊 Reports</h3>
          <p>View hotel reports</p>
        </div>
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <button 
          onClick={() => navigate('/login')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#f5222d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;