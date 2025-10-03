import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  UserIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import PackageSelectionModal from './PackageSelectionModal';

const EditCustomerModal = ({ isOpen, onClose, onCustomerUpdated, customer }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNo: '',
    email: '',
    apartment: '',
    doorNo: '',
    carModel: '',
    vehicleNo: '',
    packageId: '',
    packageName: ''
  });
  
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when customer changes
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        mobileNo: customer.mobileNo || '',
        email: customer.email || '',
        apartment: customer.apartment || '',
        doorNo: customer.doorNo || '',
        carModel: customer.carModel || '',
        vehicleNo: customer.vehicleNo || '',
        packageId: customer.packageId?._id || customer.packageId || '',
        packageName: customer.packageName || (customer.packageId?.name) || ''
      });
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePackageSelect = (selectedPackage) => {
    setFormData(prev => ({
      ...prev,
      packageId: selectedPackage._id,
      packageName: selectedPackage.name
    }));
    setIsPackageModalOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic customer info validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobileNo.trim()) newErrors.mobileNo = 'Mobile number is required';
    if (!formData.apartment.trim()) newErrors.apartment = 'Apartment is required';
    if (!formData.doorNo.trim()) newErrors.doorNo = 'Door number is required';
    
    // Only validate single-vehicle fields if this is a single-vehicle customer
    const isMultiVehicleCustomer = customer?.vehicles && customer.vehicles.length > 0;
    if (!isMultiVehicleCustomer) {
      if (!formData.carModel.trim()) newErrors.carModel = 'Car model is required';
      if (!formData.vehicleNo.trim()) newErrors.vehicleNo = 'Vehicle number is required';
      if (!formData.packageId) newErrors.packageId = 'Package selection is required';
    }
    
    // Mobile number validation (10 digits)
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Mobile number must be 10 digits';
    }
    
    // Email validation (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch(`http://localhost:5000/api/customer/update/${customer._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const updatedCustomer = await response.json();
        onCustomerUpdated(updatedCustomer.customer);
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Failed to update customer:', errorData);
        alert('Error: ' + (errorData.message || 'Failed to update customer'));
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error updating customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      packageName: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <PencilIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Customer</h2>
              <p className="text-sm text-gray-500">Update customer information</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter customer name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.mobileNo ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="10-digit mobile number"
                maxLength={10}
              />
              {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="customer@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.apartment ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Apartment name"
              />
              {errors.apartment && <p className="text-red-500 text-xs mt-1">{errors.apartment}</p>}
            </div>

            {/* Door Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Door Number *
              </label>
              <input
                type="text"
                name="doorNo"
                value={formData.doorNo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.doorNo ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Door/Flat number"
              />
              {errors.doorNo && <p className="text-red-500 text-xs mt-1">{errors.doorNo}</p>}
            </div>

            {/* Single Vehicle Fields - Only show for single-vehicle customers */}
            {(!customer?.vehicles || customer.vehicles.length === 0) && (
              <>
                {/* Car Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Model *
                  </label>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.carModel ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Honda City, Maruti Swift"
                  />
                  {errors.carModel && <p className="text-red-500 text-xs mt-1">{errors.carModel}</p>}
                </div>

                {/* Vehicle Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.vehicleNo ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., KA 01 AB 1234"
                    style={{ textTransform: 'uppercase' }}
                  />
                  {errors.vehicleNo && <p className="text-red-500 text-xs mt-1">{errors.vehicleNo}</p>}
                </div>
              </>
            )}

            {/* Multi-vehicle info message */}
            {customer?.vehicles && customer.vehicles.length > 0 && (
              <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-800 font-medium">
                    This customer has {customer.vehicles.length} vehicle{customer.vehicles.length > 1 ? 's' : ''}. 
                    Vehicle details can be managed from the Customer Details page.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Package Selection - Only show for single-vehicle customers */}
          {(!customer?.vehicles || customer.vehicles.length === 0) && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package *
              </label>
              <button
                type="button"
                onClick={() => setIsPackageModalOpen(true)}
                className={`w-full px-3 py-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.packageId ? 'border-red-300' : 'border-gray-300'
                } ${formData.packageName ? 'bg-blue-50' : 'bg-white'}`}
              >
                {formData.packageName ? (
                  <span className="text-blue-700 font-medium">{formData.packageName}</span>
                ) : (
                  <span className="text-gray-500">Click to select package</span>
                )}
              </button>
              {errors.packageId && <p className="text-red-500 text-xs mt-1">{errors.packageId}</p>}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <PencilIcon className="h-4 w-4" />
                Update Customer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Package Selection Modal */}
      <PackageSelectionModal
        isOpen={isPackageModalOpen}
        onClose={() => setIsPackageModalOpen(false)}
        onPackageSelect={handlePackageSelect}
        selectedPackageId={formData.packageId}
      />
    </div>
  );
};

export default EditCustomerModal;