import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RoleFormModal from "../../modals/RoleFormModal";


const dummyRoles = [
  {
    id: 1,
    code: "RL-001",
    name: "Mechanic",
    assignedEmployees: 5,
  },
  {
    id: 2,
    code: "RL-002",
    name: "Site Manager",
    assignedEmployees: 2,
  },
];

export const Roles = () => {
  const [roles, setRoles] = useState(dummyRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);

  const handleAdd = () => {
    setEditingRole(null); // No pre-filled data
    setIsModalOpen(true);
  };

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = (role: any) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
  };

  const handleView = (role: any) => {
    console.log("View role", role);
  };

  const handleSubmit = (formData: any) => {
    if (editingRole) {
      // Update existing
      setRoles((prev) =>
        prev.map((r) => (r.id === editingRole.id ? { ...r, ...formData } : r))
      );
    } else {
      // Add new
      const newRole = {
        id: Date.now(),
        ...formData,
        assignedEmployees: 0, // default
      };
      setRoles((prev) => [...prev, newRole]);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Roles" />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Role
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-base bg-white dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Role Name</th>
                <th className="px-4 py-3">Assigned Employees</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3">{role.code}</td>
                  <td className="px-4 py-3">{role.name}</td>
                  <td className="px-4 py-3">{role.assignedEmployees}</td>
                  <td className="px-4 py-3 flex justify-center gap-2">
                    {/* <button
                      onClick={() => handleView(role)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEye size={18} />
                    </button> */}
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(role)}
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

      {/* Role Modal */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingRole={editingRole}
      />
    </>
  );
};
