import React from 'react';

export default function Card({ children, className = '', title }) {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-header"><h3 className="font-bold text-lg">{title}</h3></div>}
      <div className="card-body">{children}</div>
    </div>
  );
}
