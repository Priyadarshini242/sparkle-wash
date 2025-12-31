import { useEffect, useState } from "react";
import axios from "axios";
import AddWasherModal from "./AddWasherModal";
import WasherDeleteModal from "./WasherDeleteModal";
import Sidebar from "./Sidebar";
import WasherHistoryModal from './WasherHistoryModal';

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

  // Context menu (for right-click actions)
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, washer: null });
  const [isWasherHistoryOpen, setIsWasherHistoryOpen] = useState(false);
  const [selectedWasherForHistory, setSelectedWasherForHistory] = useState(null);

  // ✅ Fetch paginated washers from backend
  const fetchWashers = async (page = 1, pageLimit = limit) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/washer/getAllWasher?page=${page}&limit=${pageLimit}`
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
  // Delete washer (open confirmation modal)
  const [washerToDelete, setWasherToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageModal, setMessageModal] = useState({ open: false, text: '', type: 'success' });

  const handleDeleteClick = (washer) => {
    setWasherToDelete(washer);
    setIsDeleteModalOpen(true);
  };

  // Context menu actions
  const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0, washer: null });
  const handleViewHistory = () => {
    if (!contextMenu.washer) return closeContextMenu();
    setSelectedWasherForHistory(contextMenu.washer);
    setIsWasherHistoryOpen(true);
    closeContextMenu();
  };

  useEffect(() => {
    const onClick = () => closeContextMenu();
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const performDelete = async (id) => {
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/washer/${id}`);
      setIsDeleteModalOpen(false);
      setMessageModal({ open: true, text: 'Washer deleted successfully.', type: 'success' });
      fetchWashers(currentPage, limit);
    } catch (err) {
      console.error('Delete error:', err);
      setMessageModal({ open: true, text: 'Failed to delete washer. Try again.', type: 'error' });
    } finally {
      setIsDeleting(false);
      setWasherToDelete(null);
    }
  };

  // Edit washer
  const openEdit = (washer) => setEditingWasher({ ...washer });

  const saveEdit = async () => {
    if (!editingWasher) return;
    setSavingEdit(true);
    try {
      const id = editingWasher._id || editingWasher.id;
      await axios.put(`${API_BASE_URL}/washer/${id}`, editingWasher);
      setEditingWasher(null);
      fetchWashers(currentPage, limit);
    } catch (err) {
      console.error('Update error:', err);
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

        {/* Washer Table - styled like customer dashboard, scrollable */}
        <div className="shadow-sm border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="overflow-y-auto max-h-[60vh]">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr>
                  <th className="sticky top-0 z-10 border-b border-gray-200 px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Name</th>
                  <th className="sticky top-0 z-10 border-b border-gray-200 px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Mobile</th>
                  <th className="sticky top-0 z-10 border-b border-gray-200 px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Email</th>
                  <th className="sticky top-0 z-10 border-b border-gray-200 px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Status</th>
                  <th className="sticky top-0 z-10 border-b border-gray-200 px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gradient-to-r from-gray-50 to-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {washers.map((washer) => (
                  <tr key={washer._id} className="hover:bg-gray-50 transition-all duration-200 cursor-pointer group" onContextMenu={(e) => {
                    e.preventDefault();
                    // show custom context menu
                    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, washer });
                  }}>
                    <td className="px-4 py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md bg-gradient-to-r from-green-500 to-blue-600">
                          {washer.name?.charAt(0)?.toUpperCase() || 'W'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900" title={washer.name}>{washer.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">Washer</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 border-b border-gray-100">
                      <div className="text-sm text-gray-900 font-mono">{washer.mobileNo || 'N/A'}</div>
                    </td>

                    <td className="px-4 py-4 border-b border-gray-100">
                      <div className="text-sm text-gray-900 truncate max-w-xs" title={washer.email}>{washer.email || 'N/A'}</div>
                    </td>

                    <td className="px-4 py-4 border-b border-gray-100">
                      <span className={`px-2 py-1 rounded text-white ${washer.status?.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>{washer.status || 'N/A'}</span>
                    </td>

                    <td className="px-4 py-4 border-b border-gray-100 text-center">
                      <button
                        onClick={() => openEdit(washer)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 shadow-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 mr-2 group-hover:shadow-md transform group-hover:scale-105"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(washer)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 shadow-sm bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Washer History Modal */}
      <WasherHistoryModal
        isOpen={isWasherHistoryOpen}
        onClose={() => { setIsWasherHistoryOpen(false); setSelectedWasherForHistory(null); }}
        washer={selectedWasherForHistory}
      />

      {/* Context menu for right-click */}
      {contextMenu.visible && (
        <div className="fixed z-50 bg-white border rounded shadow-md py-1" style={{ left: contextMenu.x, top: contextMenu.y }}>
          <button onClick={handleViewHistory} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">View History</button>
          <hr className="border-t my-1" />
          <button onClick={() => { handleDeleteClick(contextMenu.washer); closeContextMenu(); }} className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left">Delete</button>
        </div>
      )}

      {/* Edit Washer Modal */}
      {editingWasher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4">
            <div className="flex flex-col">
              <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white flex justify-between items-center">
                <h2 className="text-2xl font-bold">Edit Washer</h2>
                <button onClick={() => setEditingWasher(null)} className="text-white text-2xl">×</button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit();
                }}
                className="p-6 space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    name="name"
                    value={editingWasher.name || ''}
                    onChange={(e) => setEditingWasher((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    name="mobileNo"
                    value={editingWasher.mobileNo || ''}
                    onChange={(e) => setEditingWasher((prev) => ({ ...prev, mobileNo: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    name="email"
                    value={editingWasher.email || ''}
                    onChange={(e) => setEditingWasher((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditingWasher(null)}
                    disabled={savingEdit}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-md hover:scale-105 transform transition"
                  >
                    {savingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <WasherDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => { if (!isDeleting) setIsDeleteModalOpen(false); }}
        onConfirm={performDelete}
        washer={washerToDelete}
        isLoading={isDeleting}
      />

      {/* Simple message modal for success/error */}
      {messageModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-lg p-6 ${messageModal.type === 'success' ? 'bg-white' : 'bg-white'} shadow-lg`}>
            <div className="flex flex-col items-center gap-4">
              <div className="text-lg font-semibold">{messageModal.type === 'success' ? 'Success' : 'Error'}</div>
              <div className="text-sm text-gray-700 text-center">{messageModal.text}</div>
              <div className="w-full flex justify-center">
                <button onClick={() => setMessageModal({ open: false, text: '', type: 'success' })} className="px-4 py-2 bg-blue-600 text-white rounded">OK</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WasherManagement;
