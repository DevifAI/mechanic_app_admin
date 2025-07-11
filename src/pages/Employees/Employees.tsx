import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees, deleteEmployee } from "../../apis/employyeApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import EmployeeDrawer from "./EmployeeDrawer";
import { handleExportEmployees } from "../../utils/helperFunctions/handleExportEmployees";
import Title from "../../components/common/Title";

type EmployeeRow = {
  id: string;
  emp_id: string;
  emp_name: string;
  aadhar_number?: string;
  app_access_role: string;
  bloodGroup: string;
  age: number | string;
  address: string;
  shift: string;
  role: string;
  active: boolean | string;
  state: string;
  city: string;
  pincode: string;
  dob?: string; // ISO date string
  bank_name?: string;
  ifsc_code?: string;
  acc_no: string;
  acc_holder_name: string;
  position?: string;
};


export const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const navigate = useNavigate();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedEmployees,
  } = usePagination(filteredEmployees, rowsPerPage);


  console.log({ employees })

  const fetchAndSetEmployees = async () => {
    setLoading(true);
    try {
      const data = await fetchEmployees();

      const roleMap: Record<string, string> = {
        mechanic: "Mechanic",
        mechanicIncharge: "Mechanic Incharge",
        siteIncharge: "Site Incharge",
        storeManager: "Store Manager",
        accountManager: "Account Manager",
        projectManager: "Project Manager",

        // Add other mappings if needed
      };

      const simplified = data.map((e: any) => ({
        id: e.id || "N/A",
        emp_id: e.emp_id || "N/A",
        emp_name: e.emp_name || "N/A",
        bloodGroup: e.bloodGroup || e.blood_group || "N/A",
        age: e.age || "N/A",
        address: e.address || "N/A",
        position: e.position || "N/A",
        shift: e.shift || e.shiftcode || "N/A",
        role: e.role || "N/A",
        app_access_role: roleMap[e.app_access_role] || "N/A",
        active: e.active !== undefined ? e.active : "N/A",
        state: e.state || "N/A",
        city: e.city || "N/A",
        pincode: e.pincode || "N/A",
        bank_name: e.bank_name || "N/A",
        ifsc_code: e.ifsc_code || "N/A",
        acc_no: e.acc_no || "N/A",
        acc_holder_name: e.acc_holder_name || "N/A",
        aadhar_number: e.aadhar_number || "N/A",
        dob: e.dob || "N/A",
      }));

      setEmployees(simplified);
      setFilteredEmployees(simplified as any);
    } catch (err) {
      console.error("Error loading employees", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAndSetEmployees();
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

  // 👇 Search filtering effect
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter((e) =>
        e.emp_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const handleDelete = async (employee: EmployeeRow) => {
    if (!window.confirm(`Are you sure you want to delete ${employee.emp_name}?`)) {
      return;
    }
    setLoading(true);
    try {
      await deleteEmployee(employee.id);
      await fetchAndSetEmployees();
      toast.success("Employee deleted successfully!");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Failed: ${error.response.data.message}`);
      } else if (error.message) {
        toast.error(`Failed: ${error.message}`);
      } else {
        toast.error("Failed to delete employee.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSortByName = () => {
    setEmployees((prev) => [...prev].sort((a, b) => a.emp_name.localeCompare(b.emp_name)));
    toast.info("Sorted by Name");
  };

  const handleSortByEmpId = () => {
    setEmployees((prev) => [...prev].sort((a, b) => a.emp_id.localeCompare(b.emp_id)));
    toast.info("Sorted by Emp ID");
  };

  const handleExport = () => {
    handleExportEmployees(employees);
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="min-h-screen h-full w-full dark:bg-gray-900 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 gap-4 mb-4">
          <Title pageTitle="Employees" />
          <div className="flex flex-wrap justify-end items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by employee name..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => navigate("/employees/create")}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              <FaPlus />
              <span>New</span>
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
                      toast.info("Export Downloaded");
                      handleExport();
                    }}
                  >
                    Export
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                    onClick={() => {
                      setMoreDropdownOpen(false);
                      fetchAndSetEmployees();
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
                      Sort <span className="ml-2">&gt;</span>
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
                            handleSortByEmpId();
                          }}
                        >
                          Sort by Emp ID
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </span>
          </div>
        </div>




        <div className="overflow-x-auto flex-1 w-full overflow-auto pb-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-blue-600 font-semibold text-lg">Loading...</span>
            </div>
          ) : (
            <table className="w-full min-w-[1100px] text-base bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3 text-[12px] text-left">Serial No.</th>
                  <th className="px-4 py-3 text-[12px] text-left">Emp ID</th>
                  <th className="px-4 py-3 text-[12px] text-left">Name</th>
                  <th className="px-4 py-3 text-[12px] text-left">Age</th>
                  <th className="px-4 py-3 text-[12px] text-left">Blood Group</th>
                  <th className="px-4 py-3 text-[12px] text-left">Shift</th>
                  <th className="px-4 py-3 text-[12px] text-left">Role</th>
                  <th className="px-4 py-3 text-[12px] text-left">App Role</th>
                  <th className="px-4 py-3 text-[12px] text-left">Active</th>
                  <th className="px-4 py-3 text-[12px] text-left"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedEmployees &&
                  paginatedEmployees.map((employee, i) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => setSelectedEmployee(employee)}
                      onMouseEnter={() => setHoveredRow(employee.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td className="px-4 py-2 text-[12px] text-left ">{i + 1}</td>
                      <td className="px-4 py-2 text-[12px] text-left ">{employee.emp_id}</td>
                      <td className="px-4 py-2 text-[12px] text-left ">{employee.emp_name}</td>
                      <td className="px-4 py-2 text-[12px] text-left ">{employee.age}</td>
                      <td className="px-4 py-2 text-[12px] text-left ">{employee.bloodGroup}</td>
                      <td className="px-4 py-2 text-[12px] text-left ">{employee.shift}</td>
                      <td className="px-4 py-2 text-[12px] text-left ">{employee.role}</td>
                      <td className="px-4 py-2 text-[12px] text-left ">{employee.app_access_role}</td>
                      <td className="px-4 py-2 text-[12px] text-left ">
                        {employee.active === true || employee.active === "Yes" ? "Yes" : "No"}
                      </td>
                      <td className="flex justify-center gap-2 relative">
                        {hoveredRow === employee.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(dropdownOpen === employee.id ? null : employee.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full transition"
                            title="Actions"
                          >
                            <FaCircleChevronDown className="text-blue-500" size={20} />
                          </button>
                        )}
                        {dropdownOpen === employee.id && (
                          <div
                            className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                navigate(`/employees/edit/${employee.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                handleDelete(employee);
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
      <EmployeeDrawer
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
      />
    </>
  );
};
