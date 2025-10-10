import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const CustomerHistoryModal = ({ isOpen, onClose, customer }) => {
  const [washHistory, setWashHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    if (isOpen && customer) {
      fetchWashHistory();
    }
  }, [isOpen, customer, selectedMonth]);

  const fetchWashHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/${customer._id}/wash-history?month=${selectedMonth}`);
      
      if (response.ok) {
        const data = await response.json();
        setWashHistory(data.washHistory || []);
      } else {
        console.error('Failed to fetch wash history');
      }
    } catch (error) {
      console.error('Error fetching wash history:', error);
    } finally {
      setLoading(false);
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
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
            <div className="space-y-4">
              {washHistory.map((wash, index) => (
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
                    <div className="text-sm text-gray-500 capitalize">
                      {wash.washType || 'Exterior'}
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
                </div>
              ))}
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