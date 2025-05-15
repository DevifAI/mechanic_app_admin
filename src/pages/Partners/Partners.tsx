import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PartnerViewModal from "../../modals/PartnerViewModal";
import PartnerFormModal from "../../modals/PartnerFormModal"; // 👈 Add this import

const dummyPartners = [
  {
    id: 1,
    name: "ABC Pvt Ltd",
    address: "123 Street, City",
    gst: "29ABCDE1234F2Z5",
    geoId: "GEO-001",
    isCustomer: true,
    linkedProjects: 5,
    isActive: true,
  },
  {
    id: 2,
    name: "XYZ Ltd",
    address: "456 Avenue, Town",
    gst: "27XYZDE4321G1Z9",
    geoId: "GEO-002",
    isCustomer: false,
    linkedProjects: 2,
    isActive: false,
  },
];

export const Partners = () => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);

  const handleView = (partner: any) => {
    setSelectedPartner(partner);
    setIsViewOpen(true);
  };

  const handleEdit = (partner: any) => {
    setEditingPartner(partner);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingPartner(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingPartner) {
      console.log("Updating Partner:", formData);
      // Update logic goes here
    } else {
      console.log("Adding Partner:", formData);
      // Add logic goes here
    }
    setIsFormOpen(false);
  };

  const handleDelete = (partner: any) => {
    console.log("Deleting:", partner);
    // Delete logic goes here
  };

  return (
    <>
      <PageBreadcrumb pageTitle={"Partners"} />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Partner
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-base bg-white dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">GST</th>
                <th className="px-4 py-3">Geo ID</th>
                <th className="px-4 py-3">Is Customer</th>
                <th className="px-4 py-3">Linked Projects</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
              {dummyPartners.map((partner) => (
                <tr
                  key={partner.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                >
                  <td className="px-4 py-3">{partner.name}</td>
                  <td className="px-4 py-3">{partner.address}</td>
                  <td className="px-4 py-3">{partner.gst}</td>
                  <td className="px-4 py-3">{partner.geoId}</td>
                  <td className="px-4 py-3">{partner.isCustomer ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">{partner.linkedProjects}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        partner.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {partner.isActive ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleView(partner)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(partner)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(partner)}
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

      {/* View Modal */}
      <PartnerViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        partner={selectedPartner}
      />

      {/* Add/Edit Modal */}
      <PartnerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        partner={editingPartner}
      />
    </>
  );
};
