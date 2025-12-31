import React, { useState, useEffect } from 'react';
import { useCancelWashMutation } from '../store/apiSlice';
import { 
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const CustomerHistoryModal = ({ isOpen, onClose, customer, onReverted }) => {
  const [washHistory, setWashHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isOpen && customer) {
      fetchWashHistory();
    }
  }, [isOpen, customer, selectedMonth]);

  const fetchWashHistory = async () => {
    try {
      setLoading(true);
      const API = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API}/customer/${customer._id}/wash-history?month=${selectedMonth}`);
      
      if (response.ok) {
        const data = await response.json();
        setWashHistory(data.washHistory || []);
        setActiveTab('all');
      } else {
        console.error('Failed to fetch wash history');
      }
    } catch (error) {
      console.error('Error fetching wash history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group history by vehicleId for vehicle-wise tabs
  const groupedByVehicle = washHistory.reduce((acc, wash) => {
    const vid = wash.vehicleId ? String(wash.vehicleId) : 'legacy';
    if (!acc[vid]) acc[vid] = [];
    acc[vid].push(wash);
    return acc;
  }, {});

  const vehiclesList = (() => {
    const vehicles = [];
    if (customer && Array.isArray(customer.vehicles)) {
      customer.vehicles.forEach(v => vehicles.push({ id: String(v._id), label: v.vehicleNo || `Vehicle ${v._id}` }));
    }
    // Add a legacy tab for washes without vehicleId
    if (groupedByVehicle['legacy']) vehicles.push({ id: 'legacy', label: 'No Vehicle' });
    return vehicles;
  })();

  const [processingReverts, setProcessingReverts] = useState({});
  const [cancelWash] = useCancelWashMutation();

  const handleRevert = async (wash) => {
    if (!wash || !wash._id) return;
    if (!confirm('Are you sure you want to revert this wash? This will add one pending wash back.')) return;
    try {
      setProcessingReverts(prev => ({ ...prev, [wash._id]: true }));
      const data = await cancelWash(wash._id).unwrap();
      alert(data.message || 'Wash reverted');
      // Refresh history and notify parent to refresh lists
      await fetchWashHistory();
      if (typeof onReverted === 'function') onReverted();
      // Dispatch a global event so washer UI can refetch
      try { window.dispatchEvent(new CustomEvent('washReverted', { detail: { washId: wash._id, customerId: customer?._id, vehicleId: wash.vehicleId } })); } catch (e) { /* ignore */ }
    } catch (err) {
      console.error('Failed to revert wash:', err && (err.data?.message || err.message));
      alert((err && err.data && err.data.message) || err.message || 'Failed to revert wash');
    } finally {
      setProcessingReverts(prev => {
        const copy = { ...prev };
        delete copy[wash._id];
        return copy;
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Plain date format for export (DD/MM/YYYY) — no time
  const formatDatePlain = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB');
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800'
    };

    const statusIcons = {
      'completed': <CheckCircleIcon className="h-4 w-4" />,
      'pending': <ClockIcon className="h-4 w-4" />,
      'cancelled': <XMarkIcon className="h-4 w-4" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Export current (vehicle/month) history to printable window (user can save as PDF)
  const handleExport = async () => {
    // Determine completed entries for export (respect active tab)
    let completedEntries = activeTab === 'all' ? washHistory : (groupedByVehicle[activeTab] || []);
    // Exclude cancelled from completed list
    completedEntries = completedEntries.filter(w => w.status !== 'cancelled' && w.status === 'completed');

    // Fetch pending washes from server for this customer & month
    const API = import.meta.env.VITE_API_URL || '';
    let pendingEntries = [];
    try {
      const resp = await fetch(`${API}/customer/${customer._id}/pending-washes?month=${selectedMonth}`);
      if (resp.ok) {
        const data = await resp.json();
        const vehicles = data.vehicles || [];

        if (activeTab === 'all') {
          // combine pending from all vehicles
          pendingEntries = vehicles.reduce((acc, v) => acc.concat((v.pendingWashes || []).map(p => ({ ...p, vehicleId: v.vehicleId, vehicleNo: v.vehicleNo }))), []);
        } else if (activeTab === 'legacy') {
          const v = vehicles.find(x => x.vehicleId === null || typeof x.vehicleId === 'undefined');
          pendingEntries = v ? (v.pendingWashes || []).map(p => ({ ...p, vehicleId: null, vehicleNo: v.vehicleNo })) : [];
        } else {
          const v = vehicles.find(x => String(x.vehicleId) === String(activeTab));
          pendingEntries = v ? (v.pendingWashes || []).map(p => ({ ...p, vehicleId: v.vehicleId, vehicleNo: v.vehicleNo })) : [];
        }
      } else {
        console.error('Failed to fetch pending washes for export');
      }
    } catch (err) {
      console.error('Error fetching pending washes for export:', err);
    }

    // If we have no completed and no pending, show alert
    if ((!completedEntries || completedEntries.length === 0) && (!pendingEntries || pendingEntries.length === 0)) {
      alert('No completed or pending washes to export for the selected vehicle/month');
      return;
    }

    // Determine vehicle info
    const vehicleInfo = customer && Array.isArray(customer.vehicles) ? customer.vehicles.find(v => String(v._id) === String(activeTab)) : null;
    const vehicleLabel = vehicleInfo ? (vehicleInfo.vehicleNo || `Vehicle ${vehicleInfo._id}`) : (activeTab === 'legacy' ? 'No Vehicle' : 'All Vehicles');
    const vehicleType = vehicleInfo ? (vehicleInfo.carType || 'Unknown') : (customer?.carType || 'Unknown');

    const monthLabel = selectedMonth ? new Date(selectedMonth + '-01').toLocaleString('en-US', { month: 'long', year: 'numeric' }) : '';

    // Build printable HTML
    const html = `
      <html>
        <head>
          <title>Wash History - ${customer?.name} - ${vehicleLabel}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #111827; }
            h1 { font-size: 20px; margin: 0 0 6px 0 }
            p { margin: 6px 0 }
            table { width: 100%; border-collapse: collapse; margin-top: 12px }
            th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 13px }
            th { background: #f3f4f6 }
            .section-title { margin-top: 14px; font-weight: 600 }
          </style>
        </head>
        <body>
          <h1>Wash History - ${customer?.name || ''}</h1>
          <p><strong>Vehicle:</strong> ${vehicleLabel}</p>
          <p><strong>Vehicle Type:</strong> ${vehicleType}</p>
          <p><strong>Month:</strong> ${monthLabel}</p>
          <p><strong>Completed:</strong> ${completedEntries.length} &nbsp;&nbsp; <strong>Pending:</strong> ${pendingEntries.length}</p>

          <div class="section-title">Completed Washes</div>
          ${completedEntries.length === 0 ? '<p>No completed washes</p>' : `
            <table>
              <thead><tr><th>Date</th><th>Washer</th><th>Type</th></tr></thead>
              <tbody>
                ${completedEntries.map(c => `<tr><td>${formatDatePlain(c.washDate)}</td><td>${c.washerName || '-'}</td><td>${c.washType || '-'}</td></tr>`).join('')}
              </tbody>
            </table>
          `}

          <div class="section-title">Pending Washes</div>
          ${pendingEntries.length === 0 ? '<p>No pending washes</p>' : `
            <table>
              <thead><tr><th>Scheduled Date</th><th>Missed</th><th>Type</th></tr></thead>
              <tbody>
                ${pendingEntries.map(p => `<tr><td>${p.scheduledDate ? formatDatePlain(p.scheduledDate) : ''}</td><td>${p.missed ? 'Yes' : 'No'}</td><td>${p.washType || '-'}</td></tr>`).join('')}
              </tbody>
            </table>
          `}

        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (!w) {
      alert('Popup blocked. Please allow popups for this site to export history.');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();

    // Give browser a moment to render and then trigger print
    setTimeout(() => {
      try {
        w.focus();
        w.print();
      } catch (err) {
        console.error('Print failed', err);
      }
    }, 500);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Wash History - {customer?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {customer?.apartment} - {customer?.doorNo} | {customer?.carModel}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <DocumentTextIcon className="h-4 w-4" />
              Export History
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Month Filter */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">
              Select Month:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : washHistory.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No wash history found for this month</p>
            </div>
          ) : (
            <div>
              {/* Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg text-sm ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  All
                </button>
                {vehiclesList.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setActiveTab(v.id)}
                    className={`px-3 py-1 rounded-lg text-sm ${activeTab === v.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {v.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {(activeTab === 'all' ? washHistory : (groupedByVehicle[activeTab] || [])).map((wash, index) => (
                  <div
                    key={wash._id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(wash.washDate)}
                        </div>
                        {getStatusBadge(wash.status)}
                      </div>
                      <div className="text-sm text-gray-500 capitalize flex items-center gap-3">
                        <div>{wash.washType || 'Exterior'}</div>
                        {wash.vehicleId && (
                          <div className="px-2 py-0.5 bg-gray-100 rounded text-xs">Vehicle</div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      {wash.washerName && (
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                          <span>Washer: {wash.washerName}</span>
                        </div>
                      )}
                      
                      {wash.location && (
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4 text-gray-500" />
                          <span>Location: {wash.location}</span>
                        </div>
                      )}
                    </div>

                    {wash.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                          <DocumentTextIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                          <p className="text-sm text-gray-600">{wash.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Revert button for completed washes */}
                    {wash.status === 'completed' && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleRevert(wash)}
                          disabled={!!processingReverts[wash._id]}
                          className={`px-3 py-2 text-sm rounded-lg ${processingReverts[wash._id] ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
                        >
                          {processingReverts[wash._id] ? 'Processing...' : 'Revert'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerHistoryModal;