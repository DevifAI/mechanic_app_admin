import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EquipmentViewModal from "../../modals/EquipmentViewModal";
import { fetchEquipments, deleteEquipment } from "../../apis/equipmentApi";
import { fetchEquipmentGroups } from "../../apis/equipmentGroupApi";
import Pagination from "../../utils/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { toast, ToastContainer } from "react-toastify";

export const Equipments = () => {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [equipmentGroups, setEquipmentGroups] = useState<any[]>([]);
  const navigate = useNavigate();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedEquipments,
    getPageNumbers,
  } = usePagination(equipments, 2);

  useEffect(() => {
    const fetchAndSetEquipmentGroups = async () => {
      try {
        const data = await fetchEquipmentGroups();
        setEquipmentGroups(data);
      } catch (err) {
        console.error("Failed to fetch equipment groups", err);
      }
    };

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

    fetchAndSetEquipmentGroups();
    fetchAndSetEquipments();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleView = (equipment: any) => {
    setSelectedEquipment(equipment);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (equipment: any) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      setLoading(true);
      try {
        await deleteEquipment(equipment.id);
        // Refresh the list after deletion
        const data = await fetchEquipments();
        setEquipments(data);
        toast.success("Equipment deleted successfully!");
      } catch (err) {
        console.error("Failed to delete equipment", err);
        toast.error("Failed to delete equipment!");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle={"Equipments"} />
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4 gap-2 ">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Export
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
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center cursor-pointer"
                      onClick={() => handleView(equipment)}
                    >
                      <td className="px-4 py-3">{equipment.equipment_name}</td>
                      <td className="px-4 py-3">{equipment.equipment_sr_no}</td>
                      <td className="px-4 py-3">{equipment.additional_id}</td>
                      <td className="px-4 py-3">{equipment.purchase_date}</td>
                      <td className="px-4 py-3">{equipment.oem}</td>
                      <td className="px-4 py-3">{equipment.purchase_cost}</td>
                      <td className="px-4 py-3">
                        {equipmentGroups.find(
                          (g: any) => g.id === equipment.equipment_group_id
                        )?.equipment_group || ""}
                      </td>
                      <td className="px-4 py-3 flex justify-center gap-2 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === equipment.id
                                ? null
                                : equipment.id
                            );
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          title="Actions"
                        >
                          <span style={{ fontSize: 20, lineHeight: 1 }}>⋮</span>
                        </button>
                        {dropdownOpen === equipment.id && (
                          <div
                            className="absolute z-20 right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                navigate(`/equipments/edit/${equipment.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                handleDelete(equipment);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
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
    </>
  );
};
