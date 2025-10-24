import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const VehicleHistoryModal = ({ isOpen, onClose, customer, vehicle }) => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        // Prefer inline packageHistory if provided on vehicle prop
        if (vehicle && vehicle.packageHistory && vehicle.packageHistory.length > 0) {
          console.debug('VehicleHistoryModal - using inline vehicle.packageHistory', vehicle.packageHistory);
          setHistory(vehicle.packageHistory);
          return;
        }

        if (vehicle && vehicle._id) {
          const vid = String(vehicle._id);
          const API = import.meta.env.VITE_API_URL || '';
          // First try the direct vehicle history endpoint
          try {
            const res = await axios.get(`${API}/customer/${customer._id}/vehicles/${vid}/package-history`);
            console.debug('VehicleHistoryModal - vehicle endpoint returned', res.data);
            if (res.data && res.data.packageHistory && res.data.packageHistory.length > 0) {
              setHistory(res.data.packageHistory);
              return;
            }
          } catch (err) {
            console.debug('VehicleHistoryModal - vehicle endpoint failed', err && err.message);
          }

          // Fallback: fetch full customer and try to read nested vehicle.packageHistory
          try {
            const API = import.meta.env.VITE_API_URL || '';
            const full = await axios.get(`${API}/customer/${customer._id}`);
            console.debug('VehicleHistoryModal - full customer fetched for fallback', full.data);
            const custMatch = full.data?.vehicles?.find(v => String(v._id) === vid);
            if (custMatch && custMatch.packageHistory && custMatch.packageHistory.length > 0) {
              setHistory(custMatch.packageHistory);
              return;
            }
          } catch (err) {
            console.debug('VehicleHistoryModal - full customer fetch failed', err && err.message);
          }

          // Last resort: fall through to customer-level history (legacy)
        }

        // Customer-level history
        try {
          const API = import.meta.env.VITE_API_URL || '';
          const res = await axios.get(`${API}/customer/${customer._id}/package-history`);
          console.debug('VehicleHistoryModal - customer-level endpoint returned', res.data);
          setHistory(res.data.packageHistory || []);
        } catch (err) {
          console.debug('VehicleHistoryModal - customer-level endpoint failed', err && err.message);
        }
      } catch (err) {
        console.debug('VehicleHistoryModal - fetch error', err && err.message, err && err.response && err.response.data);
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isOpen, customer, vehicle]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Package History</h3>
            <div className="text-sm text-gray-600">{customer?.name} • {vehicle?.vehicleNo || 'Customer-level'}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <FaTimes />
          </button>
        </div>
        <div className="p-4">
          
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : history.length === 0 ? (
            <div className="text-sm text-gray-500">No package history available</div>
          ) : (
            <ul className="space-y-3">
              {history.map((h, i) => (
                <li key={i} className="p-3 bg-gray-50 border rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">{h.packageName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{h.packageId?._id || ''}</div>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                      <div>Start: {h.startDate ? new Date(h.startDate).toLocaleDateString() : 'N/A'}</div>
                      <div>End: {h.endDate ? new Date(h.endDate).toLocaleDateString() : 'N/A'}</div>
                      <div>{h.autoRenewed ? 'Auto renewed' : 'Manual'}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {showDebug && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs whitespace-pre-wrap"><strong>customer:</strong>
              <pre>{JSON.stringify(customer, null, 2)}</pre>
              <strong>vehicle:</strong>
              <pre>{JSON.stringify(vehicle, null, 2)}</pre>
              <strong>history:</strong>
              <pre>{JSON.stringify(history, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleHistoryModal;
