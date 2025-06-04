import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { fetchRoles, deleteRole } from "../../apis/roleApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import RolesDrawer from "./RolesDrawer";

type RoleRow = {
  id: string;
  code: string;
  name: string;
};

export const Roles = () => {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedRoles,
  } = usePagination(roles, rowsPerPage);


  // Utility to convert roles array to CSV string
  const convertRolesToCSV = (roles: RoleRow[]) => {
    const header = ["ID", "Code", "Name"];
    const rows = roles.map(role => [role.id, role.code, role.name]);

    const csvContent =
      [header, ...rows]
        .map(row =>
          row
            .map(item => `"${item.replace(/"/g, '""')}"`) // escape quotes
            .join(",")
        )
        .join("\n") + "\n";

    return csvContent;
  };

  // Export handler function
  const handleExport = () => {
    if (roles.length === 0) {
      toast.info("No roles to export");
      return;
    }

    const csv = convertRolesToCSV(roles);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "roles_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    toast.success("Roles exported successfully!");
  };


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
    const handleClickOutside = () => setMoreDropdownOpen(false);
    if (moreDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [moreDropdownOpen]);

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

  // Sort handlers
  const handleSortByName = () => {
    setRoles((prev) => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
    toast.info("Sorted by Name");
  };

  const handleSortByCode = () => {
    setRoles((prev) => [...prev].sort((a, b) => a.code.localeCompare(b.code)));
    toast.info("Sorted by Code");
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Roles" />
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="min-h-screen h-full w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-end items-center mb-4 gap-3 px-6 pt-6">
          <button
            onClick={() => navigate("/roles/create")}
            className="flex items-center justify-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <span>
              <FaPlus />
            </span>
            <span className="">New</span>
          </button>
          <span
            className="p-2 bg-gray-200 border-2 border-gray-50 rounded-lg cursor-pointer relative"
            onClick={(e) => {
              e.stopPropagation();
              setMoreDropdownOpen((prev) => !prev);
            }}
          >
            <IoIosMore />
            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-30 py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {

                    setMoreDropdownOpen(false);
                    handleExport();
                  }}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    fetchAndSetRoles();
                  }}
                >
                  Refresh
                </button>
                <div
                  className="relative"
                  onMouseEnter={() => setSortMenuOpen(true)}
                  onMouseLeave={() => setSortMenuOpen(false)}
                >
                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition flex justify-between items-center"
                    onClick={() => setSortMenuOpen((prev) => !prev)}
                  >
                    Sort
                    <span className="ml-2">&gt;</span>
                  </button>
                  {sortMenuOpen && (
                    <div className="absolute right-full top-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-40 py-1">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          handleSortByName();
                        }}
                      >
                        Sort by Name
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          handleSortByCode();
                        }}
                      >
                        Sort by Code
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </span>
        </div>
        <div className="overflow-x-auto flex-1 w-full overflow-auto px-6 pb-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-blue-600 font-semibold text-lg">
                Loading...
              </span>
            </div>
          ) : (
            <table className="w-full min-w-[700px] text-base bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Role Name</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedRoles &&
                  paginatedRoles.map((role) => (
                    <tr
                      key={role.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => setSelectedRole(role)}
                      onMouseEnter={() => setHoveredRow(role.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-4 py-3">{role.code}</td>
                      <td className="px-4 py-3">{role.name}</td>
                      <td className="flex justify-center gap-2 relative">
                        {hoveredRow === role.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(
                                dropdownOpen === role.id ? null : role.id
                              );
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full transition"
                            title="Actions"
                          >
                            <FaCircleChevronDown
                              className="text-blue-500"
                              size={20}
                            />
                          </button>
                        )}
                        {dropdownOpen === role.id && (
                          <div
                            className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                navigate(`/roles/edit/${role.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
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
        <div className="px-6 pb-6 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </div>
      </div>
      <RolesDrawer
        isOpen={!!selectedRole}
        onClose={() => setSelectedRole(null)}
        role={selectedRole}
      />
    </>
  );
};
