interface KeyMetricProps {
  label: string;
  value: string | number;
  change?: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

export function KeyMetric({ label, value, change, color = 'blue' }: KeyMetricProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600', 
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    red: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center">
        <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
        <p className="text-sm text-gray-800 font-medium">{label}</p>
        {change && (
          <p className="text-xs text-green-600 mt-1">{change}</p>
        )}
      </div>
    </div>
  );
}