import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PartnerViewModal from "../../modals/PartnerViewModal";
import PartnerFormModal from "../../modals/PartnerFormModal"; // 👈 Add this import
import { deleteCustomer, fetchCustomers } from "../../apis/customerApi";

export const Partners = () => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // <-- Add loading state

  useEffect(() => {
    const fetchAndSetPartners = async () => {
      setLoading(true); // Start loading
      try {
        const data = await fetchCustomers();
        setPartners(
          data.map((item) => ({
            id: item.id,
            partner_name: item.partner_name,
            partner_address: item.partner_address,
            partner_gst: item.partner_gst,
            partner_geo_id: item.partner_geo_id,
            isCustomer: item.isCustomer,
            isActive: true, // or item.isActive if available
          }))
        );
      } catch (err) {
        console.error("Failed to fetch partners", err);
      }
      setLoading(false); // End loading
    };
    fetchAndSetPartners();
  }, []);

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

  const handleFormSubmit = async () => {
    setIsFormOpen(false);
    setEditingPartner(null);
    setLoading(true);
    try {
      // After add/edit, refresh the list from backend
      const data = await fetchCustomers();
      setPartners(
        data.map((item) => ({
          id: item.id,
          partner_name: item.partner_name,
          partner_address: item.partner_address,
          partner_gst: item.partner_gst,
          partner_geo_id: item.partner_geo_id,
          isCustomer: item.isCustomer,
          isActive: true, // or item.isActive if available
        }))
      );
    } catch (err) {
      console.error("Failed to fetch partners", err);
    }
    setLoading(false);
  };

  const handleDelete = async (partner: any) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      setLoading(true);
      try {
        await deleteCustomer(partner.id);
        // Refresh the list after deletion
        const data = await fetchCustomers();
        setPartners(
          data.map((item) => ({
            id: item.id,
            partner_name: item.partner_name,
            partner_address: item.partner_address,
            partner_gst: item.partner_gst,
            partner_geo_id: item.partner_geo_id,
            isCustomer: item.isCustomer,
            isActive: true, // or item.isActive if available
          }))
        );
      } catch (err) {
        console.error("Failed to delete partner", err);
      }
      setLoading(false);
    }
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
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">GST</th>
                  <th className="px-4 py-3">Geo ID</th>
                  <th className="px-4 py-3">Is Customer</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
                {partners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                  >
                    <td className="px-4 py-3">{partner.partner_name}</td>
                    <td className="px-4 py-3">{partner.partner_address}</td>
                    <td className="px-4 py-3">{partner.partner_gst}</td>
                    <td className="px-4 py-3">{partner.partner_geo_id}</td>
                    <td className="px-4 py-3">
                      {partner.isCustomer ? "Yes" : "No"}
                    </td>

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
          )}
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
