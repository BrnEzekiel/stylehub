import React from 'react';

// Brand colors - must be consistent with other glassmorphism components
const COLORS = {
  blue: '#0066FF',
  skyBlue: '#00BFFF',
  yellow: '#FFD700',
  black: '#000000',
  white: '#FFFFFF',
  green: '#00FF00',
  red: '#EF4444',
  magenta: '#FF00FF'
};

const Page = ({ title, children }) => {
  return (
    <div style={{
      padding: '60px clamp(16px, 3vw, 20px) 70px',
      position: 'relative',
      overflow: 'hidden',
      color: COLORS.white,
      minHeight: '100vh'
    }}>
      {/* Animated background glass orbs */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.magenta}25 0%, transparent 70%)`,
        top: '-300px',
        right: '-300px',
        filter: 'blur(100px)',
        animation: 'float 25s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.skyBlue}20 0%, transparent 70%)`,
        bottom: '-250px',
        left: '-250px',
        filter: 'blur(100px)',
        animation: 'float 20s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.blue}20 0%, transparent 70%)`,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(100px)',
        animation: 'float 30s ease-in-out infinite'
      }} />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header with glass effect */}
        <div style={{
          marginBottom: 'clamp(32px, 6vw, 48px)',
          animation: 'slideUp 0.6s ease-out',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRadius: '28px',
          padding: 'clamp(24px, 4vw, 36px)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
        }}>
          {/* Title */}
          <div style={{
            fontSize: 'clamp(32px, 7vw, 56px)',
            fontWeight: '900',
            color: COLORS.white,
            marginBottom: '16px',
            borderBottom: `4px solid ${COLORS.red}`,
            paddingBottom: '8px',
            display: 'inline-block'
          }}>
            {title}
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default Page;