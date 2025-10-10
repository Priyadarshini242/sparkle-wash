import React, { useState, useEffect } from 'react';

const PackageSelectionModal = ({ isOpen, onClose, onPackageSelect }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCarType, setSelectedCarType] = useState('');

  // Fetch packages when modal opens
  useEffect(() => {
    const fetchPackages = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/package/package`);
        if (response.ok) {
          const data = await response.json();
          setPackages(data);
        } else {
          setError('Failed to load packages');
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [isOpen]);

  // Filter packages by car type
  const filteredPackages = selectedCarType 
    ? packages.filter(pkg => pkg.carType === selectedCarType)
    : packages;

  // Handle package selection
  const handleSelectPackage = (packageItem) => {
    onPackageSelect(packageItem);
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get unique car types
  const carTypes = [...new Set(packages.map(pkg => pkg.carType))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Select Package</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Car Type Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Car Type:
            </label>
            <select
              value={selectedCarType}
              onChange={(e) => setSelectedCarType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Car Types</option>
              {carTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Package List */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">Loading packages...</div>
              </div>
            )}

            {error && (
              <div className="flex justify-center py-8">
                <div className="text-red-500">{error}</div>
              </div>
            )}

            {!loading && !error && filteredPackages.length === 0 && (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">
                  {selectedCarType 
                    ? `No packages available for ${selectedCarType} cars` 
                    : 'No packages available'
                  }
                </div>
              </div>
            )}

            {!loading && !error && filteredPackages.length > 0 && (
              <div className="space-y-3">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg._id}
                    onClick={() => handleSelectPackage(pkg)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg text-gray-900">
                          {pkg.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {pkg.carType.charAt(0).toUpperCase() + pkg.carType.slice(1)} Car
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          {formatPrice(pkg.pricePerMonth)}
                        </div>
                        <div className="text-xs text-gray-500">per month</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Weekly Washes:</span>
                        <span className="ml-1 font-medium">{pkg.washCountPerWeek}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Washes:</span>
                        <span className="ml-1 font-medium">{pkg.washCountPerMonth}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Interior Clean:</span>
                        <span className="ml-1 font-medium">{pkg.interiorCleaning}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Exterior Wax:</span>
                        <span className="ml-1 font-medium">{pkg.exteriorWaxing}</span>
                      </div>
                    </div>

                    {pkg.description && (
                      <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
                    )}

                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                        Select This Package →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageSelectionModal;