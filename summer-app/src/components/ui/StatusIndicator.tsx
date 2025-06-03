interface StatusIndicatorProps {
  connected: boolean;
}

export function StatusIndicator({ connected }: StatusIndicatorProps) {
  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
      connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${
        connected ? 'bg-green-500' : 'bg-red-500'
      }`}></div>
      {connected ? 'System Connected' : 'System Offline'}
    </div>
  );
}