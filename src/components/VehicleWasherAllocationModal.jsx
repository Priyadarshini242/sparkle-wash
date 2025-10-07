import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  UserPlusIcon,
  UserIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const VehicleWasherAllocationModal = ({ isOpen, onClose, onWasherAllocated, customer, vehicle }) => {
  const [washers, setWashers] = useState([]);
  const [selectedWasher, setSelectedWasher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allocating, setAllocating] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Debug logging
  console.log('VehicleWasherAllocationModal - Vehicle data:', vehicle);
  console.log('VehicleWasherAllocationModal - Customer data:', customer);

  useEffect(() => {
    if (isOpen) {
      fetchWashers();
      // Pre-select current washer if vehicle already has one
      if (vehicle?.washerId) {
        setSelectedWasher({ _id: vehicle.washerId });
      }
    }
  }, [isOpen, vehicle]);

  const fetchWashers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/washer/washer');
      
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
    // Check if vehicle already has a washer and user is trying to change
    if (vehicle?.washerId && vehicle.washerId !== washer._id) {
      setSelectedWasher(washer);
      setShowConfirmation(true);
    } else {
      setSelectedWasher(washer);
    }
  };

  const handleAllocate = async () => {
    if (!selectedWasher) return;

    try {
      setAllocating(true);
      
      // For single vehicle customers (backward compatibility), vehicle._id might be undefined
      // In that case, we need to use a different API endpoint or handle it differently
      const vehicleId = vehicle._id || 'single-vehicle';
      const apiUrl = vehicle._id 
        ? `http://localhost:5000/api/customer/${customer._id}/vehicles/${vehicle._id}/allocate-washer`
        : `http://localhost:5000/api/customer/allocate-washer`; // Legacy endpoint for single vehicles
      
      const requestBody = vehicle._id 
        ? {
            customerId: customer._id,
            washerId: selectedWasher._id,
          }
        : {
            customerId: customer._id,
            washerId: selectedWasher._id,
          };
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle different response formats
        const updatedCustomer = data.customer || data;
        onWasherAllocated(updatedCustomer);
        onClose();
        resetModal();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to allocate washer');
      }
    } catch (error) {
      console.error('Error allocating washer:', error);
      setError('Network error occurred');
    } finally {
      setAllocating(false);
      setShowConfirmation(false);
    }
  };

  const resetModal = () => {
    setSelectedWasher(null);
    setError('');
    setShowConfirmation(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const isCurrentWasher = (washer) => {
    return vehicle?.washerId === washer._id;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <UserPlusIcon className="h-7 w-7 mr-3" />
                Allocate Washer to Vehicle
              </h2>
              <p className="text-blue-100 mt-1">
                Customer: {customer?.name} | Vehicle: {vehicle?.vehicleNo} ({vehicle?.carModel})
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Vehicle Info */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <TruckIcon className="h-5 w-5 mr-2" />
              Vehicle Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Vehicle Number:</span>
                <p className="font-medium">{vehicle?.vehicleNo}</p>
              </div>
              <div>
                <span className="text-gray-500">Car Model:</span>
                <p className="font-medium">{vehicle?.carModel}</p>
              </div>
              <div>
                <span className="text-gray-500">Car Type:</span>
                <p className="font-medium capitalize">{vehicle?.carType}</p>
              </div>
              <div>
                <span className="text-gray-500">Package:</span>
                <p className="font-medium">{vehicle?.packageName || 'N/A'}</p>
              </div>
            </div>
            {vehicle?.washerId && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                  This vehicle already has a washer assigned. Selecting a new washer will replace the current assignment.
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading washers...</span>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Available Washers ({washers.length})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {washers.map((washer) => (
                  <div
                    key={washer._id}
                    className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedWasher?._id === washer._id
                        ? 'border-blue-500 bg-blue-50'
                        : isCurrentWasher(washer)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleWasherSelect(washer)}
                  >
                    {/* Current washer indicator */}
                    {isCurrentWasher(washer) && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Current
                        </div>
                      </div>
                    )}

                    {/* Selection indicator */}
                    {selectedWasher?._id === washer._id && (
                      <div className="absolute top-2 left-2">
                        <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                      </div>
                    )}

                    <div className="flex items-center mb-3">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <UserIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{washer.name}</h4>
                        <p className="text-sm text-gray-600">ID: {washer.employeeId}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{washer.location || 'Location not specified'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          washer.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {washer.isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </div>

                      {washer.currentCustomers && washer.currentCustomers > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Current Customers:</span>
                          <span className="font-medium">{washer.currentCustomers}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {washers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No washers available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedWasher && (
              <span>Selected: <strong>{washers.find(w => w._id === selectedWasher._id)?.name}</strong></span>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={allocating}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleAllocate}
              disabled={!selectedWasher || allocating}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              {allocating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Allocating...
                </>
              ) : (
                <>
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Allocate Washer
                </>
              )}
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500 mr-3" />
                <h3 className="text-lg font-semibold">Change Washer Assignment</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                This vehicle already has a washer assigned. Are you sure you want to change the washer assignment? 
                This will affect the current washing schedule and pending wash details.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAllocate}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
                >
                  Yes, Change Washer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleWasherAllocationModal;