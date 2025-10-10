import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDaysIcon, BuildingOffice2Icon, FunnelIcon } from '@heroicons/react/24/outline';

const WasherDashboard = () => {
  const [washer, setWasher] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [carTypes, setCarTypes] = useState([]); // New state for car types
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [completingWash, setCompletingWash] = useState(null);
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedApartment, setSelectedApartment] = useState('all');
  const [selectedCarType, setSelectedCarType] = useState('all'); // New state for car type filter
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if washer is authenticated
    const washerAuth = localStorage.getItem('washerAuth');
    if (!washerAuth) {
      navigate('/washer');
      return;
    }

    const washerData = JSON.parse(washerAuth);
    setWasher(washerData);
    fetchWasherData(washerData._id);
  }, [navigate, selectedDate, selectedApartment, selectedCarType]);

  const fetchWasherData = async (washerId, date = selectedDate, apartment = selectedApartment, carType = selectedCarType) => {
    try {
      setLoading(true);
      let url = `import.meta.env.VITE_API_URL/washer/dashboard/${washerId}`;
      const params = new URLSearchParams();
      
      if (date && date !== 'today') {
        params.append('date', date);
      }
      if (apartment && apartment !== 'all') {
        params.append('apartment', apartment);
      }
      if (carType && carType !== 'all') {
        params.append('carType', carType);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Washer Dashboard data received:', data); // Debug log
        console.log('🔍 Customers array:', data.customers); // Debug log
        console.log('🔍 Sample customer:', data.customers?.[0]); // Debug log
        
        // Update washer data with the response
        setWasher(data.washer);
        setCustomers(data.customers || []);
        setApartments(data.apartments || []);
        setCarTypes(data.carTypes || []); // Set car types from response
      } else {
        throw new Error('Failed to fetch washer data');
      }
    } catch (error) {
      console.error('Error fetching washer data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const markWashCompleted = async (customerId) => {
    setCompletingWash(customerId);
    try {
      console.log('Washer data:', washer); // Debug log
      console.log('Customer ID:', customerId); // Debug log
      
      if (!washer || !washer._id) {
        throw new Error('Washer data not loaded properly');
      }

      const response = await fetch('import.meta.env.VITE_API_URL/customer/complete-wash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          washerId: washer._id,
          washerName: washer.name
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update the customer in the local state
        setCustomers(prevCustomers => 
          prevCustomers.map(customer => 
            customer._id === customerId 
              ? { ...customer, pendingWashes: customer.pendingWashes - 1, completedWashes: customer.completedWashes + 1 }
              : customer
          )
        );
        alert(`Wash completed successfully! Customer has ${result.pendingWashes} washes remaining.`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark wash as completed');
      }
    } catch (error) {
      console.error('Error completing wash:', error);
      alert(`Failed to complete wash: ${error.message}`);
    } finally {
      setCompletingWash(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('washerAuth');
    navigate('/washer');
  };

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    setExpandedCustomer(null); // Close any expanded customer
  };

  const handleApartmentFilter = (apartment) => {
    setSelectedApartment(apartment);
    setExpandedCustomer(null); // Close any expanded customer
  };

  const handleCarTypeFilter = (carType) => {
    setSelectedCarType(carType);
    setExpandedCustomer(null); // Close any expanded customer
  };

  // Get next few days for date filter
  const getDateOptions = () => {
    const options = [
      { value: 'today', label: 'Today' },
      { value: 'all', label: 'All Scheduled' }
    ];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      options.push({ value: dateStr, label: dayName });
    }
    
    return options;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <span className="text-red-500 text-4xl mb-4 block">⚠️</span>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {washer?.name?.charAt(0)?.toUpperCase() || 'W'}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">
                  Hi, {washer?.name || 'Washer'} 👋
                </h1>
                <p className="text-sm text-gray-500">Welcome back to your dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Location */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">📍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Location</p>
                <p className="text-lg font-semibold text-gray-900">
                  {washer?.assignedApartments?.[0] || 'Not Assigned'}
                </p>
              </div>
            </div>
          </div>

          {/* Active Customers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Customers</p>
                <p className="text-lg font-semibold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className={`text-lg font-semibold ${
                  washer?.isAvailable ? 'text-green-600' : 'text-red-600'
                }`}>
                  {washer?.isAvailable ? 'Available' : 'Busy'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Filter */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <CalendarDaysIcon className="h-4 w-4" />
                    <span>Filter by Date</span>
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => handleDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {getDateOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Apartment Filter */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <BuildingOffice2Icon className="h-4 w-4" />
                    <span>Filter by Apartment</span>
                  </label>
                  <select
                    value={selectedApartment}
                    onChange={(e) => handleApartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Apartments</option>
                    {apartments.map((apartment) => (
                      <option key={apartment} value={apartment}>
                        {apartment}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Car Type Filter */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span>Filter by Car Type</span>
                  </label>
                  <select
                    value={selectedCarType}
                    onChange={(e) => handleCarTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Car Types</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>
              
              {/* Filter Results Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  Showing {customers.length} customer{customers.length !== 1 ? 's' : ''} 
                  {selectedDate !== 'today' && selectedDate !== 'all' && (
                    <span> scheduled for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                  )}
                  {selectedDate === 'today' && <span> who need wash today</span>}
                  {selectedApartment !== 'all' && <span> in {selectedApartment}</span>}
                </p>
              </div>
            </div>
          </div>

        {/* Customers List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Assigned Customers</h2>
            <p className="text-sm text-gray-500">Manage your assigned customer washes</p>
          </div>

          {customers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🧽</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers assigned</h3>
              <p className="text-gray-500">You don't have any customers assigned at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {customers.map((customer) => {
                // Debug log for each customer
                console.log(`🔍 Rendering customer:`, customer);
                
                return (
                  <div key={customer._id} className="p-6">
                  {/* Simple View */}
                  {expandedCustomer !== customer._id ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">
                            {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {customer.name || customer.customerName || 'Unknown Customer'}
                          </h3>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm text-gray-500">
                              {customer.apartment} • {customer.pendingWashes || 0} washes pending
                            </p>
                            {/* Vehicle Information */}
                            {customer.vehicleNo && customer.carModel && (
                              <p className="text-sm text-blue-600">
                                🚗 {customer.vehicleNo} ({customer.carModel})
                                {customer.assignmentType === 'vehicle-level' && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Vehicle</span>
                                )}
                                {customer.assignmentType === 'customer-level' && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded">Customer</span>
                                )}
                              </p>
                            )}
                            {customer.washingDayNames && customer.washingDayNames.length > 0 && (
                              <p className="text-xs text-green-600">
                                Schedule: {customer.washingDayNames.join(', ')}
                                {customer.needsWashToday && <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full">Due Today</span>}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setExpandedCustomer(customer._id)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          More Details
                        </button>
                        <button
                          onClick={() => markWashCompleted(customer._id)}
                          disabled={!customer.pendingWashes || customer.pendingWashes <= 0 || completingWash === customer._id}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            customer.pendingWashes > 0 && completingWash !== customer._id
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {completingWash === customer._id ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Completing...</span>
                            </div>
                          ) : (
                            'Mark Complete'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Detailed View */
                    <div className="space-y-4">
                      {/* Header with collapse button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {(customer.name || customer.customerName)?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {customer.name || customer.customerName || 'Unknown Customer'}
                            </h3>
                            <p className="text-sm text-gray-500">Complete customer details</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedCustomer(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          ← Back
                        </button>
                      </div>

                      {/* Detailed Customer Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Contact Information */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Contact Information</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Mobile Number</label>
                                <p className="text-sm text-gray-900">{customer.mobileNo || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <p className="text-sm text-gray-900">{customer.email || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Location Details */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Location Details</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Apartment</label>
                                <p className="text-sm text-gray-900">{customer.apartment || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Door Number</label>
                                <p className="text-sm text-gray-900">{customer.doorNo || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Vehicle Information */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Vehicle Information</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Vehicle Number</label>
                                <p className="text-sm text-gray-900">{customer.vehicleNo || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Car Model</label>
                                <p className="text-sm text-gray-900">{customer.carModel || 'Not provided'}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Car Type</label>
                                <p className="text-sm text-gray-900 capitalize">{customer.carType || 'Not specified'}</p>
                              </div>
                              {/* Assignment Type for Multi-Vehicle Customers */}
                              {customer.assignmentType && (
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Assignment Type</label>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    customer.assignmentType === 'vehicle-level' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {customer.assignmentType === 'vehicle-level' ? 'Individual Vehicle' : 'Customer Level'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Service Information */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-900">Service Information</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Package</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  customer.packageName === 'Basic' ? 'bg-green-100 text-green-800' :
                                  customer.packageName === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                                  customer.packageName === 'Classic' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {customer.packageName || 'No Package'}
                                </span>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Pending Washes</label>
                                <p className="text-sm font-semibold text-orange-600">
                                  {customer.pendingWashes || 0} remaining
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Completed Washes</label>
                                <p className="text-sm font-semibold text-green-600">
                                  {customer.completedWashes || 0} completed
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => markWashCompleted(customer._id)}
                          disabled={!customer.pendingWashes || customer.pendingWashes <= 0 || completingWash === customer._id}
                          className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                            customer.pendingWashes > 0 && completingWash !== customer._id
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {completingWash === customer._id ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Completing...</span>
                            </div>
                          ) : (
                            'Mark Work Complete'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasherDashboard;