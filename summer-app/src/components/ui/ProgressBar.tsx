interface ProgressBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
}

export function ProgressBar({ label, value, maxValue, color = 'bg-blue-600' }: ProgressBarProps) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="flex items-center">
      <span className="w-8 text-sm font-medium text-gray-900">{label}</span>
      <div className="flex-1 mx-3">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className={`${color} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}