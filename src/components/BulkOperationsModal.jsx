import React, { useState } from 'react';

const BulkOperationsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }

      setFile(selectedFile);
    }
  };

  // Export template
  const handleExportTemplate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/bulk/export-template`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customer_bulk_template.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Error downloading template');
      }
    } catch (error) {
      console.error('Error exporting template:', error);
      alert('Error downloading template');
    }
  };

  // Upload bulk data
  const handleBulkUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/customer/bulk/import`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResults(result.results);
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('bulk-file-input');
        if (fileInput) fileInput.value = '';
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Network error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setActiveTab('export');
    setFile(null);
    setUploadResults(null);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Bulk Customer Operations
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'export'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Export Template
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-6 py-3 font-medium text-sm ${
              activeTab === 'import'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Import Data
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Download Excel Template
                </h3>
                <p className="text-blue-700 mb-4">
                  Download the Excel template with sample data and instructions for bulk customer import.
                </p>
                <div className="space-y-2 text-sm text-blue-600">
                  <p>• The template includes sample data and field descriptions</p>
                  <p>• Separate sheets for packages and washers reference</p>
                  <p>• Instructions sheet with field requirements</p>
                  <p>• Vehicle numbers must be unique</p>
                </div>
              </div>

              <button
                onClick={handleExportTemplate}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Download Excel Template</span>
              </button>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-orange-900 mb-2">
                  Upload Customer Data
                </h3>
                <p className="text-orange-700 mb-4">
                  Upload your filled Excel file to import customer data in bulk.
                </p>
                <div className="space-y-2 text-sm text-orange-600">
                  <p>• Only .xlsx and .xls files are accepted</p>
                  <p>• Maximum file size: 5MB</p>
                  <p>• Duplicate vehicle numbers will be rejected</p>
                  <p>• Invalid data rows will be skipped with error details</p>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Excel File
                  </label>
                  <input
                    id="bulk-file-input"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {file && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                    </p>
                  )}
                </div>

                <button
                  onClick={handleBulkUpload}
                  disabled={!file || isUploading}
                  className={`w-full font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                    !file || isUploading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                        <path fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6v-4z" className="opacity-75"></path>
                      </svg>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span>Upload & Import Data</span>
                    </>
                  )}
                </button>
              </div>

              {/* Upload Results */}
              {uploadResults && (
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Import Results</h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{uploadResults.total}</div>
                        <div className="text-sm text-gray-600">Total Rows</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{uploadResults.successful}</div>
                        <div className="text-sm text-gray-600">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{uploadResults.failed}</div>
                        <div className="text-sm text-gray-600">Failed</div>
                      </div>
                    </div>

                    {uploadResults.errors.length > 0 && (
                      <div>
                        <h5 className="font-medium text-red-900 mb-2">Errors:</h5>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {uploadResults.errors.map((error, index) => (
                            <div key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                              Row {error.row} (Vehicle: {error.vehicleNo}): {error.error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {uploadResults.successful > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800">
                        ✅ {uploadResults.successful} customers imported successfully! 
                        Please refresh the customer list to see the new entries.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsModal;