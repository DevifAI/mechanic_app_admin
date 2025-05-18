import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ShiftFormModal from "../../modals/ShiftFormModal";
import { createShift, fetchShifts, updateShift } from "../../apis/shiftApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";

export const Shifts = () => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<any>(null);
  const [loading, setLoading] = useState(false); // <-- Add loading state
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedShifts,
    getPageNumbers,
  } = usePagination(shifts, 2);

  useEffect(() => {
    const fetchAndSetShifts = async () => {
      setLoading(true); // Start loading
      try {
        const data = await fetchShifts();
        setShifts(
          data.map((item) => ({
            id: item.id,
            shiftCode: item.shift_code,
            fromTime: item.shift_from_time,
            toTime: item.shift_to_time,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch shifts", err);
      }
      setLoading(false); // End loading
    };
    fetchAndSetShifts();
  }, []);

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

  const handleFormSubmit = async (formData: any) => {
    setIsFormOpen(false);
    setEditingShift(null);
    setLoading(true);
    try {
      const payload = {
        shift_code: formData.shiftCode,
        shift_from_time: formData.fromTime,
        shift_to_time: formData.toTime,
      };
      if (editingShift && editingShift.id) {
        await updateShift(editingShift.id, payload);
      } else {
        await createShift(payload);
      }
      // Refresh the list from backend
      const data = await fetchShifts();
      setShifts(
        data.map((item) => ({
          id: item.id,
          shiftCode: item.shift_code,
          fromTime: item.shift_from_time,
          toTime: item.shift_to_time,
        }))
      );
    } catch (err) {
      console.error("Failed to save shift", err);
    }
    setLoading(false);
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
                  <th className="px-4 py-3">Shift Code</th>
                  <th className="px-4 py-3">From Time</th>
                  <th className="px-4 py-3">To Time</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedShifts &&
                  paginatedShifts.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-4 py-3">{item.shiftCode}</td>
                      <td className="px-4 py-3">{item.fromTime}</td>
                      <td className="px-4 py-3">{item.toTime}</td>
                      <td className="px-4 py-3 flex justify-center gap-2">
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

      <ShiftFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingShift={editingShift}
      />
    </>
  );
};
