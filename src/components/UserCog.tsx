
import React from "react";

interface UserCogProps {
  className?: string;
}

const UserCog: React.FC<UserCogProps> = ({ className }) => (
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
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="15" r="2" />
  </svg>
);

export default UserCog;
