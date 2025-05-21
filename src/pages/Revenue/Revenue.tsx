import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { deleteRevenue, fetchRevenues } from "../../apis/revenueApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";

type RevenueRow = {
  id: string;
  revenue_code: string;
  revenue_description: string;
  revenue_value: number;
  linkedProjects: number;
};

export const Revenue = () => {
  const [revenues, setRevenues] = useState<RevenueRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedRevenues,
  } = usePagination(revenues, rowsPerPage);



  const fetchAndSetRevenues = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenues();
      setRevenues(
        data.map((item: any) => ({
          id: item.id,
          revenue_code: item.revenue_code,
          revenue_description: item.revenue_description,
          revenue_value: item.revenue_value,
          linkedProjects: item.linkedProjects || 0,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch revenues", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetRevenues();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleDelete = async (revenue: RevenueRow) => {
    if (window.confirm("Are you sure you want to delete this revenue?")) {
      setLoading(true);
      try {
        await deleteRevenue(revenue.id);
        await fetchAndSetRevenues();
        toast.success("Revenue deleted successfully!");
      } catch (err) {
        console.error("Failed to delete revenue", err);
        toast.error("Failed to delete revenue!");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Revenue" />
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4">
          {/* <button
            onClick={() => navigate("/revenues/create")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            + Add Revenue
          </button> */}
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
                {paginatedRevenues &&
                  paginatedRevenues.map((revenue) => (
                    <tr
                      key={revenue.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-4 py-3">{revenue.revenue_code}</td>
                      <td className="px-4 py-3">{revenue.revenue_description}</td>
                      <td className="px-4 py-3">₹{revenue.revenue_value}</td>
                      <td className="px-4 py-3">{revenue.linkedProjects}</td>
                      <td className="px-4 py-3 flex justify-center gap-2 relative">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setDropdownOpen(dropdownOpen === revenue.id ? null : revenue.id);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          title="Actions"
                        >
                          <span style={{ fontSize: 20, lineHeight: 1 }}>⋮</span>
                        </button>
                        {dropdownOpen === revenue.id && (
                          <div
                            className="absolute z-20 right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                navigate(`/revenues/edit/${revenue.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                handleDelete(revenue);
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
    </>
  );
};