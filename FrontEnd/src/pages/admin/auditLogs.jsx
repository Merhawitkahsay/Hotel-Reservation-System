import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { ClipboardList, Clock, ShieldCheck, AlertTriangle, Info, Database, Filter } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      if (res.data?.success) setLogs(res.data.data);
    } catch (err) {
      console.error("Logs failed");
    } finally {
      setLoading(false);
    }
  };

  const getActionStyle = (action) => {
    if (action.includes('DELETE')) return 'bg-red-50 text-red-600 border-red-100';
    if (action.includes('CREATE') || action.includes('ADD')) return 'bg-green-50 text-green-600 border-green-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Database className="animate-pulse text-amber-600 mx-auto mb-4" size={48} />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Retrieving Logs...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-32 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 font-serif uppercase tracking-tighter italic">
              System <span className="text-amber-600">Audit Logs</span>
            </h1>
            <p className="text-gray-500 font-medium">Chronological record of all administrative actions.</p>
          </div>
          <button className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-gray-400 hover:text-amber-600 transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {logs.map((log, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-start gap-6 group hover:shadow-lg transition-all duration-500">
              <div className={`p-4 rounded-2xl border ${getActionStyle(log.action)}`}>
                <ShieldCheck size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest italic">{log.action}</h3>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                    <Clock size={12} /> {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  <span className="text-gray-900 font-bold italic">{log.admin_name}</span> {log.details}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <span className="text-[10px] px-3 py-1 bg-gray-100 rounded-full font-black text-gray-400 uppercase">IP: {log.ip_address || '127.0.0.1'}</span>
                  <span className="text-[10px] px-3 py-1 bg-gray-100 rounded-full font-black text-gray-400 uppercase">ID: #{log.id}</span>
                </div>
              </div>
            </div>
          ))}

          {logs.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
              <ClipboardList className="mx-auto text-gray-200 mb-4" size={64} />
              <p className="text-gray-400 font-black uppercase tracking-widest italic">No activities recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;