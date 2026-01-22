import React from 'react';
//import {Navigate, Outlet} from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';

import ProtectedRoute from './routes/protectedRoute.jsx'; 
import MainLayout from './layouts/mainLayout.jsx';

// PUBLIC PAGES 
import Home from './home.jsx';     
import RoomList from './pages/rooms/roomList.jsx';   
import RoomDetails from './pages/rooms/roomDetails.jsx'; 
import About from './pages/about/about.jsx';

// AUTH PAGES 
import Login from './pages/auth/loginPage.jsx';
import Register from './pages/auth/register.jsx'; 
import VerifyEmail from './pages/auth/verify.jsx';
import RegisterNotice from './pages/auth/registerNotice.jsx';

// GUEST PAGES (Protected) 
import ReservationPage from './pages/reservations/reservationPage.jsx';
import BookingSuccess from './pages/rooms/bookingSuccess.jsx';
import PaymentPage from './pages/rooms/paymentPage.jsx';
import GuestProfile from './pages/guests/guestProfile.jsx';
import EditProfile from './pages/guests/editProfile.jsx';
import EditReservation from './pages/reservations/editReservation.jsx';

// ADMIN PAGES (Protected)
import AdminDashboard from './pages/admin/adminDashboard.jsx';
import RoomManagement from './pages/admin/roomManagement.jsx';
import GuestManagement from './pages/admin/guestManagement.jsx';
import ReservationList from './pages/reservations/reservationList.jsx';
import EditRoom from './pages/admin/editRoom.jsx';
import AddRoom from './pages/admin/addRoom.jsx'; 
import GuestDirectory from './pages/admin/guestDirectory'; 
import AuditLogs from './pages/admin/auditLogs';         
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* WRAPPER: MAIN LAYOUT (Navbar/Footer) */}
          <Route element={<MainLayout />}>
            
            {/* 1. PUBLIC ROUTES */}
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-notice" element={<RegisterNotice />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/about" element={<About />} />

            {/* 2. PROTECTED GUEST ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['guest', 'admin', 'receptionist']} />}>
              <Route path="/reservation/:roomId" element={<ReservationPage />} />
              <Route path="/reservation/edit/:id" element={<EditReservation />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/profile" element={<GuestProfile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
            </Route>

            {/* 3. PROTECTED ADMIN ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'receptionist']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/rooms" element={<RoomManagement />} />
              <Route path="/admin/guests" element={<GuestManagement />} />
              <Route path="/admin/reservations" element={<ReservationList />} />
            
              {/*  These are now protected! */}
              <Route path="/admin/rooms/add" element={<AddRoom />} />
              <Route path="/admin/rooms/edit/:id" element={<EditRoom />} />


              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/guests" element={<GuestDirectory />} />
              <Route path="/admin/audit-logs" element={<AuditLogs />} />
            </Route>

          </Route>

          {/* 4. FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
};


export default App;