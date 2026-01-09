import React, { useState, useEffect, useRef } from 'react';
import PackageSelectionModal from './PackageSelectionModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EditVehicleModal = ({ isOpen, onClose, customer, vehicle, onVehicleUpdated }) => {
  const [vehicleData, setVehicleData] = useState({
    vehicleNo: '',
    carModel: '',
    carType: 'sedan',
    packageId: '',
    packageName: '',
    scheduleType: 'schedule1',
    packageStartDate: '',
    packageEndDate: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when vehicle prop changes
  useEffect(() => {
    if (vehicle) {
      setVehicleData({
        vehicleNo: vehicle.vehicleNo || '',
        carModel: vehicle.carModel || '',
        carType: vehicle.carType || 'sedan',
        packageId: vehicle.packageId?._id || vehicle.packageId || '',
        packageName: vehicle.packageName || vehicle.packageId?.name || '',
        scheduleType: vehicle.washingSchedule?.scheduleType || 'schedule1',
        packageStartDate: vehicle.packageStartDate ? new Date(vehicle.packageStartDate) : (vehicle.subscriptionStart ? new Date(vehicle.subscriptionStart) : null),
        packageEndDate: vehicle.packageEndDate ? new Date(vehicle.packageEndDate) : (vehicle.subscriptionEnd ? new Date(vehicle.subscriptionEnd) : null)
      });
    }
  }, [vehicle]);

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/package/package`);
        if (response.ok) {
          const data = await response.json();
          setPackages(data);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle package selection
  const handlePackageSelect = (packageData) => {
    setVehicleData(prev => ({
      ...prev,
      packageId: packageData._id,
      packageName: packageData.name
    }));
    setIsPackageModalOpen(false);
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!vehicleData.vehicleNo.trim()) {
      newErrors.vehicleNo = 'Vehicle number is required';
    }
    if (!vehicleData.carModel.trim()) {
      newErrors.carModel = 'Car model is required';
    }
    if (!vehicleData.packageId) {
      newErrors.package = 'Package selection is required';
    }

    // Validate package dates if provided
    if (vehicleData.packageStartDate && vehicleData.packageEndDate) {
      const s = vehicleData.packageStartDate instanceof Date ? vehicleData.packageStartDate : new Date(vehicleData.packageStartDate);
      const e = vehicleData.packageEndDate instanceof Date ? vehicleData.packageEndDate : new Date(vehicleData.packageEndDate);
      if (isNaN(s.getTime()) || isNaN(e.getTime())) {
        newErrors.packageDates = 'Invalid date(s)';
      } else if (s > e) {
        newErrors.packageDates = 'Start date must be on or before end date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Prepare payload, convert Date objects to ISO strings for backend
      const payload = { ...vehicleData };
      if (vehicleData.packageStartDate instanceof Date) payload.packageStartDate = vehicleData.packageStartDate.toISOString();
      if (vehicleData.packageEndDate instanceof Date) payload.packageEndDate = vehicleData.packageEndDate.toISOString();

    const response = await fetch(`${import.meta.env.VITE_API_URL}/customer/${customer._id}/vehicles/${vehicle._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        onVehicleUpdated && onVehicleUpdated(result.customer);
        handleClose();
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Failed to update vehicle'));
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setErrors({});
    onClose();
  };

  // Get schedule display text
  const getScheduleDisplay = (scheduleType, packageName) => {
    if (scheduleType === 'schedule1') {
      return packageName === 'Basic' ? 'Monday & Thursday' : 'Monday, Wednesday & Friday';
    } else if (scheduleType === 'schedule2') {
      return packageName === 'Basic' ? 'Tuesday & Saturday' : 'Tuesday, Thursday & Saturday';
    }
    return 'Custom Schedule';
  };

  if (!isOpen || !vehicle) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Edit Vehicle</h2>
                  <p className="text-blue-100 text-sm">Customer: {customer?.name} | Vehicle: {vehicle?.vehicleNo}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 text-2xl transform hover:scale-110 transition-all duration-200"
                  disabled={isLoading}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Information */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                    </svg>
                    Vehicle Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vehicle Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Number *
                      </label>
                      <input
                        type="text"
                        name="vehicleNo"
                        value={vehicleData.vehicleNo}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.vehicleNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., AB12CD3456"
                      />
                      {errors.vehicleNo && <p className="text-red-500 text-xs mt-1">{errors.vehicleNo}</p>}
                    </div>

                    {/* Car Model */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Car Model *
                      </label>
                      <input
                        type="text"
                        name="carModel"
                        value={vehicleData.carModel}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.carModel ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Honda City"
                      />
                      {errors.carModel && <p className="text-red-500 text-xs mt-1">{errors.carModel}</p>}
                    </div>

                    {/* Car Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Car Type *
                      </label>
                      <select
                        name="carType"
                        value={vehicleData.carType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                  </div>

                  {/* Package Selection */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package Selection *
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsPackageModalOpen(true)}
                      className={`w-full px-4 py-2 border-2 border-dashed rounded-md text-sm font-medium transition-colors duration-200 ${
                        vehicleData.packageName
                          ? 'border-blue-400 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {vehicleData.packageName ? (
                        <span className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {vehicleData.packageName} Package Selected
                        </span>
                      ) : (
                        <span>Click to Select Package</span>
                      )}
                    </button>
                    {errors.package && <p className="text-red-500 text-xs mt-1">{errors.package}</p>}
                  </div>

                  {/* Package Start/End Dates (optional edit) */}
                  {vehicleData.packageName && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Start Date</label>
                        <DatePicker
                          selected={vehicleData.packageStartDate}
                          onChange={(date) => setVehicleData(prev => ({ ...prev, packageStartDate: date }))}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select start date"
                          isClearable
                          todayButton="Today"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                          popperPlacement="bottom-start"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Package End Date</label>
                        <DatePicker
                          selected={vehicleData.packageEndDate}
                          onChange={(date) => setVehicleData(prev => ({ ...prev, packageEndDate: date }))}
                          dateFormat="yyyy-MM-dd"
                          placeholderText="Select end date"
                          isClearable
                          todayButton="Today"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                          popperPlacement="bottom-start"
                        />
                      </div>
                    </div>
                  )}
                  {errors.packageDates && <p className="text-red-500 text-xs mt-2">{errors.packageDates}</p>}

                  {/* Schedule Selection */}
                  {vehicleData.packageName && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Washing Schedule *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                          <input
                            type="radio"
                            name="scheduleType"
                            value="schedule1"
                            checked={vehicleData.scheduleType === 'schedule1'}
                            onChange={handleInputChange}
                            className="mr-3 text-blue-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">Schedule 1</div>
                            <div className="text-sm text-gray-600">
                              {getScheduleDisplay('schedule1', vehicleData.packageName)}
                            </div>
                          </div>
                        </label>
                        
                        <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                          <input
                            type="radio"
                            name="scheduleType"
                            value="schedule2"
                            checked={vehicleData.scheduleType === 'schedule2'}
                            onChange={handleInputChange}
                            className="mr-3 text-blue-600"
                          />
                          <div>
                            <div className="font-medium text-gray-900">Schedule 2</div>
                            <div className="text-sm text-gray-600">
                              {getScheduleDisplay('schedule2', vehicleData.packageName)}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center font-medium transition-all duration-200 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating Vehicle...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Update Vehicle
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Package Selection Modal */}
      <PackageSelectionModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        onPackageSelect={handlePackageSelect}
        packages={packages}
      />
    </>
  );
};

export default EditVehicleModal;