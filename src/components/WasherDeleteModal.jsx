import React from 'react';
import { XMarkIcon, ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';

const WasherDeleteModal = ({ isOpen, onClose, onConfirm, washer, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Confirm Delete</h2>
          </div>
          <button onClick={onClose} disabled={isLoading} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-3">Are you sure you want to delete this washer?</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm space-y-1">
              <div className="font-medium text-gray-900">{washer?.name}</div>
              <div className="text-gray-600">📱 {washer?.mobileNo}</div>
              <div className="text-gray-600">📧 {washer?.email}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50">Cancel</button>
          <button onClick={() => onConfirm(washer._id)} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="h-4 w-4" />
                Delete Washer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasherDeleteModal;
