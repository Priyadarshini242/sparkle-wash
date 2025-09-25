import React from 'react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ClockIcon,
  XMarkIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const ContextMenu = ({ 
  isVisible, 
  x, 
  y, 
  onClose, 
  onViewHistory, 
  onEdit, 
  onDelete,
  onAllocateWasher,
  customer 
}) => {
  if (!isVisible) return null;

  const handleViewHistory = () => {
    onViewHistory(customer);
    onClose();
  };

  const handleEdit = () => {
    onEdit(customer);
    onClose();
  };

  const handleDelete = () => {
    onDelete(customer);
    onClose();
  };

  const handleAllocateWasher = () => {
    onAllocateWasher(customer);
    onClose();
  };

  return (
    <>
      {/* Backdrop to close context menu */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Context Menu */}
      <div
        className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 min-w-48"
        style={{
          left: `${x}px`,
          top: `${y}px`,
        }}
      >
        {/* Header */}
        <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            {customer?.name}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <XMarkIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="py-1">
          <button
            onClick={handleViewHistory}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 w-full text-left transition-colors"
          >
            <ClockIcon className="h-4 w-4 mr-3" />
            View History
          </button>
          
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 w-full text-left transition-colors"
          >
            <PencilIcon className="h-4 w-4 mr-3" />
            Edit Customer
          </button>
          
          <button
            onClick={handleAllocateWasher}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 w-full text-left transition-colors"
          >
            <UserPlusIcon className="h-4 w-4 mr-3" />
            Allocate Washer
          </button>
          
          <hr className="my-1 border-gray-100" />
          
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 w-full text-left transition-colors"
          >
            <TrashIcon className="h-4 w-4 mr-3" />
            Delete Customer
          </button>
        </div>

        {/* Customer Details */}
        {customer && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-500 space-y-1">
              <div>📱 {customer.mobileNo}</div>
              <div>🏠 {customer.apartment} - {customer.doorNo}</div>
              <div>🚗 {customer.carModel}</div>
              {customer.packageName && (
                <div>📦 {customer.packageName}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContextMenu;