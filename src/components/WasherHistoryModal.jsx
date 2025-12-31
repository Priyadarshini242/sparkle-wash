import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const WasherHistoryModal = ({ isOpen, onClose, washer }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [counts, setCounts] = useState({ completed: 0, cancelled: 0, total: 0 });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchHistory = async (forceMonth) => {
    if (!washer) return;
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || '';
      const [year, month] = (forceMonth || selectedMonth).split('-');
      const res = await axios.get(`${API}/washlog/washer/${washer._id}?month=${month}&year=${year}`);
      if (res && res.data) {
        setHistory(res.data.washHistory || []);
        setCounts(res.data.counts || { completed: 0, cancelled: 0, total: 0 });
      }
    } catch (err) {
      console.error('Failed to fetch washer history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchHistory();
  }, [isOpen, washer, selectedMonth]);

  useEffect(() => {
    const handler = (e) => {
      // Listen to global washReverted event and refresh if relevant
      try {
        const detail = e.detail || {};
        if (!detail) return;
        // If wash belongs to this washer, refresh
        if (detail.washId) {
          fetchHistory();
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('washReverted', handler);
    return () => window.removeEventListener('washReverted', handler);
  }, [washer]);

  if (!isOpen || !washer) return null;

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Washer History - {washer.name}</h3>
            <div className="text-sm text-gray-600">Completed: <strong>{counts.completed}</strong> • Cancelled: <strong className="text-red-600">{counts.cancelled}</strong> • Total: <strong>{counts.total}</strong></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <FaTimes />
          </button>
        </div>

        <div className="p-4 border-b flex items-center gap-4">
          <label className="text-sm text-gray-700">Select Month:</label>
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border rounded px-3 py-2" />
          <div className="text-sm text-gray-500">Showing washes for the selected month.</div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No washes found for this month.</div>
          ) : (
            <ul className="space-y-3">
              {history.map((w) => (
                <li key={w._id} className={`p-3 rounded border ${w.status === 'cancelled' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{w.vehicleNo || (w.vehicleId || 'No Vehicle')}</div>
                      <div className="text-xs text-gray-500">{formatDate(w.washDate)} • {w.washType || 'Exterior'}</div>
                    </div>
                    <div className="text-right text-sm">
                      {w.status === 'cancelled' ? (
                        <div className="text-red-600">Reverted by {w.cancelledBy || 'admin'} on {w.cancelledAt ? new Date(w.cancelledAt).toLocaleString() : 'N/A'}</div>
                      ) : (
                        <div className="text-green-700">Completed</div>
                      )}
                      {w.customerId && (
                        <div className="text-xs text-gray-500">Customer: {w.customerId.name}</div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default WasherHistoryModal;