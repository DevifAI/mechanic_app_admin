import { FaEye, FaEdit, FaTrash, FaPlus, FaDownload } from "react-icons/fa";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EquipmentViewModal from "../../modals/EquipmentViewModal";
import EquipmentFormModal from "../../modals/EquipmentFormModal";
import { fetchEquipments, deleteEquipment } from "../../apis/equipmentApi"; // <-- Import API
import { fetchEquipmentGroups } from "../../apis/equipmentGroupApi";
import Pagination from "../../utils/Pagination";
import { usePagination } from "../../hooks/usePagination";

export const Equipments = () => {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [equipmentGroups, setEquipmentGroups] = useState<any[]>([]);
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedEquipments,
    getPageNumbers,
  } = usePagination(equipments, 2);

  // Fetch all equipment groups
  const fetchAndSetEquipmentGroups = async () => {
    try {
      const data = await fetchEquipmentGroups();
      setEquipmentGroups(data);
    } catch (err) {
      console.error("Failed to fetch equipment groups", err);
    }
  };

  // Fetch all equipments
  const fetchAndSetEquipments = async () => {
    setLoading(true);
    try {
      const data = await fetchEquipments();
      setEquipments(data);
    } catch (err) {
      console.error("Failed to fetch equipments", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetEquipmentGroups();
    fetchAndSetEquipments();
  }, []);

  const handleView = (equipment: any) => {
    setSelectedEquipment(equipment);
    setIsViewModalOpen(true);
  };

  const handleEdit = (equipment: any) => {
    setSelectedEquipment(equipment);
    setIsFormOpen(true);
  };

  const handleDelete = async (equipment: any) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      setLoading(true);
      try {
        await deleteEquipment(equipment.id);
        await fetchAndSetEquipments();
      } catch (err) {
        console.error("Failed to delete equipment", err);
      }
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedEquipment(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async () => {
    await fetchAndSetEquipments();
    setIsFormOpen(false);
    setSelectedEquipment(null);
  };

  return (
    <>
      <PageBreadcrumb pageTitle={"Equipments"} />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4 gap-2 ">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            <FaDownload className="mr-2" />
            Export
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Equipment
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
                  <th className="px-4 py-3">Equipment Name</th>
                  <th className="px-4 py-3">Serial No</th>
                  <th className="px-4 py-3">Additional ID</th>
                  <th className="px-4 py-3">Purchase Date</th>
                  <th className="px-4 py-3">OEM</th>
                  <th className="px-4 py-3">Purchase Cost</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
                {paginatedEquipments &&
                  paginatedEquipments.map((equipment) => (
                    <tr
                      key={equipment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                    >
                      <td className="px-4 py-3">{equipment.equipment_name}</td>
                      <td className="px-4 py-3">{equipment.equipment_sr_no}</td>
                      <td className="px-4 py-3">{equipment.additional_id}</td>
                      <td className="px-4 py-3">{equipment.purchase_date}</td>
                      <td className="px-4 py-3">{equipment.oem}</td>
                      <td className="px-4 py-3">{equipment.purchase_cost}</td>
                      <td className="px-4 py-3">
                        {equipment.equipment_group_id}
                      </td>
                      <td className="px-4 py-3 flex justify-center gap-2">
                        <button
                          onClick={() => handleView(equipment)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(equipment)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(equipment)}
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

      <EquipmentViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        equipment={
          selectedEquipment
            ? {
                ...selectedEquipment,
                equipment_group_name:
                  equipmentGroups.find(
                    (g: any) => g.id === selectedEquipment.equipment_group_id
                  )?.equipment_group || "",
              }
            : null
        }
      />

      <EquipmentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        equipment={selectedEquipment}
        equipmentGroups={equipmentGroups.map((g: any) => ({
          value: g.id,
          label: g.equipment_group,
        }))}
      />
    </>
  );
};
