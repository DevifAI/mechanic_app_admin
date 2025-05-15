import { useState } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ShiftFormModal from "../../modals/ShiftFormModal";

const dummyShifts = [
  {
    id: 1,
    shiftCode: "S1",
    fromTime: "08:00 AM",
    toTime: "04:00 PM",
    assignedEmployees: 5,
  },
  {
    id: 2,
    shiftCode: "S2",
    fromTime: "04:00 PM",
    toTime: "12:00 AM",
    assignedEmployees: 3,
  },
  {
    id: 3,
    shiftCode: "S3",
    fromTime: "12:00 AM",
    toTime: "08:00 AM",
    assignedEmployees: 4,
  },
];

export const Shifts = () => {
  const [shifts, setShifts] = useState(dummyShifts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<any>(null);

  const handleView = (item: any) => {
    console.log("Viewing:", item);
  };

  const handleEdit = (item: any) => {
    setEditingShift(item);
    setIsFormOpen(true);
  };

  const handleDelete = (item: any) => {
    setShifts((prev) => prev.filter((s) => s.id !== item.id));
  };

  const handleAdd = () => {
    setEditingShift(null); // Reset form
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingShift) {
      // Edit existing
      setShifts((prev) =>
        prev.map((s) => (s.id === editingShift.id ? { ...s, ...formData } : s))
      );
    } else {
      // Add new
      const newShift = {
        id: Date.now(), // unique ID
        assignedEmployees: 0,
        ...formData,
      };
      setShifts((prev) => [...prev, newShift]);
    }
    setIsFormOpen(false); // Close modal after submit
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Shifts" />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Shift
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-base bg-white dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Shift Code</th>
                <th className="px-4 py-3">From Time</th>
                <th className="px-4 py-3">To Time</th>
                <th className="px-4 py-3">Assigned Employees</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
              {shifts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">{item.shiftCode}</td>
                  <td className="px-4 py-3">{item.fromTime}</td>
                  <td className="px-4 py-3">{item.toTime}</td>
                  <td className="px-4 py-3">{item.assignedEmployees}</td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    {/* <button
                      onClick={() => handleView(item)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEye size={18} />
                    </button> */}
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

      <ShiftFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingShift={editingShift}
      />
    </>
  );
};
