import { FaEye, FaEdit, FaTrash, FaPlus, FaDownload } from "react-icons/fa";
import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EquipmentViewModal from "../../modals/EquipmentViewModal";
import EquipmentFormModal from "../../modals/EquipmentFormModal";

const dummyEquipments = [
  {
    id: 1,
    name: "Excavator",
    serialNo: "EX12345",
    additionalId: "AD-001",
    purchaseDate: "2023-01-15",
    oem: "Caterpillar",
    purchaseCost: "₹25,00,000",
    group: "Heavy Machinery",
  },
  {
    id: 2,
    name: "Concrete Mixer",
    serialNo: "CM67890",
    additionalId: "AD-002",
    purchaseDate: "2022-10-05",
    oem: "Schwing Stetter",
    purchaseCost: "₹8,50,000",
    group: "Construction Equipment",
  },
];

export const Equipments = () => {
const [selectedEquipment, setSelectedEquipment] = useState<any | null>(null);
const [isViewModalOpen, setIsViewModalOpen] = useState(false);
const [isFormOpen, setIsFormOpen] = useState(false);
const equipmentGroups = ['Group 1', 'Group 2', 'Group 3'];

const handleView = (equipment: any) => {
  setSelectedEquipment(equipment);
  setIsViewModalOpen(true);
};

 const handleEdit = (equipment: any) => {
  setSelectedEquipment(equipment);
  setIsFormOpen(true);
};

  const handleDelete = (equipment: any) => {
    console.log("Deleting:", equipment);
    // Trigger delete confirmation or logic here
  };

 const handleAdd = () => {
  setSelectedEquipment(null);
  setIsFormOpen(true);
};


  const handleFormSubmit = (formData: any) => {
  // Handle form submission logic
  console.log(formData);
};

  return (
    <>
      <PageBreadcrumb pageTitle={"Equipments"} />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4 gap-2 ">
           <button

                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
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
              {dummyEquipments.map((equipment) => (
                <tr
                  key={equipment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                >
                  <td className="px-4 py-3">{equipment.name}</td>
                  <td className="px-4 py-3">{equipment.serialNo}</td>
                  <td className="px-4 py-3">{equipment.additionalId}</td>
                  <td className="px-4 py-3">{equipment.purchaseDate}</td>
                  <td className="px-4 py-3">{equipment.oem}</td>
                  <td className="px-4 py-3">{equipment.purchaseCost}</td>
                  <td className="px-4 py-3">{equipment.group}</td>
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
        </div>
      </div>

      <EquipmentViewModal
  isOpen={isViewModalOpen}
  onClose={() => setIsViewModalOpen(false)}
  equipment={selectedEquipment}
/>

<EquipmentFormModal
  isOpen={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSubmit={handleFormSubmit}
  equipment={selectedEquipment}
  equipmentGroups={equipmentGroups}
/>

    </>
  );
};
