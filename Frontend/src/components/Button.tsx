import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = 'px-8 py-4 rounded-full font-medium text-lg transition-smooth hover-glow';

  const variantStyles = {
    primary: 'bg-clay text-parchment hover:bg-opacity-90',
    secondary: 'bg-lavender text-parchment hover:bg-opacity-90'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
