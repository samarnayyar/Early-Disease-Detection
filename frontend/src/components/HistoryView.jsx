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
        const token = localStorage.getItem('medpredict_token');
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
          <h2 className="text-3xl font-black text-white tracking-tight">Assessment History</h2>
          <p className="text-slate-400 mt-2">Your last 20 clinical predictions.</p>
        </div>
      </div>

      <div className="bg-[#1e293b]/50 rounded-2xl border border-slate-700/50 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p>Loading your history...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-400">
            <AlertCircle className="w-8 h-8 mb-4" />
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Clock className="w-8 h-8 mb-4 opacity-50" />
            <p>You haven't made any predictions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700/50">
                  <th className="p-4 text-sm font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="p-4 text-sm font-bold text-slate-400 uppercase tracking-wider">Assessment</th>
                  <th className="p-4 text-sm font-bold text-slate-400 uppercase tracking-wider">Risk Score</th>
                  <th className="p-4 text-sm font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-sm font-bold text-slate-400 uppercase tracking-wider text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {history.map((record) => (
                  <React.Fragment key={record.id}>
                    <tr 
                      className={`transition-colors cursor-pointer ${expandedId === record.id ? 'bg-slate-800/50' : 'hover:bg-slate-800/30'}`}
                      onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                    >
                      <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center text-slate-300">
                        <Clock className="w-4 h-4 mr-2 text-slate-500" />
                        {new Date(record.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mr-3">
                          <Activity className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="font-semibold text-white capitalize">{record.disease} Disease</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${record.risk_score > 70 ? 'bg-red-500' : record.risk_score > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${record.risk_score}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-300">{record.risk_score}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        record.status.includes('High') ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        record.status.includes('Mod') ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {record.status.includes('High') && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700/50">
                        {expandedId === record.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedId === record.id && (
                    <tr className="bg-slate-900/50">
                      <td colSpan="5" className="p-6">
                        <div className="mb-4">
                          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Clinical Parameters Entered</h4>
                        </div>
                        {Object.keys(record.input_data).length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {Object.entries(record.input_data).map(([key, value]) => (
                              <div key={key} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex flex-col justify-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate mb-1">
                                  {key.replace(/_/g, ' ')}
                                </span>
                                <span className="text-sm font-black text-white truncate">
                                  {value !== null && value !== "" ? value : "N/A"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 italic">No input data recorded for this assessment.</p>
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
