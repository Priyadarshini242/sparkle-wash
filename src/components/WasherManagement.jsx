import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

const API_BASE_URL = 'http://localhost:5000/api';

function WasherManagement() {
  const [washers, setWashers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit modal state
  const [editingWasher, setEditingWasher] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Dashboard modal
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashLoading, setDashLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch washers from backend
  const fetchWashers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/Washer/washer`);
      setWashers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch washers. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWashers();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(washers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWashers = washers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    goToPage(currentPage - 1);
  };

  // Delete washer
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this washer?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/washer/${id}`);
      setWashers((prev) => prev.filter((w) => (w._id || w.id) !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Open edit
  const openEdit = (washer) => {
    setEditingWasher({ ...washer });
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingWasher) return;
    setSavingEdit(true);
    try {
      const id = editingWasher._id || editingWasher.id;
      const res = await axios.put(`${API_BASE_URL}/washer/${id}`, {
        name: editingWasher.name,
        email: editingWasher.email,
        mobileNo: editingWasher.mobileNo,
        status: editingWasher.status
      });
      setWashers((prev) => prev.map((w) => ((w._id || w.id) === id ? res.data : w)));
      setEditingWasher(null);
    } catch (err) {
      alert("Update failed");
    } finally {
      setSavingEdit(false);
    }
  };

  // View washer dashboard
  const viewDashboard = async (washer) => {
    const id = washer._id || washer.id;
    setDashLoading(true);
    setDashboardOpen(true);
    setDashboardData(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/washer/${id}/dashboard?date=today`);
      setDashboardData(res.data);
    } catch (err) {
      setDashboardData({ error: "Failed to fetch dashboard" });
    } finally {
      setDashLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Washing Person Management</h1>

        {/* SUMMARY + ACTIVITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="rounded-lg p-4 shadow bg-white">
            <h2 className="text-lg font-semibold mb-4">Washer Summary</h2>
            <p className="text-sm mb-2">Total washers: {washers.length}</p>
            <p className="text-sm">Active: {washers.filter(w => (w.status || "").toLowerCase() === "active").length}</p>
            <p className="text-sm">Inactive: {washers.filter(w => (w.status || "").toLowerCase() === "inactive").length}</p>
          </div>

          <div className="rounded-lg p-4 shadow bg-white">
            <h2 className="text-lg font-semibold mb-4">Washer Recent Activity</h2>
            <ul>
              {activities.length === 0 && <li className="text-sm text-gray-500">No activity yet</li>}
              {activities.map(act => (
                <li key={act.id} className="mb-3">
                  <p className="font-medium">{act.type}</p>
                  <p className="text-sm text-gray-600">{act.user} • {act.time}</p>
                </li>
              ))}
            </ul>
          </div>
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

        {/* TABLE */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border-b border-gray-200 px-4 py-2">Name</th>
                <th className="border-b border-gray-200 px-4 py-2">Mobile No</th>
                <th className="border-b border-gray-200 px-4 py-2">Email</th>
                <th className="border-b border-gray-200 px-4 py-2">Status</th>
                <th className="border-b border-gray-200 px-4 py-2">Total Washes</th>
                <th className="border-b border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentWashers.map((washer, idx) => {
                const id = washer._id || washer.id || idx;
                return (
                  <tr key={id} className="text-center">
                    <td className="border-b border-gray-200 px-4 py-2">{washer.name}</td>
                    <td className="border-b border-gray-200 px-4 py-2">{washer.mobileNo || washer.mobile}</td>
                    <td className="border-b border-gray-200 px-4 py-2">{washer.email}</td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      <span className={`px-2 py-1 rounded text-white ${((washer.status || "").toLowerCase() === "active") ? "bg-green-500" : "bg-red-500"}`}>
                        {washer.status || "Unknown"}
                      </span>
                    </td>
                    <td className="border-b border-gray-200 px-4 py-2">{washer.totalWashes ?? washer.totalWashesCompleted ?? "-"}</td>
                    <td className="border-b border-gray-200 px-4 py-2">
                      <button onClick={() => openEdit(washer)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                      <button onClick={() => handleDelete(id)} className="bg-red-500 text-white px-3 py-1 rounded mr-2">Delete</button>
                      <button onClick={() => viewDashboard(washer)} className="bg-gray-700 text-white px-3 py-1 rounded">Dashboard</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg mt-4">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, washers.length)}</span> of{' '}
              <span className="font-medium">{washers.length}</span> results
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
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded text-sm border ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                {i + 1}
              </button>
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

        {/* Edit Modal */}
        {editingWasher && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setEditingWasher(null)} />
            <div className="bg-white rounded p-6 z-10 w-11/12 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Washer</h3>
              <label className="block text-sm">Name</label>
              <input value={editingWasher.name || ""} onChange={(e)=>setEditingWasher(s=>({...s, name: e.target.value}))} className="w-full border p-2 mb-2" />
              <label className="block text-sm">Email</label>
              <input value={editingWasher.email || ""} onChange={(e)=>setEditingWasher(s=>({...s, email: e.target.value}))} className="w-full border p-2 mb-2" />
              <label className="block text-sm">Mobile</label>
              <input value={editingWasher.mobileNo || editingWasher.mobile || ""} onChange={(e)=>setEditingWasher(s=>({...s, mobileNo: e.target.value}))} className="w-full border p-2 mb-2" />
              <label className="block text-sm">Status</label>
              <select value={editingWasher.status || "Active"} onChange={(e)=>setEditingWasher(s=>({...s, status: e.target.value}))} className="w-full border p-2 mb-4">
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="flex justify-end gap-2">
                <button onClick={()=>setEditingWasher(null)} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={saveEdit} disabled={savingEdit} className="px-4 py-2 bg-blue-600 text-white rounded">{savingEdit ? "Saving..." : "Save"}</button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard modal */}
        {dashboardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setDashboardOpen(false)} />
            <div className="bg-white rounded p-6 z-10 w-11/12 max-w-3xl max-h-[80vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Washer Dashboard</h3>
                <button className="px-3 py-1 border rounded" onClick={() => setDashboardOpen(false)}>Close</button>
              </div>
              {dashLoading && <div>Loading dashboard...</div>}
              {!dashLoading && dashboardData && dashboardData.error && <div className="text-red-600">{dashboardData.error}</div>}
              {!dashLoading && dashboardData && !dashboardData.error && (
                <>
                  <div className="mb-4">
                    <strong>Washer:</strong> {dashboardData.washer?.name} • <strong>Total customers:</strong> {dashboardData.totalCustomers}
                  </div>
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Apartment</th>
                        <th className="p-2 border">Package</th>
                        <th className="p-2 border">Completed</th>
                        <th className="p-2 border">Pending</th>
                        <th className="p-2 border">Washing Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.customers?.length === 0 && <tr><td colSpan="6" className="p-4 text-center">No customers for selected filter</td></tr>}
                      {dashboardData.customers?.map(c => (
                        <tr key={c._id || c.id}>
                          <td className="p-2 border">{c.name}</td>
                          <td className="p-2 border">{c.apartment} {c.doorNo ? `(${c.doorNo})` : ""}</td>
                          <td className="p-2 border">{c.packageName}</td>
                          <td className="p-2 border">{c.completedWashes}</td>
                          <td className="p-2 border">{c.pendingWashes}</td>
                          <td className="p-2 border">{(c.washingDayNames || []).join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WasherManagement;