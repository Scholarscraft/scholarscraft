import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface SmoothLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

const SmoothLink: React.FC<SmoothLinkProps> = ({ children, className, to, ...props }) => {
  const handleClick = () => {
    // Add a small delay to ensure route change happens first
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 50);
  };

  return (
    <Link
      to={to}
      className={`transition-all duration-300 ease-out hover:transform hover:scale-105 ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
};

export default SmoothLink;