import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WasherDashboard = () => {
  const [washer, setWasher] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [completingWash, setCompletingWash] = useState(null);
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
  }, [navigate]);

  const fetchWasherData = async (washerId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/washer/dashboard/${washerId}`);
      
      if (response.ok) {
        const data = await response.json();
        // Update washer data with the response
        setWasher(data.washer);
        setCustomers(data.customers || []);
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

      const response = await fetch('http://localhost:5000/api/customer/complete-wash', {
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
              {customers.map((customer) => (
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
                          <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                          <p className="text-sm text-gray-500">
                            {customer.apartment} • {customer.pendingWashes || 0} washes pending
                          </p>
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
                              {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WasherDashboard;