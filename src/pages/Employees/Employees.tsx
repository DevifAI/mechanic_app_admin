import { FaEye, FaEdit, FaTrash, FaPlus, FaDownload } from "react-icons/fa";
import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import EmployeeViewModal from "../../modals/EmployeeViewModal";
import EmployeeFormModal from "../../modals/EmployeeFormModal";

const dummyEmployees = [
  {
    empId: "EMP001",
    name: "John Doe",
    age: 30,
    bloodGroup: "O+",
    position: "Technician",
    shift: "Morning",
    role: "Mechanic",
    active: true,
    address: "123 Main Street",
  },
  {
    empId: "EMP002",
    name: "Jane Smith",
    age: 28,
    bloodGroup: "A-",
    position: "Supervisor",
    shift: "Evening",
    role: "Site Incharge",
    active: false,
    address: "456 Park Avenue",
  },
];

const positionsList = ["Technician", "Supervisor", "Manager"];
const shiftList = ["Morning", "Evening", "Night"];
const roleList = ["Mechanic", "Mechanic Incharge", "Site Incharge", "Admin"];

export const Employees = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handleView = (emp: any) => {
    setSelectedEmployee(emp);
    setIsViewModalOpen(true);
  };

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setIsFormModalOpen(true);
  };

  const handleDelete = (employee: any) => {
    console.log("Deleting:", employee);
    // Confirm & delete logic here
  };

  const handleSaveEmployee = (formData: any) => {
    console.log("Saving employee:", formData);
    // Save logic here (e.g. API call or update state)
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null); // clear selection
    setIsFormModalOpen(true);
  };

  return (
    <>
      <PageBreadcrumb pageTitle={"Employees"} />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4 gap-2 ">
          {/* <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Employee List
          </h2> */}
           <button
         
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
           <FaDownload className="mr-2" />
           Export
          </button>

          <button
            onClick={handleAddEmployee}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Employee
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
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
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
              {dummyEmployees.map((emp, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                >
                  <td className="px-4 py-3">{emp.empId}</td>
                  <td className="px-4 py-3">{emp.name}</td>
                  <td className="px-4 py-3">{emp.age}</td>
                  <td className="px-4 py-3">{emp.bloodGroup}</td>
                  <td className="px-4 py-3">{emp.position}</td>
                  <td className="px-4 py-3">{emp.shift}</td>
                  <td className="px-4 py-3">{emp.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        emp.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {emp.active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleView(emp)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(emp)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(emp)}
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

      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSaveEmployee}
        employee={selectedEmployee}
        emp_positions={positionsList}
        shift={shiftList}
        role={roleList}
      />

      <EmployeeViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={selectedEmployee}
      />
    </>
  );
};
