import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PartnerViewModal from "../../modals/PartnerViewModal";
import { deleteCustomer, fetchCustomers } from "../../apis/customerApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";

export const Partners = () => {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedPartners,
  } = usePagination(partners, rowsPerPage);

  useEffect(() => {
    const fetchAndSetPartners = async () => {
      setLoading(true);
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
      setLoading(false);
    };
    fetchAndSetPartners();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);
  const handleView = (partner: any) => {
    setSelectedPartner(partner);
    setIsViewOpen(true);
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
            isActive: true,
          }))
        );
        toast.success("Partner deleted successfully!");
      } catch (err) {
        console.error("Failed to delete partner", err);
        toast.error("Failed to delete partner!");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle={"Partners"} />
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
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
                {paginatedPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center cursor-pointer"
                    onClick={() => handleView(partner)}
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
                    <td className="px-4 py-3 flex justify-center gap-2 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpen(
                            dropdownOpen === partner.id ? null : partner.id
                          );
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        title="Actions"
                      >
                        <span style={{ fontSize: 20, lineHeight: 1 }}>⋮</span>
                      </button>
                      {dropdownOpen === partner.id && (
                        <div
                          className="absolute z-20 right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              navigate(`/partners/edit/${partner.id}`);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            onClick={() => {
                              setDropdownOpen(null);
                              handleDelete(partner);
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
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      {/* View Modal */}
      <PartnerViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        partner={selectedPartner}
      />
    </>
  );
};
