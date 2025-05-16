import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RevenueFormModal from "../../modals/RevenueFormModal";
import { deleteRevenue, fetchRevenues } from "../../apis/revenueApi";

type RevenueRow = {
  id: string;
  revenueCode: string;
  description: string;
  revenueValue: number;
  linkedProjects: number;
};

export const Revenue = () => {
  const [revenues, setRevenues] = useState<RevenueRow[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(false); // <-- Add loading state

  const fetchAndSetRevenues = async () => {
    setLoading(true); // Start loading
    try {
      const data = await fetchRevenues();
      setRevenues(
        data.map((item: any) => ({
          id: item.id,
          revenueCode: item.revenue_code,
          description: item.revenue_description,
          revenueValue: item.revenue_value,
          linkedProjects: item.linkedProjects || 0,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch revenues", err);
    }
    setLoading(false); // End loading
  };

  useEffect(() => {
    fetchAndSetRevenues();
  }, []);

  const handleAdd = () => {
    setEditingRevenue(null);
    setIsFormOpen(true);
  };

  const handleEdit = (revenue: any) => {
    setEditingRevenue(revenue);
    setIsFormOpen(true);
  };

  const handleDelete = async (revenue: RevenueRow) => {
    if (window.confirm("Are you sure you want to delete this revenue?")) {
      setLoading(true);
      try {
        await deleteRevenue(revenue.id);
        await fetchAndSetRevenues(); // Refresh the list after deletion
      } catch (err) {
        console.error("Failed to delete revenue", err);
      }
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (editingRevenue) {
      setLoading(true);
      console.log("Updating Revenue:", formData);
      setRevenues((prev) =>
        prev.map((r) =>
          r.id === editingRevenue.id ? { ...r, ...formData } : r
        )
      );
    } else {
      setLoading(true);
      console.log("Adding Revenue:", formData);
      const newRevenue = {
        ...formData,
        id: revenues.length + 1,
        linkedProjects: 0,
      };
      setRevenues((prev) => [...prev, newRevenue]);
    }
    await fetchAndSetRevenues();
    setIsFormOpen(false);
    setLoading(false);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Revenue" />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Revenue
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
                  <th className="px-4 py-3">Revenue Code</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Linked Projects</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {revenues.map((revenue) => (
                  <tr
                    key={revenue.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-3">{revenue.revenueCode}</td>
                    <td className="px-4 py-3">{revenue.description}</td>
                    <td className="px-4 py-3">₹{revenue.revenueValue}</td>
                    <td className="px-4 py-3">{revenue.linkedProjects}</td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      {/* Optional view button */}
                      {/* <button
                      onClick={() => console.log("View clicked")}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEye size={18} />
                    </button> */}
                      <button
                        onClick={() => handleEdit(revenue)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(revenue)}
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

      {/* Add/Edit Modal */}
      <RevenueFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        revenue={editingRevenue}
      />
    </>
  );
};
