import React, { useState, useEffect } from 'react';
import PackageSelectionModal from './PackageSelectionModal';

const AddCustomerModal = ({ isOpen, onClose, onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    email: '',
    apartment: '',
    doorNo: '',
    carModel: '',
    vehicleNo: '',
    packageId: '',
    packageName: '',
    washerId: '',
    scheduleType: 'schedule1' // Default to schedule1
  });
  
  const [errors, setErrors] = useState({});
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [washers, setWashers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch washers on component mount
  useEffect(() => {
    const fetchWashers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/washer/washer');
        if (response.ok) {
          const data = await response.json();
          setWashers(data);
        }
      } catch (error) {
        console.error('Error fetching washers:', error);
      }
    };

    if (isOpen) {
      fetchWashers();
    }
  }, [isOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle package selection
  const handlePackageSelect = (selectedPackage) => {
    setFormData(prev => ({
      ...prev,
      packageId: selectedPackage._id,
      packageName: selectedPackage.name
    }));
    setIsPackageModalOpen(false);
    
    // Clear package error
    if (errors.packageId) {
      setErrors(prev => ({ ...prev, packageId: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobileNo.trim()) newErrors.mobileNo = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobileNo.trim())) newErrors.mobileNo = 'Mobile number must be 10 digits';
    
    if (!formData.apartment.trim()) newErrors.apartment = 'Apartment is required';
    if (!formData.doorNo.trim()) newErrors.doorNo = 'Door number is required';
    if (!formData.carModel.trim()) newErrors.carModel = 'Car model is required';
    if (!formData.vehicleNo.trim()) newErrors.vehicleNo = 'Vehicle number is required';
    if (!formData.packageId) newErrors.packageId = 'Package selection is required';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
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
      // Prepare the data, handling empty washerId
      const submitData = {
        ...formData,
        washerId: formData.washerId || undefined // Send undefined instead of empty string
      };

      const response = await fetch('http://localhost:5000/api/customer/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
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
      carModel: '',
      vehicleNo: '',
      packageId: '',
      packageName: '',
      washerId: '',
      scheduleType: 'schedule1' // Reset to default
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Customer</h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
                disabled={isLoading}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Apartment and Door Number Row */}
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Flat/Unit No."
                  />
                  {errors.doorNo && <p className="text-red-500 text-xs mt-1">{errors.doorNo}</p>}
                </div>
              </div>

              {/* Car Model and Vehicle Number Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Model *
                  </label>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.carModel ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Honda Civic"
                  />
                  {errors.carModel && <p className="text-red-500 text-xs mt-1">{errors.carModel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.vehicleNo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., AB12CD3456"
                  />
                  {errors.vehicleNo && <p className="text-red-500 text-xs mt-1">{errors.vehicleNo}</p>}
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Package *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.packageName}
                    readOnly
                    className={`flex-1 px-3 py-2 border rounded-l-md bg-gray-50 focus:outline-none ${
                      errors.packageId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="No package selected"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPackageModalOpen(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Select
                  </button>
                </div>
                {errors.packageId && <p className="text-red-500 text-xs mt-1">{errors.packageId}</p>}
              </div>

              {/* Schedule Selection - Show only if package is selected */}
              {formData.packageName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Washing Schedule *
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="schedule1"
                        name="scheduleType"
                        value="schedule1"
                        checked={formData.scheduleType === 'schedule1'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="schedule1" className="ml-2 block text-sm text-gray-700">
                        {formData.packageName === 'Basic' 
                          ? 'Monday & Thursday (2 times/week)' 
                          : 'Monday, Wednesday & Friday (3 times/week)'
                        }
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="schedule2"
                        name="scheduleType"
                        value="schedule2"
                        checked={formData.scheduleType === 'schedule2'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="schedule2" className="ml-2 block text-sm text-gray-700">
                        {formData.packageName === 'Basic' 
                          ? 'Tuesday & Saturday (2 times/week)' 
                          : 'Tuesday, Thursday & Saturday (3 times/week)'
                        }
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Washer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Washer
                </label>
                <select
                  name="washerId"
                  value={formData.washerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a washer (optional)</option>
                  {washers.map(washer => (
                    <option key={washer._id} value={washer._id}>
                      {washer.name} - {washer.mobileNo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Package Selection Modal */}
      <PackageSelectionModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        onPackageSelect={handlePackageSelect}
      />
    </>
  );
};

export default AddCustomerModal;