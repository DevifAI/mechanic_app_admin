import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { fetchRoles, deleteRole } from "../../apis/roleApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";

type RoleRow = {
  id: string;
  code: string;
  name: string;
};

export const Roles = () => {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedRoles,
  } = usePagination(roles, rowsPerPage);

  const fetchAndSetRoles = async () => {
    setLoading(true);
    try {
      const data = await fetchRoles();
      setRoles(
        data.map((item: any) => ({
          id: item.id,
          code: item.code,
          name: item.name,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetRoles();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleDelete = async (role: RoleRow) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setLoading(true);
      try {
        await deleteRole(role.id);
        await fetchAndSetRoles();
        toast.success("Role deleted successfully!");
      } catch (err) {
        console.error("Failed to delete role", err);
        toast.error("Failed to delete role!");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Roles" />
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        {/* <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => navigate("/roles/create")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            + Add Role
          </button>
        </div> */}

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
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Role Name</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedRoles &&
                  paginatedRoles.map((role) => (
                    <tr
                      key={role.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-4 py-3">{role.code}</td>
                      <td className="px-4 py-3">{role.name}</td>
                      <td className="px-4 py-3 flex justify-center gap-2 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === role.id ? null : role.id
                            );
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          title="Actions"
                        >
                          <span style={{ fontSize: 20, lineHeight: 1 }}>⋮</span>
                        </button>
                        {dropdownOpen === role.id && (
                          <div
                            className="absolute z-20 right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                navigate(`/roles/edit/${role.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                handleDelete(role);
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
