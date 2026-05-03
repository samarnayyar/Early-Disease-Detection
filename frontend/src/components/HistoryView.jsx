import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Activity, AlertTriangle, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

export default function HistoryView({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('wellcore_token');
        if (!token) throw new Error("Please log in to view history.");

        const res = await fetch('http://localhost:5000/api/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch history");

        setHistory(data.history || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Assessment History</h2>
          <p className="text-neutral-600 mt-2">Your last 20 clinical predictions.</p>
        </div>
      </div>

      <div className="bg-[#f4f0e6]/50 rounded-lg border border-neutral-300/50 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-600">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading your history...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <AlertCircle className="w-8 h-8 mb-4" />
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-600">
            <Clock className="w-8 h-8 mb-4 opacity-50" />
            <p>You haven't made any predictions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100/50 border-b border-neutral-300/50">
                  <th className="p-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Assessment</th>
                  <th className="p-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Risk Score</th>
                  <th className="p-4 text-sm font-bold text-neutral-600 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-sm font-bold text-neutral-600 uppercase tracking-wider text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700/50">
                {history.map((record) => (
                  <React.Fragment key={record.id}>
                    <tr 
                      className={`transition-colors cursor-pointer ${expandedId === record.id ? 'bg-neutral-100/50' : 'hover:bg-neutral-100/30'}`}
                      onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                    >
                      <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center text-neutral-700">
                        <Clock className="w-4 h-4 mr-2 text-neutral-500" />
                        {new Date(record.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="font-semibold text-neutral-900 capitalize">{record.disease} Disease</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${record.risk_score > 70 ? 'bg-red-500' : record.risk_score > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${record.risk_score}%` }}
                          />
                        </div>
                        <span className="font-bold text-neutral-700">{record.risk_score}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                         record.status.includes('High') ? 'bg-red-600/10 text-red-600 border-red-600/20' : 
                         record.status.includes('Mod') ? 'bg-amber-600/10 text-amber-600 border-amber-600/20' : 
                         'bg-emerald-600/10 text-emerald-600 border-emerald-600/20'
                       }`}>
                        {record.status.includes('High') && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-neutral-600 hover:text-neutral-900 transition-colors p-2 rounded-full hover:bg-neutral-700/50">
                        {expandedId === record.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedId === record.id && (
                    <tr className="bg-neutral-200/50">
                      <td colSpan="5" className="p-6">
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-neutral-700 uppercase tracking-wider">Clinical Parameters Entered</h4>
                        </div>
                        {Object.keys(record.input_data).length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {Object.entries(record.input_data).map(([key, value]) => (
                              <div key={key} className="bg-neutral-100/50 p-3 rounded-md border border-neutral-300/50 flex flex-col justify-center">
                                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider truncate mb-1">
                                  {key.replace(/_/g, ' ')}
                                </span>
                                <span className="text-sm font-medium text-neutral-900 truncate">
                                  {value !== null && value !== "" ? value : "N/A"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-neutral-500 italic">No input data recorded for this assessment.</p>
                        )}
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
