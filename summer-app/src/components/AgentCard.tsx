import { Agent } from '../types';

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{agent.name}</h3>
        <p className="text-gray-600">{agent.specialty}</p>
        <div className="flex items-center mt-1">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 text-sm">{agent.rating}</span>
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
          <p className="text-xs text-gray-600">Leads</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-green-600">{agent.deals}</p>
          <p className="text-xs text-gray-600">Deals</p>
        </div>
      </div>
    </div>
  );
}
