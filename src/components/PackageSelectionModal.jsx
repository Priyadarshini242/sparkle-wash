import React, { useState, useEffect } from 'react';
import { useGetPackagesQuery } from '../store/apiSlice';

const PackageSelectionModal = ({ isOpen, onClose, onPackageSelect }) => {
  const [selectedCarType, setSelectedCarType] = useState('');
  // Use RTK Query hook to fetch packages
  const { data: packages = [], isLoading, isError } = useGetPackagesQuery(undefined, { skip: !isOpen });

  // Filter packages by car type
  const filteredPackages = selectedCarType ? packages.filter(pkg => pkg.carType === selectedCarType) : packages;

  // Handle package selection
  const handleSelectPackage = (packageItem) => {
    // augment package with derived schedule rules so callers (add customer / add vehicle) get the correct details
    const specs = getPackageSpecs(packageItem);
    // include the currently selected car type (if user selected one) so caller can store it
    const chosenCarType = selectedCarType || packageItem.carType || '';
    onPackageSelect({ ...packageItem, specs, chosenCarType });
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

  // Derive package specs according to requested rules
  const getPackageSpecs = (pkg) => {
    const name = (pkg.name || '').toLowerCase();
    // default values (fallback to package fields if available)
    let exteriorPerMonth = pkg.washCountPerMonth || 0;
    let exteriorPerWeek = pkg.washCountPerWeek || 0;
    let interiorPerMonth = pkg.interiorCleaning || 0;
    let interiorSchedule = '';

    if (name.includes('basic')) {
      exteriorPerMonth = 8;
      exteriorPerWeek = 2; // 2 per week
      interiorPerMonth = 2; // two interiors per month
      interiorSchedule = 'Bi-weekly (every ~15 days) — 2 per month';
    } else if (name.includes('classic')) {
      exteriorPerMonth = 12;
      exteriorPerWeek = 3; // 3 per week
      interiorPerMonth = 2; // two interiors per month
      interiorSchedule = 'Twice per month';
    } else if (name.includes('moderate')) {
      exteriorPerMonth = 12;
      exteriorPerWeek = 3; // 3 per week
      interiorPerMonth = 0; // no interior
      interiorSchedule = 'No interior cleaning included';
    } else {
      // If package doesn't match known names, prefer API values and generic schedule
      interiorSchedule = interiorPerMonth > 0 ? `${interiorPerMonth} per month` : 'No interior cleaning included';
    }

    return {
      exteriorPerMonth,
      exteriorPerWeek,
      interiorPerMonth,
      interiorSchedule
    };
  };

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
            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">Loading packages...</div>
              </div>
            )}

            {isError && (
              <div className="flex justify-center py-8">
                <div className="text-red-500">Failed to load packages</div>
              </div>
            )}

            {!isLoading && !isError && filteredPackages.length === 0 && (
              <div className="flex justify-center py-8">
                <div className="text-gray-500">
                  {selectedCarType 
                    ? `No packages available for ${selectedCarType} cars` 
                    : 'No packages available'
                  }
                </div>
              </div>
            )}

            {!isLoading && !isError && filteredPackages.length > 0 && (
              <div className="space-y-3">
                {filteredPackages.map((pkg) => {
                  const specs = getPackageSpecs(pkg);
                  return (
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
                          {pkg.carType?.charAt(0).toUpperCase() + pkg.carType?.slice(1)} Car
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
                        <span className="text-gray-600">Weekly Exterior Washes:</span>
                        <span className="ml-1 font-medium">{specs.exteriorPerWeek}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Exterior Washes:</span>
                        <span className="ml-1 font-medium">{specs.exteriorPerMonth}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Interior Cleans / month:</span>
                        <span className="ml-1 font-medium">{specs.interiorPerMonth}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Interior Schedule:</span>
                        <span className="ml-1 font-medium">{specs.interiorSchedule}</span>
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
                  )
                })}
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