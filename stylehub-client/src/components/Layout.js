import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0066FF 0%, #00BFFF 50%, #000000 100%)', // Hardcoded gradient
        paddingTop: '80px', // var(--header-height)
        paddingBottom: '70px' // var(--bottom-nav-height)
      }}>
        {children}
      </main>
      <BottomNav />
    </>
  );
};

export default Layout;
