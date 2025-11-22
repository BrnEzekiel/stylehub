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

const GlassStatCard = ({ title, value, growth, icon: Icon, linkTo, gradient, delay }) => {
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
          padding: 'clamp(24px, 4vw, 32px)',
          position: 'relative',
          overflow: 'hidden',
          border: `2px solid ${isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.12)'}`,
          boxShadow: isHovered 
            ? '0 30px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            : '0 10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer'
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
        
        {/* Gradient overlay on hover */}
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
        
        {/* Floating glass orbs */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          top: '-150px',
          right: '-150px',
          filter: 'blur(60px)',
          opacity: isHovered ? 0.8 : 0.3,
          transition: 'opacity 0.6s ease'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: '24px', 
            flexWrap: 'wrap', 
            gap: '12px' 
          }}>
            <div style={{
              width: 'clamp(52px, 10vw, 64px)',
              height: 'clamp(52px, 10vw, 64px)',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: isHovered 
                ? '0 15px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)' 
                : '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              transition: 'all 0.6s ease'
            }}>
              <Icon size={30} color={COLORS.white} strokeWidth={2.5} />
            </div>
            {growth !== undefined && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '16px',
                background: growth > 0 ? 'rgba(0, 255, 0, 0.2)' : 'rgba(239, 68, 68, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: growth > 0 ? '2px solid rgba(0, 255, 0, 0.5)' : '2px solid rgba(239, 68, 68, 0.4)',
                color: growth > 0 ? COLORS.green : COLORS.red,
                fontSize: 'clamp(12px, 2vw, 14px)',
                fontWeight: '800',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              }}>
                <FaArrowUp size={16} style={{ display: 'inline-block', transform: growth < 0 ? 'rotate(180deg)' : 'none' }} />
                {Math.abs(growth)}%
              </div>
            )}
          </div>
          
          <div style={{
            fontSize: 'clamp(12px, 2vw, 14px)',
            fontWeight: '700',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            {title}
          </div>
          
          <div style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: '900',
            color: COLORS.white,
            lineHeight: '1',
            marginBottom: '16px',
          }}>
            {value}
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 'clamp(12px, 2vw, 14px)',
            fontWeight: '600'
          }}>
            <span>View details</span>
            <FaArrowUp size={16} style={{ transform: 'rotate(45deg)' }} />
          </div>
        </div>
      </div>
    </a>
  );
};

export default GlassStatCard;
