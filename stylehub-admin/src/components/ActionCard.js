import React, { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Using react-icons for icon

const COLORS = {
  blue: '#0066FF',
  skyBlue: '#00BFFF',
  yellow: '#FFD700',
  black: '#000000',
  white: '#FFFFFF',
  green: '#00FF00',
  red: '#EF4444'
};

const ActionCard = ({ title, icon: Icon, linkTo, gradient, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a
      href={linkTo}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        textDecoration: 'none',
        display: 'block',
        animation: `slideUp 0.6s ease-out ${delay}s both`
      }}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: '28px',
          padding: 'clamp(28px, 4vw, 36px)',
          border: `2px solid ${isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.12)'}`,
          boxShadow: isHovered 
            ? '0 30px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            : '0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glass shine effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          transition: 'left 0.6s ease',
          ...(isHovered && { left: '100%' })
        }} />
        
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradient,
          opacity: isHovered ? 0.15 : 0,
          transition: 'opacity 0.6s ease',
          mixBlendMode: 'overlay'
        }} />
        
        {/* Floating glass orb */}
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          top: '-100px',
          right: '-100px',
          filter: 'blur(60px)',
          opacity: isHovered ? 0.8 : 0.3,
          transition: 'opacity 0.6s ease'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 'clamp(60px, 12vw, 72px)',
            height: 'clamp(60px, 12vw, 72px)',
            borderRadius: '22px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: isHovered 
              ? '0 15px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
              : '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            transition: 'all 0.6s ease'
          }}>
            <Icon size={34} color={COLORS.white} strokeWidth={2.5} />
          </div>
          
          <div style={{
            fontSize: 'clamp(17px, 3vw, 20px)',
            fontWeight: '800',
            color: COLORS.white,
            marginBottom: '12px',
            lineHeight: '1.3',
          }}>
            {title}
          </div>
          
          <div style={{
            fontSize: 'clamp(12px, 2vw, 14px)',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Get started <FaArrowUp size={14} style={{ transform: 'rotate(45deg)' }} />
          </div>
        </div>
      </div>
    </a>
  );
};

export default ActionCard;
