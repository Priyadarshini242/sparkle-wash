// src/components/Usermanagement.jsx

import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { BellIcon } from "@heroicons/react/24/outline";
import AddCustomerModal from "./AddCustomerModal";
import EditCustomerModal from "./EditCustomerModal";
import BulkOperationsModal from "./BulkOperationsModal";
import ContextMenu from "./ContextMenu";
import CustomerHistoryModal from "./CustomerHistoryModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import WasherAllocationModal from "./WasherAllocationModal";
import WasherManagement from "./WasherManagement";
import Sidebar from "./Sidebar";

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

function Usermanagement() {
  const [activeTab, setActiveTab] = useState("customers");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [packageFilter, setPackageFilter] = useState("");
  const [carModelFilter, setCarModelFilter] = useState("");
  const [apartmentFilter, setApartmentFilter] = useState("");
  const [carTypeFilter, setCarTypeFilter] = useState(""); // Add car type filter
  
  // Modal state
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    customer: null
  });
  
  // History modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Washer allocation modal state
  const [isWasherAllocationModalOpen, setIsWasherAllocationModalOpen] = useState(false);
  const [customerToAllocate, setCustomerToAllocate] = useState(null);
  
  // Bulk operations modal state
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Items per page

  // Get unique values from customers data
  const uniqueCarModels = [...new Set(customers
    .map(customer => customer.carModel)
    .filter(carModel => carModel && carModel.trim() !== "" && carModel !== "N/A")
  )].sort();

  const uniquePackages = [...new Set(customers
    .map(customer => customer.packageName) // Use packageName instead of packageId?.name
    .filter(packageName => packageName && packageName.trim() !== "" && packageName !== "N/A")
  )].sort();

  const uniqueApartments = [...new Set(customers
    .map(customer => customer.apartment)
    .filter(apartment => apartment && apartment.trim() !== "" && apartment !== "N/A")
  )].sort();

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/customer/getcustomers`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched customers:', data); // Debug log
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to fetch customers. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobileNo?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.vehicleNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.apartment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPackage = !packageFilter || customer.packageName === packageFilter; // Use packageName
    const matchesApartment = !apartmentFilter || customer.apartment === apartmentFilter;
    const matchesCarType = !carTypeFilter || customer.carType === carTypeFilter; // Add car type filter
    
    return matchesSearch && matchesPackage && matchesApartment && matchesCarType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, packageFilter, apartmentFilter, carTypeFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setPackageFilter("");
    setApartmentFilter("");
    setCarTypeFilter(""); // Clear car type filter
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Format price helper
  const formatPrice = (price) => {
    if (!price) return '₹0';
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Handle new customer added
  const handleCustomerAdded = (newCustomer) => {
    console.log('New customer added:', newCustomer);
    // Add the new customer to the existing list
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
    // Optionally refresh the entire list to get updated data
    fetchCustomers();
  };

  // Handle successful customer update
  const handleCustomerUpdated = (updatedCustomer) => {
    console.log('Customer updated:', updatedCustomer);
    // Update the customer in the existing list
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer._id === updatedCustomer._id ? updatedCustomer : customer
      )
    );
    setIsEditModalOpen(false);
    setCustomerToEdit(null);
  };

  // Context menu handlers
  const handleContextMenu = (event, customer) => {
    event.preventDefault();
    setContextMenu({
      isVisible: true,
      x: event.clientX,
      y: event.clientY,
      customer: customer
    });
  };

  const closeContextMenu = () => {
    setContextMenu({
      isVisible: false,
      x: 0,
      y: 0,
      customer: null
    });
  };

  const handleViewHistory = (customer) => {
    setSelectedCustomer(customer);
    setIsHistoryModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setCustomerToEdit(customer);
    setIsEditModalOpen(true);
  };

  const handleDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const handleAllocateWasher = (customer) => {
    setCustomerToAllocate(customer);
    setIsWasherAllocationModalOpen(true);
  };

  const handleWasherAllocated = (updatedCustomer) => {
    // Update the customer in the existing list
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer._id === updatedCustomer._id ? updatedCustomer : customer
      )
    );
    setIsWasherAllocationModalOpen(false);
    setCustomerToAllocate(null);
    console.log('Washer allocated successfully:', updatedCustomer);
  };

  const confirmDeleteCustomer = async (customerId) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${API_BASE_URL}/customer/deletecustomer/${customerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove customer from local state
        setCustomers(prevCustomers => 
          prevCustomers.filter(customer => customer._id !== customerId)
        );
        setIsDeleteModalOpen(false);
        setCustomerToDelete(null);
        console.log('Customer deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to delete customer:', errorData);
        alert('Failed to delete customer. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };
     return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/*Top Header */}
            <header className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">User Management</h1>
                <p className="text-gray-500 text-start text-sm">Friday, June 30, 2023</p>
              </div>
               {/* Notifications + Button */}
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative">
                  <BellIcon className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    3
                  </span>
                </div>

                {/* View Schedule Button */}
                <button className="bg-yellow-400 hover:bg-yellow-500 text-blue font-semibold px-5 py-2 rounded-lg shadow-md">
                  Export User
                </button>
              </div>
            </header>

          {/* Tabs */}
         <div className="border-b mb-6">
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab("customers")}
                className={`pb-2 ${
                  activeTab === "customers"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
            Customer Management
          </button>
          <button
            onClick={() => setActiveTab("washing")}
            className={`pb-2 ${
              activeTab === "washing"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Washing Person Management
          </button>
           </nav>
     </div>

        {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-blue-600">Loading customers...</span>
        </div>
      )}

      {/* Summary + Activity + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <UserSummary customers={customers} />
        <RecentActivity />
      </div>

      {/* Table section */}
      <div className="bg-white p-4 rounded shadow">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading customers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Search + Filters */}
        {!loading && (
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="w-full">
              <input
                type="text"
                placeholder="Search customers by name, phone, email, vehicle number, or apartment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
              <select 
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                className="border rounded px-3 py-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Packages</option>
                {uniquePackages.map(packageName => (
                  <option key={packageName} value={packageName}>
                    {packageName}
                  </option>
                ))}
              </select>

              <select 
                value={apartmentFilter}
                onChange={(e) => setApartmentFilter(e.target.value)}
                className="border rounded px-3 py-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Apartments</option>
                {uniqueApartments.map(apartment => (
                  <option key={apartment} value={apartment}>
                    {apartment}
                  </option>
                ))}
              </select>

              <select 
                value={carTypeFilter}
                onChange={(e) => setCarTypeFilter(e.target.value)}
                className="border rounded px-3 py-2 min-w-[140px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Car Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="premium">Premium</option>
              </select>
              
              <div className="flex gap-2">
                 <button 
                  onClick={clearFilters}
                  className="border border-gray-400 text-gray-600 rounded px-4 py-2 hover:bg-gray-100 transition-colors"
                  title="Clear all filters"
                >
                  Clear Filters
                </button>
                
                <button 
                  onClick={() => setIsBulkModalOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors flex items-center space-x-2"
                  title="Export template or bulk import customers"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Bulk Operations</span>
                </button>
                
                <button 
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  Add New Customer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {!loading && (searchTerm || packageFilter || apartmentFilter || carTypeFilter) && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                <strong>Active Filters:</strong>
                {searchTerm && <span className="ml-2 px-2 py-1 bg-blue-200 rounded text-xs">Search: "{searchTerm}"</span>}
                {packageFilter && <span className="ml-2 px-2 py-1 bg-blue-200 rounded text-xs">Package: {packageFilter}</span>}
                {apartmentFilter && <span className="ml-2 px-2 py-1 bg-blue-200 rounded text-xs">Apartment: {apartmentFilter}</span>}
                {carTypeFilter && <span className="ml-2 px-2 py-1 bg-blue-200 rounded text-xs">Type: {carTypeFilter}</span>}
                <span className="ml-2 text-blue-600">({filteredCustomers.length} results)</span>
              </div>
              <button 
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <CustomerTable 
            customers={currentCustomers} 
            formatDate={formatDate} 
            formatPrice={formatPrice}
            totalResults={filteredCustomers.length}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            goToPage={goToPage}
            goToNextPage={goToNextPage}
            goToPrevPage={goToPrevPage}
            onContextMenu={handleContextMenu}
          />
        )}
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onCustomerAdded={handleCustomerAdded}
      />

      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu.isVisible}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={closeContextMenu}
        onViewHistory={handleViewHistory}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onAllocateWasher={handleAllocateWasher}
        customer={contextMenu.customer}
      />

      {/* Customer History Modal */}
      <CustomerHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCustomerToEdit(null);
        }}
        onCustomerUpdated={handleCustomerUpdated}
        customer={customerToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCustomerToDelete(null);
        }}
        onConfirm={confirmDeleteCustomer}
        customer={customerToDelete}
        isLoading={isDeleting}
      />

      {/* Washer Allocation Modal */}
      <WasherAllocationModal
        isOpen={isWasherAllocationModalOpen}
        onClose={() => {
          setIsWasherAllocationModalOpen(false);
          setCustomerToAllocate(null);
        }}
        onWasherAllocated={handleWasherAllocated}
        customer={customerToAllocate}
      />

      {/* Bulk Operations Modal */}
      <BulkOperationsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
      />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Components --- */

const UserSummary = ({ customers = [] }) => {
  const activeUsers = customers.filter(c => c.status === 'active').length;
  const inactiveUsers = customers.filter(c => c.status === 'inactive').length;
  const totalUsers = customers.length;
  
  const activePercentage = totalUsers ? (activeUsers / totalUsers) * 100 : 0;
  const inactivePercentage = totalUsers ? (inactiveUsers / totalUsers) * 100 : 0;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-start font-semibold mb-4">User Summary</h3>
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm">
          <span>Active Users</span>
          <span>{activeUsers}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${activePercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-1 text-sm">
          <span>Inactive Users</span>
          <span>{inactiveUsers}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-gray-400 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${inactivePercentage}%` }}
          ></div>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-1 text-sm">
          <span>Total Users</span>
          <span>{totalUsers}</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: totalUsers ? "100%" : "0%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const activities = [
    { action: "User Created", user: "Alex Johnson", time: "10 minutes ago" },
    { action: "Status Changed", user: "Sarah Miller", time: "25 minutes ago" },
    { action: "User Updated", user: "David Wilson", time: "1 hour ago" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-start font-semibold mb-4">Recent Activity</h3>
      <ul className="divide-y divide-gray-200">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="text-start flex items-center justify-between py-3 text-sm"
          >
            <div>
              <p className="text-start font-medium text-gray-800">{activity.action}</p>
              <p className="text-gray-500">{activity.user}</p>
            </div>
            <span className="text-gray-600 text-xs">{activity.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CustomerTable = ({ 
  customers, 
  formatDate, 
  formatPrice, 
  totalResults, 
  currentPage, 
  totalPages, 
  itemsPerPage,
  goToPage,
  goToNextPage,
  goToPrevPage,
  onContextMenu
}) => {
  if (!customers || customers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No customers found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Table Container with proper scroll */}
      <div className="shadow-sm border border-gray-200 rounded-lg">
        <table className="w-full table-fixed border-collapse bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-32 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="w-28 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="w-40 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="w-32 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apartment</th>
              <th className="w-20 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Door No</th>
              <th className="w-24 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
              <th className="w-28 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Model</th>
              <th className="w-20 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car Type</th>
              <th className="w-32 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Washing Schedule</th>
              <th className="w-20 border-b border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="w-28 border-b border-gray-200 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle No</th>
              <th className="w-24 border-b border-gray-200 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="w-24 border-b border-gray-200 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="w-20 border-b border-gray-200 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
              <th className="w-20 border-b border-gray-200 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer, index) => (
              <tr 
                key={customer._id} 
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} cursor-pointer`}
                onContextMenu={(e) => onContextMenu && onContextMenu(e, customer)}
              >
                <td className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {customer.name?.charAt(0)?.toUpperCase() || 'N'}
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate" title={customer.name}>
                      {customer.name || 'N/A'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900">
                  {customer.mobileNo || 'N/A'}
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900 truncate" title={customer.email}>
                  {customer.email || 'N/A'}
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900 truncate" title={customer.apartment}>
                  {customer.apartment || 'N/A'}
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900">
                  {customer.doorNo || 'N/A'}
                </td>
                <td className="px-4 py-3 border-b border-gray-100">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    customer.packageName === 'Basic' ? 'bg-green-100 text-green-800' :
                    customer.packageName === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                    customer.packageName === 'Classic' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.packageName || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900 truncate" title={customer.carModel}>
                  {customer.carModel || 'N/A'}
                </td>
                <td className="px-4 py-3 border-b border-gray-100">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                    customer.carType === 'sedan' ? 'bg-blue-100 text-blue-800' :
                    customer.carType === 'suv' ? 'bg-green-100 text-green-800' :
                    customer.carType === 'premium' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.carType || 'N/A'}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm text-gray-900">
                  {(() => {
                    if (!customer?.washingSchedule) return 'N/A';
                    
                    const { scheduleType } = customer.washingSchedule;
                    const packageName = customer.packageName;
                    
                    if (scheduleType === 'schedule1') {
                      return packageName === 'Basic' ? 'Mon, Thu' : 'Mon, Wed, Fri';
                    } else if (scheduleType === 'schedule2') {
                      return packageName === 'Basic' ? 'Tue, Sat' : 'Tue, Thu, Sat';
                    } else {
                      return 'Custom';
                    }
                  })()}
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm font-semibold text-green-600">
                  {formatPrice(customer.price)}
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm text-center font-mono">
                  {customer.vehicleNo || 'N/A'}
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm text-center">
                  {formatDate(customer.subscriptionStart)}
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-sm text-center">
                  {formatDate(customer.subscriptionEnd)}
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    customer.pendingWashes > 0 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.pendingWashes || 0}
                  </span>
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    customer.completedWashes > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.completedWashes || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalResults)}</span> of{' '}
            <span className="font-medium">{totalResults}</span> results
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded text-sm border ${
              currentPage === 1 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            Previous
          </button>
          
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded text-sm border ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                {page}
              </button>
            )
          ))}
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded text-sm border ${
              currentPage === totalPages 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Usermanagement;
