import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ConsumableFormModal from "../../modals/ConsumableFormModal";
import ConsumableViewModal from "../../modals/ConsumableViewModal";
// import ConsumableFormModal from "../../modals/ConsumableFormModal"; // (optional if you implement it)

const dummyConsumables = [
  {
    id: 1,
    itemCode: "CON-001",
    name: "Cutting Disc",
    type: "Abrasive",
    make: "Bosch",
    uom: "PCS",
    qtyInHand: 150,
    accIn: 200,
    accOut: 50,
  },
  {
    id: 2,
    itemCode: "CON-002",
    name: "Welding Rod",
    type: "Welding",
    make: "Ador",
    uom: "KG",
    qtyInHand: 75,
    accIn: 100,
    accOut: 25,
  },
];

export const Consumable = () => {
  const [consumables, setConsumables] = useState(dummyConsumables);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [viewItem, setViewItem] = useState<any>(null);
const [isViewOpen, setIsViewOpen] = useState(false);

const handleView = (item: any) => {
  setViewItem(item);
  setIsViewOpen(true);
};

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: any) => {
    console.log("Deleting:", item);
    setConsumables((prev) => prev.filter((c) => c.id !== item.id));
  };

  const handleFormSubmit = (formData: any) => {
    if (editingItem) {
      setConsumables((prev) =>
        prev.map((c) => (c.id === editingItem.id ? { ...c, ...formData } : c))
      );
    } else {
      const newItem = {
        ...formData,
        id: consumables.length + 1,
        accIn: 0,
        accOut: 0,
        qtyInHand: formData.qtyInHand || 0,
      };
      setConsumables((prev) => [...prev, newItem]);
    }
    setIsFormOpen(false);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Consumable" />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4 gap-2">
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-base"
          >
            <FaPlus />
            Add Project
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Consumable
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-base bg-white dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Item Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Make</th>
                <th className="px-4 py-3">UOM</th>
                <th className="px-4 py-3">Qty in Hand</th>
                <th className="px-4 py-3">Acc. In</th>
                <th className="px-4 py-3">Acc. Out</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
              {consumables.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">{item.itemCode}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.make}</td>
                  <td className="px-4 py-3">{item.uom}</td>
                  <td className="px-4 py-3">{item.qtyInHand}</td>
                  <td className="px-4 py-3">{item.accIn}</td>
                  <td className="px-4 py-3">{item.accOut}</td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                     <button
                      onClick={() => handleView(item)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
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

<ConsumableViewModal
  isOpen={isViewOpen}
  onClose={() => setIsViewOpen(false)}
  item={viewItem}
/>

      {/* Add/Edit Modal (optional) */}
    <ConsumableFormModal
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSubmit={handleFormSubmit}
  item={editingItem}
  uomOptions={["PCS", "KG", "LTR"]} // Example UOM options
  accountOptions={["Account 1", "Account 2"]} // Example account options
/>
    </>
  );
};
