import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const ManageWashesModal = ({ isOpen, onClose, customer, onUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ vehicles: [], month: '' });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0,7));
  const [processing, setProcessing] = useState({});

  const fetchPending = async () => {
    if (!customer || !isOpen) return;
    setLoading(true);
    try {
      const API = import.meta.env.VITE_API_URL || '';
      const res = await axios.get(`${API}/customer/${customer._id}/pending-washes?month=${selectedMonth}`);
      setData(res.data || { vehicles: [], month: '' });
    } catch (err) {
      console.error('Failed to fetch pending washes:', err, err.response && err.response.data);
      alert((err.response && (err.response.data && err.response.data.message)) || 'Failed to fetch pending washes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.debug('ManageWashesModal - isOpen:', isOpen, 'customer:', customer && customer._id, 'month:', selectedMonth);
    if (isOpen && customer) fetchPending();
  }, [isOpen, customer, selectedMonth]);

  if (!isOpen || !customer) return null;

  const handleComplete = async (vehicleId, scheduledDate, requestedWashType = 'exterior') => {
    const key = `${vehicleId || 'legacy'}_${scheduledDate}`;
    setProcessing(prev => ({ ...prev, [key]: true }));
    try {
      const API = import.meta.env.VITE_API_URL || '';
      const res = await axios.post(`${API}/customer/${customer._id}/complete-pending`, { vehicleId, scheduledDate, washType: requestedWashType });
      // refresh
      await fetchPending();
      if (typeof onUpdated === 'function') onUpdated(res.data);

      // Notify other parts of the app (details modal, dashboards) so they can refresh immediately
      try {
        window.dispatchEvent(new CustomEvent('washCompleted', { detail: { customerId: customer._id, vehicleId: vehicleId || null, scheduledDate, updatedCounts: res.data && res.data.updatedCounts, washLog: res.data && res.data.washLog } }));
      } catch (e) { /* ignore */ }
    } catch (err) {
      console.error('Failed to complete pending wash:', err);
      alert((err && err.response && err.response.data && err.response.data.message) || 'Failed to complete wash');
    } finally {
      setProcessing(prev => { const cp = { ...prev }; delete cp[key]; return cp; });
    }
  };

  // Determine whether a vehicle or customer/package has interior cleaning available
  const parseInterior = (val) => {
    if (val === null || typeof val === 'undefined') return null;
    if (typeof val === 'number') return Math.max(0, Math.floor(val));
    if (typeof val === 'boolean') return val ? 1 : 0;
    if (typeof val === 'string') {
      const s = val.trim().toLowerCase();
      if (!s) return null;
      if (s === 'no' || s === 'none' || s === 'n/a') return 0;
      const m = s.match(/(\d+)\s*/);
      if (m && m[1]) return Math.max(0, parseInt(m[1], 10));
      return null;
    }
    return null;
  };

  const vehicleHasInterior = (vehicleId) => {
    // Prefer server-provided flag from fetched pending-washes data
    if (data && Array.isArray(data.vehicles)) {
      const found = data.vehicles.find(v => String(v.vehicleId) === String(vehicleId));
      if (found && typeof found.hasInterior !== 'undefined') return !!found.hasInterior;
    }

    if (!customer) return false;
    const vehicle = (customer.vehicles || []).find(v => String(v._id) === String(vehicleId));
    const check = (obj) => {
      if (!obj) return false;
      if (obj.packageSpecs && typeof obj.packageSpecs.interiorPerMonth === 'number') {
        return obj.packageSpecs.interiorPerMonth > 0;
      }
      const parsed = parseInterior(obj.interiorCleaning) ?? parseInterior(obj.interiorCount);
      if (typeof parsed === 'number') return parsed > 0;
      if (obj.interiorCleaning === true) return true;
      return false;
    };
    if (vehicle && check(vehicle)) return true;
    return check(customer);
  };

  const handleCompleteWithInterior = async (vehicleId, scheduledDate) => {
    // Prefer server-provided hasInterior flag on the fetched data
    const vObj = (data.vehicles || []).find(x => String(x.vehicleId) === String(vehicleId));
    if (vObj && vObj.hasInterior === false) {
      if (!confirm('This vehicle/package does not include interior cleaning. Proceed with exterior-only completion?')) return;
    } else if (!vObj && !vehicleHasInterior(vehicleId)) {
      if (!confirm('This vehicle/package does not include interior cleaning. Proceed with exterior-only completion?')) return;
    }
    await handleComplete(vehicleId, scheduledDate, 'both');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Manage Washes - {customer.name}</h3>
            <div className="text-sm text-gray-600">Select month to view pending scheduled washes</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><FaTimes /></button>
        </div>

        <div className="p-4 border-b flex items-center gap-4">
          <label className="text-sm text-gray-700">Select Month:</label>
          <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border rounded px-3 py-2" />
          <div className="text-sm text-gray-500">Pending washes (including missed dates) are shown below. Note: list is capped to package pending count for the month.</div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div>
              {data.vehicles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending washes for selected month.</div>
              ) : (
                <div>
                  <div className="flex gap-2 mb-4 overflow-x-auto">
                    {data.vehicles.map(v => (
                      <button key={v.vehicleId || 'legacy'} className="px-3 py-1 text-sm bg-gray-100 rounded">{v.vehicleNo || 'No Vehicle'}</button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {data.vehicles.map(v => (
                      <div key={v.vehicleId || 'legacy'} className="border rounded p-3 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{v.vehicleNo || 'No Vehicle'}</div>
                          <div className="text-sm text-gray-500">{v.pendingWashes.length} pending</div>
                          {v.totalScheduled && v.totalScheduled > v.pendingWashes.length && (
                            <div className="text-xs text-gray-500">Showing {v.pendingWashes.length} of {v.totalScheduled} scheduled</div>
                          )}
                        </div>

                        {v.pendingWashes.length === 0 ? (
                          <div className="text-sm text-gray-500">No pending washes for this vehicle.</div>
                        ) : (
                          <ul className="space-y-2">
                            {v.pendingWashes.map(p => {
                              const key = `${v.vehicleId || 'legacy'}_${p.scheduledDate}`;
                              return (
                                <li key={key} className="flex items-center justify-between p-2 bg-white border rounded">
                                  <div>
                                    <div className="text-sm font-medium">{new Date(p.scheduledDate).toLocaleDateString()}</div>
                                    <div className="text-xs text-gray-500">{p.day} • {p.missed ? 'Missed' : 'Scheduled'} • {p.washType === 'both' ? 'Interior & Exterior' : 'Exterior'}</div>
                                  </div>
                                  <div>
                                    {(() => {
                                      const key = `${v.vehicleId || 'legacy'}_${p.scheduledDate}`;
                                      const itemProcessing = !!processing[key];

                                      // Determine whether to show interior completion option.
                                      // Business rules:
                                      // - Packages with name including 'Moderate' should NEVER show interior option.
                                      // - Packages named 'Classic', 'Premium', or 'Basic' SHOULD show interior option.
                                      // - If packageName isn't decisive, prefer server-provided v.hasInterior when true; otherwise fall back to local heuristics.
                                      let showInterior = false;
                                      const pkgName = v.packageName ? String(v.packageName).toLowerCase() : '';
                                      if (pkgName.includes('moderate')) {
                                        showInterior = false;
                                      } else if (pkgName && /(classic|premium|basic|hatch|hatch pack)/i.test(pkgName)) {
                                        showInterior = true;
                                      } else if (typeof v.hasInterior !== 'undefined' && v.hasInterior === true) {
                                        showInterior = true;
                                      } else {
                                        showInterior = (p.washType === 'both' || vehicleHasInterior(v.vehicleId));
                                      }

                                      return (
                                        <div className="flex items-center gap-2">
                                          <button
                                            onClick={() => handleComplete(v.vehicleId, p.scheduledDate)}
                                            disabled={itemProcessing}
                                            className={`px-3 py-2 text-sm rounded ${itemProcessing ? 'bg-gray-300 text-gray-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                          >
                                            {itemProcessing ? 'Processing...' : 'Complete'}
                                          </button>

                                          {showInterior && (
                                            <button
                                              onClick={() => handleCompleteWithInterior(v.vehicleId, p.scheduledDate)}
                                              disabled={itemProcessing}
                                              className={`px-3 py-2 text-sm rounded ${itemProcessing ? 'bg-gray-300 text-gray-600' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                            >
                                              {itemProcessing ? 'Processing...' : 'Complete With Interior'}
                                            </button>
                                          )}
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ManageWashesModal;
