import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import StoreFormModal from "../../modals/StoreFormModal";
import { createStore, fetchStores, updateStore } from "../../apis/storeApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";

export const StoreLocation = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedStores,
    getPageNumbers,
  } = usePagination(stores, 2);

  useEffect(() => {
    const fetchAndSetStores = async () => {
      setLoading(true);
      try {
        const data = await fetchStores();
        setStores(
          data.map((item) => ({
            id: item.id,
            storeCode: item.store_code,
            storeName: item.store_name || "-",
            location: item.store_location,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch stores", err);
      }
      setLoading(false);
    };
    fetchAndSetStores();
  }, []);

  const handleAdd = () => {
    setEditingStore(null);
    setIsFormOpen(true);
  };

  const handleEdit = (store: any) => {
    setEditingStore(store);
    setIsFormOpen(true);
  };

  const handleDelete = (store: any) => {
    console.log("Deleting:", store);
    setStores((prev) => prev.filter((s) => s.id !== store.id));
  };

  const handleFormSubmit = async (formData: any) => {
    setIsFormOpen(false);
    setEditingStore(null);
    setLoading(true);
    try {
      // Map form fields to backend payload
      const payload = {
        store_code: formData.storeCode,
        store_name: formData.storeName,
        store_location: formData.location,
      };
      if (editingStore && editingStore.id) {
        await updateStore(editingStore.id, payload);
      } else {
        await createStore(payload);
      }
      // Refresh the list
      const data = await fetchStores();
      setStores(
        data.map((item) => ({
          id: item.id,
          storeCode: item.store_code,
          storeName: item.store_name || "-",
          location: item.store_location,
        }))
      );
    } catch (err) {
      console.error("Failed to save store", err);
    }
    setLoading(false);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Store Location" />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Store
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-blue-600 font-semibold text-lg">
                Loading...
              </span>
            </div>
          ) : (
            <table className="min-w-full text-base bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3">Store Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedStores &&
                  paginatedStores.map((store) => (
                    <tr
                      key={store.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-4 py-3">{store.storeCode}</td>
                      <td className="px-4 py-3">{store.storeName || "-"}</td>
                      <td className="px-4 py-3">{store.location}</td>
                      <td className="px-4 py-3 flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(store)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(store)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          getPageNumbers={getPageNumbers}
          maxPages={4}
        />
      </div>

      {/* Add/Edit Modal */}
      <StoreFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        store={editingStore}
      />
    </>
  );
};
