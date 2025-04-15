
import React from "react";

interface PillProps {
  className?: string;
}

export const Pill: React.FC<PillProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="m10.5 20.5-7-7a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z" />
    <path d="m13.5 10.5 7-7a5 5 0 0 0-7 0l-7 7" />
  </svg>
);

export default Pill;
