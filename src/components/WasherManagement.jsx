import { useEffect, useState } from "react";
import axios from "axios";
import AddWasherModal from "./AddWasherModal";
import Sidebar from "./Sidebar";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function WasherManagement() {
  const [washers, setWashers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // default 10 per page

  // Modal states
  const [editingWasher, setEditingWasher] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [isAddWasherModalOpen, setIsAddWasherModalOpen] = useState(false);

  // ✅ Fetch paginated washers from backend
  const fetchWashers = async (page = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/washers/getAllWasher?page=${page}&limit=${pageLimit}`
      );
      setWashers(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to fetch washers. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Fetch whenever page or limit changes
  useEffect(() => {
    fetchWashers(currentPage, limit);
  }, [currentPage, limit]);

  const handleWasherAdded = () => {
    setIsAddWasherModalOpen(false);
    fetchWashers(currentPage, limit);
  };

  // Pagination logic
  const getPageNumbers = () => {
    const maxPagesToShow = 8;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  // Delete washer
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this washer?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      fetchWashers(currentPage, limit);
    } catch {
      alert("Delete failed");
    }
  };

  // Edit washer
  const openEdit = (washer) => setEditingWasher({ ...washer });

  const saveEdit = async () => {
    if (!editingWasher) return;
    setSavingEdit(true);
    try {
      const id = editingWasher._id || editingWasher.id;
      await axios.put(`${API_BASE_URL}/${id}`, editingWasher);
      setEditingWasher(null);
      fetchWashers(currentPage, limit);
    } catch {
      alert("Update failed");
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6">Error: {error}</div>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">Washing Person Management</h1>

        {/* Add Washer Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAddWasherModalOpen(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Add New Washer
          </button>
        </div>

        {/* Washer Table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Mobile</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {washers.map((washer) => (
                <tr key={washer._id} className="text-center">
                  <td className="border px-4 py-2">{washer.name}</td>
                  <td className="border px-4 py-2">{washer.mobileNo}</td>
                  <td className="border px-4 py-2">{washer.email}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        washer.status?.toLowerCase() === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {washer.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => openEdit(washer)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(washer._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 bg-white p-3 rounded shadow-sm">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2 mb-3 sm:mb-0">
            <label className="text-gray-700 font-medium">Rows per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                setLimit(newLimit);
                setCurrentPage(1); // reset to page 1
              }}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page numbers and navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded border transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Washer Modal */}
      <AddWasherModal
        isOpen={isAddWasherModalOpen}
        onClose={() => setIsAddWasherModalOpen(false)}
        onWasherAdded={handleWasherAdded}
      />
    </div>
  );
}

export default WasherManagement;
