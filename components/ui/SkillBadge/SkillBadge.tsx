import { cn } from '@/lib/utils/cn';

interface SkillBadgeProps {
  skill: string;
  variant?: 'matched' | 'missing' | 'neutral';
  className?: string;
}

export function SkillBadge({ skill, variant = 'neutral', className }: SkillBadgeProps) {
  const variants = {
    matched: 'bg-green-100 text-green-800 border-green-300',
    missing: 'bg-red-100 text-red-800 border-red-300',
    neutral: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium',
        variants[variant],
        className
      )}
    >
      {skill}
    </span>
  );
}
