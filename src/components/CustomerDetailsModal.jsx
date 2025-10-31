import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaCar, FaEdit, FaTrash, FaPlus, FaUser, FaPhone, FaEnvelope, FaHome, FaDoorClosed, FaCalendarAlt, FaChartBar } from 'react-icons/fa';
import VehicleWasherAllocationModal from './VehicleWasherAllocationModal';
import VehicleHistoryModal from './VehicleHistoryModal';

const CustomerDetailsModal = ({ 
  isOpen, 
  onClose, 
  customer, 
  vehiclePreview = null,
  onCustomerUpdated,
  onEditVehicle, 
  onDeleteVehicle, 
  onAddVehicle, 
  onEditCustomer 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isWasherModalOpen, setIsWasherModalOpen] = useState(false);
  const [selectedVehicleForWasher, setSelectedVehicleForWasher] = useState(null);
  const [packageHistoryByVehicle, setPackageHistoryByVehicle] = useState({});
  const [customerPackageHistory, setCustomerPackageHistory] = useState([]);
  const [freshCustomer, setFreshCustomer] = useState(null);
  const [openHistories, setOpenHistories] = useState({});
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [historyModalVehicle, setHistoryModalVehicle] = useState(null);
  

  useEffect(() => {
    if (!customer) return;

    const fetchFullCustomer = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || '';
        const res = await axios.get(`${API}/customer/${customer._id}`);
        setFreshCustomer(res.data);
        return res.data;
      } catch (err) {
        console.debug('Failed to fetch full customer', err && err.message);
        setFreshCustomer(null);
        return null;
      }
    };

    // Fetch legacy customer-level package history
    const fetchCustomerHistory = async () => {
      try {
        const API = import.meta.env.VITE_API_URL || '';
        const res = await axios.get(`${API}/customer/${customer._id}/package-history`);
        const list = res.data.packageHistory || [];
        setCustomerPackageHistory(list);
        // also register under legacy key for UI consistency
        setPackageHistoryByVehicle(prev => ({ ...(prev || {}), legacy: { loading: false, packageHistory: list, loaded: true, visible: false } }));
      } catch (err) {
        // ignore errors silently for now
      }
    };

    const fetchVehicleHistories = async (freshData) => {
      if (!customer.vehicles || customer.vehicles.length === 0) return;
      const map = {};
      await Promise.all(customer.vehicles.map(async (v) => {
        const vid = v._id ? String(v._id) : null;
        if (!vid) return;
        // Prefer freshly fetched customer data (passed in) vehicle.packageHistory if available
        const freshV = freshData?.vehicles?.find(x => String(x._id) === vid);
        if (freshV && freshV.packageHistory && freshV.packageHistory.length > 0) {
          console.debug('Using freshCustomer.vehicle.packageHistory for', vid, freshV.packageHistory);
          map[vid] = { loading: false, packageHistory: freshV.packageHistory, loaded: true, visible: false };
          return;
        }
        // Fallback to original customer prop's packageHistory
        if (v.packageHistory && v.packageHistory.length > 0) {
          console.debug('Using inline vehicle.packageHistory for', vid, v.packageHistory);
          map[vid] = { loading: false, packageHistory: v.packageHistory, loaded: true, visible: false };
          return;
        }
        try {
          const res = await axios.get(`/api/customer/${customer._id}/vehicles/${vid}/package-history`);
          console.debug('Fetched packageHistory for vehicle', vid, res.data.packageHistory);
          map[vid] = { loading: false, packageHistory: res.data.packageHistory || [], loaded: true, visible: false };
        } catch (err) {
          console.debug('Failed to fetch packageHistory for vehicle', vid, err && err.message);
          map[vid] = { loading: false, packageHistory: [], loaded: true, visible: false };
        }
      }));
      setPackageHistoryByVehicle(prev => ({ ...(prev || {}), ...map }));
    };

    // Initialize sequence: fetch full customer first, then histories
    (async () => {
      const full = await fetchFullCustomer();
      await fetchCustomerHistory();
      await fetchVehicleHistories(full);
    })();
  }, [customer]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
    return;
  }, [isOpen]);

  useEffect(() => {
    console.debug('CustomerDetailsModal - customer prop:', customer);
    console.debug('CustomerDetailsModal - freshCustomer:', freshCustomer);
    console.debug('CustomerDetailsModal - packageHistoryByVehicle keys:', Object.keys(packageHistoryByVehicle || {}));
  }, [customer, freshCustomer, packageHistoryByVehicle]);

  // Ensure we still short-circuit rendering when modal is closed or customer missing
  if (!isOpen || !customer) return null;

  const hasMultipleVehicles = customer.hasMultipleVehicles || (customer.totalVehicles && customer.totalVehicles > 1);

  const handleAllocateWasher = (customer, vehicle) => {
    setSelectedVehicleForWasher(vehicle);
    setIsWasherModalOpen(true);
  };

  const handleWasherModalClose = () => {
    setIsWasherModalOpen(false);
    setSelectedVehicleForWasher(null);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return '₹0';
    return `₹${price.toLocaleString()}`;
  };

  const getScheduleDescription = (scheduleType) => {
    switch (scheduleType) {
      case 'schedule1':
        return 'Monday & Thursday';
      case 'schedule2':
        return 'Tuesday & Saturday';
      default:
        return 'Not Set';
    }
  };

  const getDaysFromWashingDays = (washingDays) => {
    if (!washingDays || !Array.isArray(washingDays) || washingDays.length === 0) return null;
    const names = {
      1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun'
    };
    return washingDays.map(d => names[d] || d).join(', ');
  };

  // Vehicle Card Component
  const VehicleCard = ({ vehicle, index, isMultiVehicle, onAllocateWasher, isPreview }) => (
    <div className={`border rounded-lg p-4 ${isMultiVehicle ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <FaCar className="h-5 w-5 text-blue-600" />
          <h4 className="text-lg font-semibold text-gray-900">
            {isMultiVehicle ? `Vehicle ${index + 1}` : 'Vehicle Details'}
          </h4>
        </div>
        {isMultiVehicle && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEditVehicle && onEditVehicle(vehicle)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
              title="Edit Vehicle"
            >
              <FaEdit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDeleteVehicle && onDeleteVehicle(vehicle)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
              title="Delete Vehicle"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
  <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Car Model:</label>
          <p className="text-sm text-gray-900 font-medium">{vehicle.carModel || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Vehicle No:</label>
          <p className="text-sm text-gray-900 font-medium">{vehicle.vehicleNo || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Car Type:</label>
          <p className="text-sm text-gray-900 font-medium capitalize">{vehicle.carType || 'N/A'}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Package:</label>
          <p className="text-sm text-purple-700 font-semibold">{vehicle.packageName || 'N/A'}</p>
        </div>
        {/* Washing Schedule display */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Washing Schedule:</label>
          <p className="text-sm text-gray-900 font-medium">
            {(
              // priority: explicit washingDayNames -> washingSchedule.washingDays -> scheduleType
              vehicle.washingDayNames && vehicle.washingDayNames.length > 0
            ) ? vehicle.washingDayNames.join(', ') : (
              vehicle.washingSchedule && vehicle.washingSchedule.washingDays && vehicle.washingSchedule.washingDays.length > 0
                ? getDaysFromWashingDays(vehicle.washingSchedule.washingDays)
                : (vehicle.washingSchedule && vehicle.washingSchedule.scheduleType) ? getScheduleDescription(vehicle.washingSchedule.scheduleType) : (vehicle.scheduleType ? getScheduleDescription(vehicle.scheduleType) : 'Not Set')
            )}
          </p>
        </div>
          <div>
           <label className="block text-sm font-medium text-gray-600 mb-1">Package Start Date:</label>
            {/* Fallbacks: vehicle.packageStartDate -> vehicle.subscriptionStart -> customer.packageStartDate */}
            <p className="text-sm text-gray-900 font-medium">{
              (vehicle.packageStartDate || vehicle.subscriptionStart || (customer && customer.packageStartDate))
                ? formatDate(vehicle.packageStartDate || vehicle.subscriptionStart || (customer && customer.packageStartDate))
                : 'N/A'
            }</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Package End Date:</label>
            {/* Fallbacks: vehicle.packageEndDate -> vehicle.subscriptionEnd -> customer.packageEndDate */}
            <p className="text-sm text-gray-900 font-medium">{
              (vehicle.packageEndDate  || (customer && customer.packageEndDate))
                ? formatDate(vehicle.packageEndDate || (customer && customer.packageEndDate))
                : 'N/A'
            }</p>
          </div>
          
          {/* Start Package Button */}
          {!vehicle.hasStarted && !vehicle.packageStartDate && (
            <div className="col-span-2 mt-4">
              <button
                onClick={async () => {
                  try {
                    const API = import.meta.env.VITE_API_URL || '';
                    await axios.post(`${API}/customer/${customer._id}/vehicles/${vehicle._id}/start-package`);
                    // Refresh data
                    if (onCustomerUpdated) {
                      await onCustomerUpdated();
                    } else {
                      window.location.reload();
                    }
                  } catch (error) {
                    console.error('Failed to start package:', error);
                    alert(error.response?.data?.message || 'Failed to start package');
                  }
                }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                Start Package
              </button>
            </div>
          )}
      </div>


      {/* Package History (per-vehicle) */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <FaCalendarAlt className="h-4 w-4 text-gray-600" />
          <h5 className="text-sm font-medium text-gray-700">Package History</h5>
        </div>
        <div>
          <button
            onClick={() => {
              setHistoryModalVehicle(vehicle);
              setOpenHistoryModal(true);
            }}
            className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            View History
          </button>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 mb-3">
          <FaChartBar className="h-4 w-4 text-gray-600" />
          <h5 className="text-sm font-medium text-gray-700">Wash Statistics</h5>
        </div>
          <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-2xl font-bold text-orange-600">{(vehicle.pendingWashes != null) ? vehicle.pendingWashes : 0}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-2xl font-bold text-green-600">{(vehicle.completedWashes != null) ? vehicle.completedWashes : 0}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-3 border">
            <div className="text-2xl font-bold text-blue-600">{(vehicle.totalMonthlyWashes != null) ? vehicle.totalMonthlyWashes : 0}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Washer Assignment Section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <svg className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h5 className="text-sm font-medium text-gray-700">Washer Assignment</h5>
          </div>
          <button
            onClick={() => onAllocateWasher && onAllocateWasher(customer, vehicle)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
              vehicle.washerId 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
            }`}
          >
            {vehicle.washerId ? 'Change Washer' : 'Assign Washer'}
          </button>
        </div>
        
        {vehicle.washerId ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">
                  {vehicle.washerId?.name || 'Assigned Washer'}
                </p>
                <p className="text-xs text-green-600">
                  ID: {vehicle.washerId?.employeeId || 'N/A'}
                </p>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs">Assigned</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-orange-700">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">No washer assigned</span>
            </div>
          </div>
        )}
      </div>
      {isPreview && (
        <div className="mt-3 text-sm text-gray-500">(Preview - not saved yet)</div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        
        {/* Header */}
        <div className={`p-6 border-b ${hasMultipleVehicles ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-blue-600'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <FaUser className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{customer.name}</h2>
                <p className="text-blue-100">
                  {hasMultipleVehicles ? `${customer.totalVehicles} Vehicles` : '1 Vehicle'} • 
                  <span className="ml-1">Customer Details</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
            >
              <FaTimes className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === 'overview' 
                  ? 'bg-white text-blue-600' 
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === 'vehicles' 
                  ? 'bg-white text-blue-600' 
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              Vehicles ({customer.totalVehicles || 1})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <FaUser className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                  </div>
                  <button
                    onClick={() => onEditCustomer && onEditCustomer(customer)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FaEdit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <FaPhone className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                      <p className="text-lg text-gray-900">{customer.mobileNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <p className="text-lg text-gray-900">{customer.email || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaHome className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Apartment</label>
                      <p className="text-lg text-gray-900">{customer.apartment}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaDoorClosed className="h-5 w-5 text-gray-400" />
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Door Number</label>
                      <p className="text-lg text-gray-900">{customer.doorNo}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <FaCalendarAlt className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Subscription Details</h3>
                </div>
                {/* Package history is shown per-vehicle in the Vehicles tab. */}
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Vehicles</h3>
                <button
                  onClick={() => onAddVehicle && onAddVehicle(customer)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>
              
              <div className="grid gap-4">
                {vehiclePreview && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Preview Vehicle</h4>
                    <VehicleCard vehicle={vehiclePreview} index={0} isMultiVehicle={hasMultipleVehicles} onAllocateWasher={handleAllocateWasher} isPreview />
                  </div>
                )}

                {customer.vehicles && customer.vehicles.length > 0 ? (
                  customer.vehicles.map((vehicle, index) => (
                    <VehicleCard 
                      key={vehicle._id || index} 
                      vehicle={vehicle} 
                      index={index} 
                      isMultiVehicle={hasMultipleVehicles}
                      onAllocateWasher={handleAllocateWasher}
                    />
                  ))
                ) : customer.carModel ? (
                  // Display single vehicle for backward compatibility
                  <VehicleCard 
                    vehicle={{
                      carModel: customer.carModel,
                      vehicleNo: customer.vehicleNo,
                      carType: customer.carType,
                      packageName: customer.packageName,
                      washerId: customer.washerId,
                      packageStartDate: customer.packageStartDate,
                      packageEndDate: customer.packageEndDate
                    }} 
                    index={0} 
                    isMultiVehicle={false}
                    onAllocateWasher={handleAllocateWasher}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaCar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No vehicles found for this customer.</p>
                    <button
                      onClick={() => onAddVehicle && onAddVehicle(customer)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add First Vehicle
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>

      {/* Washer Allocation Modal */}
      <VehicleWasherAllocationModal
        isOpen={isWasherModalOpen}
        onClose={handleWasherModalClose}
        customer={customer}
        vehicle={selectedVehicleForWasher}
        onWasherAllocated={onCustomerUpdated}
      />
      {/* Vehicle History Modal */}
      <VehicleHistoryModal
        isOpen={openHistoryModal}
        onClose={() => { setOpenHistoryModal(false); setHistoryModalVehicle(null); }}
        customer={freshCustomer || customer}
        vehicle={historyModalVehicle}
      />
    </div>
  );
}

export default CustomerDetailsModal;