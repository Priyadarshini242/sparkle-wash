import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  UserPlusIcon,
  UserIcon,
  MapPinIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const WasherAllocationModal = ({ isOpen, onClose, onWasherAllocated, customer }) => {
  const [washers, setWashers] = useState([]);
  const [selectedWasher, setSelectedWasher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allocating, setAllocating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchWashers();
    }
  }, [isOpen]);

  const fetchWashers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/washer/washer`);
      
      if (response.ok) {
        const data = await response.json();
        setWashers(data);
        setError('');
      } else {
        console.error('Failed to fetch washers');
        setError('Failed to load washers');
      }
    } catch (error) {
      console.error('Error fetching washers:', error);
      setError('Error loading washers');
    } finally {
      setLoading(false);
    }
  };

  const handleWasherSelect = (washer) => {
    setSelectedWasher(washer);
  };

  const handleAllocate = async () => {
    if (!selectedWasher) return;

    try {
      setAllocating(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/allocate-washer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customer._id,
          washerId: selectedWasher._id
        })
      });

      if (response.ok) {
        const data = await response.json();
        onWasherAllocated(data.customer);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to allocate washer');
      }
    } catch (error) {
      console.error('Error allocating washer:', error);
      setError('Error allocating washer');
    } finally {
      setAllocating(false);
    }
  };

  const handleClose = () => {
    setSelectedWasher(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <UserPlusIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Allocate Washer</h2>
              <p className="text-sm text-gray-500">Select a washer for {customer?.name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={allocating}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Customer Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{customer?.name}</h3>
              <p className="text-sm text-gray-600">{customer?.apartment} - {customer?.doorNo}</p>
              <p className="text-sm text-gray-600">{customer?.carModel} ({customer?.vehicleNo})</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : washers.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No washers available</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Available Washers:</h3>
              {washers.map((washer) => (
                <div
                  key={washer._id}
                  onClick={() => handleWasherSelect(washer)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedWasher?._id === washer._id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedWasher?._id === washer._id ? 'bg-purple-200' : 'bg-gray-100'
                      }`}>
                        <UserIcon className={`h-5 w-5 ${
                          selectedWasher?._id === washer._id ? 'text-purple-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{washer.name}</h4>
                        <p className="text-sm text-gray-600">📱 {washer.mobileNo}</p>
                        <p className="text-sm text-gray-600">📧 {washer.email}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        washer.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          washer.isAvailable ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        {washer.isAvailable ? 'Available' : 'Busy'}
                      </div>
                      
                      {selectedWasher?._id === washer._id && (
                        <div className="mt-2">
                          <CheckCircleIcon className="h-5 w-5 text-purple-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">Assigned Areas:</span>
                        <p>{washer.assignedApartments?.join(', ') || 'Not assigned'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total Completed:</span>
                        <p>{washer.totalWashesCompleted || 0} washes</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={allocating}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAllocate}
            disabled={!selectedWasher || allocating}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {allocating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Allocating...
              </>
            ) : (
              <>
                <UserPlusIcon className="h-4 w-4" />
                Allocate Washer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasherAllocationModal;