import { cn } from '@/lib/utils/cn';

interface MatchScoreProps {
  score: number; // 0-1
  percentage: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MatchScore({ score, percentage, size = 'md', className }: MatchScoreProps) {
  const getColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-blue-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className={cn('font-bold', getColor(score), sizes[size])}>{percentage}</div>
      <div className="text-sm text-gray-500">Match Score</div>
    </div>
  );
}
