import React, { useState, useEffect } from 'react';
import PackageSelectionModal from './PackageSelectionModal';

const AddCustomerModal = ({ isOpen, onClose, onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    email: '',
    apartment: '',
    doorNo: '',
    vehicles: [
      {
        vehicleNo: '',
        carModel: '',
        carType: 'sedan',
        packageId: '',
        packageName: '',
        scheduleType: 'schedule1'
      }
    ]
  });
  
  const [errors, setErrors] = useState({});
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch packages on component mount
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/package/packages');
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

  // Handle customer info changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle vehicle changes
  const handleVehicleChange = (index, field, value) => {
    const updatedVehicles = [...formData.vehicles];
    updatedVehicles[index] = { ...updatedVehicles[index], [field]: value };
    setFormData(prev => ({ ...prev, vehicles: updatedVehicles }));
    
    // Clear error when user starts typing
    const errorKey = `vehicle_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  // Add new vehicle
  const addVehicle = () => {
    setFormData(prev => ({
      ...prev,
      vehicles: [
        ...prev.vehicles,
        {
          vehicleNo: '',
          carModel: '',
          carType: 'sedan',
          packageId: '',
          packageName: '',
          scheduleType: 'schedule1'
        }
      ]
    }));
  };

  // Remove vehicle
  const removeVehicle = (index) => {
    if (formData.vehicles.length > 1) {
      const updatedVehicles = formData.vehicles.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, vehicles: updatedVehicles }));
    }
  };

  // Handle package selection
  const handlePackageSelect = (packageData) => {
    const updatedVehicles = [...formData.vehicles];
    updatedVehicles[currentVehicleIndex] = {
      ...updatedVehicles[currentVehicleIndex],
      packageId: packageData._id,
      packageName: packageData.name
    };
    setFormData(prev => ({ ...prev, vehicles: updatedVehicles }));
    setIsPackageModalOpen(false);
  };

  // Open package selection
  const openPackageSelection = (vehicleIndex) => {
    setCurrentVehicleIndex(vehicleIndex);
    setIsPackageModalOpen(true);
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Customer validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobileNo.trim()) newErrors.mobileNo = 'Mobile number is required';
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.apartment.trim()) newErrors.apartment = 'Apartment is required';
    if (!formData.doorNo.trim()) newErrors.doorNo = 'Door number is required';

    // Vehicle validation
    formData.vehicles.forEach((vehicle, index) => {
      if (!vehicle.vehicleNo.trim()) {
        newErrors[`vehicle_${index}_vehicleNo`] = 'Vehicle number is required';
      }
      if (!vehicle.carModel.trim()) {
        newErrors[`vehicle_${index}_carModel`] = 'Car model is required';
      }
      if (!vehicle.packageId) {
        newErrors[`vehicle_${index}_package`] = 'Package selection is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/customer/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        onCustomerAdded(result.customer);
        handleClose();
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Failed to create customer'));
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      name: '',
      mobileNo: '',
      email: '',
      apartment: '',
      doorNo: '',
      vehicles: [
        {
          vehicleNo: '',
          carModel: '',
          carType: 'sedan',
          packageId: '',
          packageName: '',
          scheduleType: 'schedule1'
        }
      ]
    });
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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[95vh] overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Add New Customer</h2>
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Information Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Customer Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Mobile Number Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNo"
                        value={formData.mobileNo}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.mobileNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter 10-digit mobile number"
                      />
                      {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email address"
                      />
                    </div>

                    {/* Empty div for grid alignment */}
                    <div></div>

                    {/* Apartment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment *
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.apartment ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Building/Society"
                      />
                      {errors.apartment && <p className="text-red-500 text-xs mt-1">{errors.apartment}</p>}
                    </div>

                    {/* Door Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Door No. *
                      </label>
                      <input
                        type="text"
                        name="doorNo"
                        value={formData.doorNo}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.doorNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Flat/House number"
                      />
                      {errors.doorNo && <p className="text-red-500 text-xs mt-1">{errors.doorNo}</p>}
                    </div>
                  </div>
                </div>

                {/* Vehicles Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                      </svg>
                      Vehicle Information ({formData.vehicles.length} vehicle{formData.vehicles.length !== 1 ? 's' : ''})
                    </h3>
                    <button
                      type="button"
                      onClick={addVehicle}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transform hover:scale-105 transition-all duration-200 shadow-md"
                    >
                      + Add Vehicle
                    </button>
                  </div>

                  <div className="space-y-6">
                    {formData.vehicles.map((vehicle, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-gray-800">Vehicle {index + 1}</h4>
                          {formData.vehicles.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVehicle(index)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                              title="Remove Vehicle"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Vehicle Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Vehicle Number *
                            </label>
                            <input
                              type="text"
                              value={vehicle.vehicleNo}
                              onChange={(e) => handleVehicleChange(index, 'vehicleNo', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors[`vehicle_${index}_vehicleNo`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g., AB12CD3456"
                            />
                            {errors[`vehicle_${index}_vehicleNo`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`vehicle_${index}_vehicleNo`]}</p>
                            )}
                          </div>

                          {/* Car Model */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Car Model *
                            </label>
                            <input
                              type="text"
                              value={vehicle.carModel}
                              onChange={(e) => handleVehicleChange(index, 'carModel', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors[`vehicle_${index}_carModel`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g., Honda City"
                            />
                            {errors[`vehicle_${index}_carModel`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`vehicle_${index}_carModel`]}</p>
                            )}
                          </div>

                          {/* Car Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Car Type *
                            </label>
                            <select
                              value={vehicle.carType}
                              onChange={(e) => handleVehicleChange(index, 'carType', e.target.value)}
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
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => openPackageSelection(index)}
                              className={`flex-1 px-4 py-2 border-2 border-dashed rounded-md text-sm font-medium transition-colors duration-200 ${
                                vehicle.packageName
                                  ? 'border-green-400 bg-green-50 text-green-700'
                                  : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              {vehicle.packageName ? (
                                <span className="flex items-center justify-center">
                                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  {vehicle.packageName} Package Selected
                                </span>
                              ) : (
                                <span>Click to Select Package</span>
                              )}
                            </button>
                          </div>
                          {errors[`vehicle_${index}_package`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`vehicle_${index}_package`]}</p>
                          )}
                        </div>

                        {/* Schedule Selection */}
                        {vehicle.packageName && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Washing Schedule *
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                <input
                                  type="radio"
                                  value="schedule1"
                                  checked={vehicle.scheduleType === 'schedule1'}
                                  onChange={(e) => handleVehicleChange(index, 'scheduleType', e.target.value)}
                                  className="mr-3 text-blue-600"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">Schedule 1</div>
                                  <div className="text-sm text-gray-600">
                                    {getScheduleDisplay('schedule1', vehicle.packageName)}
                                  </div>
                                </div>
                              </label>
                              
                              <label className="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                                <input
                                  type="radio"
                                  value="schedule2"
                                  checked={vehicle.scheduleType === 'schedule2'}
                                  onChange={(e) => handleVehicleChange(index, 'scheduleType', e.target.value)}
                                  className="mr-3 text-blue-600"
                                />
                                <div>
                                  <div className="font-medium text-gray-900">Schedule 2</div>
                                  <div className="text-sm text-gray-600">
                                    {getScheduleDisplay('schedule2', vehicle.packageName)}
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
                        Creating Customer...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Customer
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

export default AddCustomerModal;