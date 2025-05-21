import { FaDownload } from "react-icons/fa";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { handleExportEmployees } from "../../utils/helperFunctions/handleExportEmployees";
import EmployeeViewModal from "../../modals/EmployeeViewModal";
import { deleteEmployee, fetchEmployees } from "../../apis/employyeApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";

export const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [originalEmployees, setOriginalEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedEmployees,
  } = usePagination(employees, rowsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmployees();
        setOriginalEmployees(data);

        const simplified = data.map((e: any) => ({
          id: e.id || "N/A",
          emp_id: e.emp_id || "N/A",
          emp_name: e.emp_name || "N/A",
          bloodGroup: e.blood_group || "N/A",
          age: e.age || "N/A",
          address: e.address || "N/A",
          position: e.position || "N/A",
          shift: e.shiftcode || "N/A",
          role: e.role || "N/A",
          active: e.active !== undefined ? e.active : "N/A",
        }));

        setEmployees(simplified);
      } catch (err) {
        console.error("Error loading employees", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = (employee: any) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (employee: any) => {
    if (
      !window.confirm(`Are you sure you want to delete ${employee.emp_name}?`)
    ) {
      return;
    }
    setDeletingId(employee.id); // set loading for this row
    try {
      await deleteEmployee(employee.id);
      const data = await fetchEmployees();
      setOriginalEmployees(data);

      const simplified = data.map((e: any) => ({
        id: e.id || "N/A",
        emp_id: e.emp_id || "N/A",
        emp_name: e.emp_name || "N/A",
        bloodGroup: e.blood_group || "N/A",
        age: e.age || "N/A",
        address: e.address || "N/A",
        position: e.position || "N/A",
        shift: e.shiftcode || "N/A",
        role: e.role || "N/A",
        active: e.active !== undefined ? e.active : "N/A",
      }));

      setEmployees(simplified);
      toast.success("Employee deleted successfully!");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`Failed: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed: ${error.message}`);
      } else {
        toast.error("Failed to delete employee.");
      }
    } finally {
      setDeletingId(null); // reset loading
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <PageBreadcrumb pageTitle="Employees" />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => handleExportEmployees(originalEmployees)}
            className="flex items-center px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:border-black transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
          >
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">
              Loading employees...
            </div>
          ) : (
            <table className="min-w-full text-base bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3">Emp ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">Blood Group</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Shift</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
                {paginatedEmployees &&
                  paginatedEmployees.map((employee, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center group cursor-pointer"
                      onClick={() => handleView(employee)}
                    >
                      <td className="px-4 py-2">{employee.emp_id}</td>
                      <td className="px-4 py-2">{employee.emp_name}</td>
                      <td className="px-4 py-2">{employee.age}</td>
                      <td className="px-4 py-2">{employee.bloodGroup}</td>
                      <td className="px-4 py-2">{employee.position}</td>
                      <td className="px-4 py-2">{employee.shift}</td>
                      <td className="px-4 py-2">{employee.role}</td>
                      <td className="px-4 py-2">
                        {employee.active ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(employee);
                          }}
                          className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete"
                          disabled={deletingId === employee.id}
                        >
                          {deletingId === employee.id ? (
                            <svg
                              className="animate-spin h-5 w-5 text-red-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              />
                            </svg>
                          ) : (
                            // ...your trash icon svg...
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          )}
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
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      <EmployeeViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={selectedEmployee}
      />
    </>
  );
};
