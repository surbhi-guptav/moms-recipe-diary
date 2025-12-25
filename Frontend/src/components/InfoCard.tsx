import { ReactNode } from 'react';

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className="bg-paper rounded-2xl p-8 shadow-md transition-smooth hover-lift hover-glow">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 text-clay">{icon}</div>
        <h3 className="text-2xl font-serif font-semibold mb-3 text-ink">
          {title}
        </h3>
        <p className="text-ink text-opacity-80 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
