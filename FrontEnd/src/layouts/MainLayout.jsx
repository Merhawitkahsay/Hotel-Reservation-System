import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;