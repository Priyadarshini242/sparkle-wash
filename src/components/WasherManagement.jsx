import { useEffect, useState } from "react";
import axios from "axios";
import AddWasherModal from "./AddWasherModal";
import Sidebar from "./Sidebar";

const API_BASE_URL = 'http://localhost:5000/api/washers';

function WasherManagement() {
  const [washers, setWashers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // ✅ Show only 5 items per page

  // Modal states
  const [editingWasher, setEditingWasher] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [isAddWasherModalOpen, setIsAddWasherModalOpen] = useState(false);

  // ✅ Fetch paginated washers from backend
  const fetchWashers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/getAllWasher?page=${page}&limit=${limit}`);
      setWashers(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError('Failed to fetch washers. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWashers(currentPage);
  }, [currentPage]);

  const handleWasherAdded = () => {
    setIsAddWasherModalOpen(false);
    fetchWashers(currentPage);
  };

  // Pagination logic
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
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
      fetchWashers(currentPage);
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
      fetchWashers(currentPage);
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded border ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Edit Washer Modal */}
        {editingWasher && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 bg-black opacity-40"
              onClick={() => setEditingWasher(null)}
            />
            <div className="bg-white rounded p-6 z-10 w-11/12 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Washer</h3>
              <input
                value={editingWasher.name || ""}
                onChange={(e) =>
                  setEditingWasher({ ...editingWasher, name: e.target.value })
                }
                className="w-full border p-2 mb-2"
                placeholder="Name"
              />
              <input
                value={editingWasher.email || ""}
                onChange={(e) =>
                  setEditingWasher({ ...editingWasher, email: e.target.value })
                }
                className="w-full border p-2 mb-2"
                placeholder="Email"
              />
              <input
                value={editingWasher.mobileNo || ""}
                onChange={(e) =>
                  setEditingWasher({ ...editingWasher, mobileNo: e.target.value })
                }
                className="w-full border p-2 mb-2"
                placeholder="Mobile No"
              />
              <select
                value={editingWasher.status || "Active"}
                onChange={(e) =>
                  setEditingWasher({ ...editingWasher, status: e.target.value })
                }
                className="w-full border p-2 mb-4"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingWasher(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={savingEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddWasherModal
        isOpen={isAddWasherModalOpen}
        onClose={() => setIsAddWasherModalOpen(false)}
        onWasherAdded={handleWasherAdded}
      />
    </div>
  );
}

export default WasherManagement;
