import { Agent } from '../types';
import { Card } from './ui/Card';

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
        <p className="text-gray-800">{agent.specialty}</p>
        <div className="flex items-center mt-1">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 text-sm text-gray-900">{agent.rating}</span>
        </div>
      </div>
      
      {agent.quote && (
        <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <p className="text-sm italic text-blue-800">"{agent.quote}"</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-lg font-semibold text-blue-600">{agent.leads}</p>
          <p className="text-xs text-gray-800">Leads</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-green-600">{agent.deals}</p>
          <p className="text-xs text-gray-800">Deals</p>
        </div>
      </div>
    </Card>
  );
}