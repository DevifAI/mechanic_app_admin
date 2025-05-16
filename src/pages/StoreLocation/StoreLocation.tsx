import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import StoreFormModal from "../../modals/StoreFormModal";

const dummyStores = [
  {
    id: 1,
    storeCode: "STR-001",
    storeName: "Main Store",
    location: "123 Industrial Area, Sector 4, Mumbai",
    linkedProjects: 2,
  },
  {
    id: 2,
    storeCode: "STR-002",
    storeName: "Spare Store",
    location: "Plot 56, Phase 2, Noida",
    linkedProjects: 1,
  },
];

export const StoreLocation = () => {
  const [stores, setStores] = useState(dummyStores);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);

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

  const handleFormSubmit = (formData: any) => {
    if (editingStore) {
      console.log("Updating Store:", formData);
      setStores((prev) =>
        prev.map((s) => (s.id === editingStore.id ? { ...s, ...formData } : s))
      );
    } else {
      console.log("Adding Store:", formData);
      const newStore = {
        ...formData,
        id: stores.length + 1,
        linkedProjects: 0,
      };
      setStores((prev) => [...prev, newStore]);
    }
    setIsFormOpen(false);
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
          <table className="min-w-full text-base bg-white dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Store Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Linked Projects</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
              {stores.map((store) => (
                <tr
                  key={store.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">{store.storeCode}</td>
                  <td className="px-4 py-3">{store.storeName || "-"}</td>
                  <td className="px-4 py-3">{store.location}</td>
                  <td className="px-4 py-3">{store.linkedProjects}</td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    {/* Optional view button */}
                    {/* <button
                      onClick={() => console.log("View clicked")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEye size={18} />
                    </button> */}
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
        </div>
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
