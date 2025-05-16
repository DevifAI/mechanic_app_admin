import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import RoleFormModal from "../../modals/RoleFormModal";
import { createRole, fetchRoles, updateRole } from "../../apis/roleApi";

export const Roles = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // <-- Add loading state

  useEffect(() => {
    const fetchAndSetRoles = async () => {
      setLoading(true); // Start loading
      try {
        const data = await fetchRoles();
        setRoles(data);
      } catch (err) {
        console.error("Failed to fetch roles", err);
      }
      setLoading(false); // End loading
    };
    fetchAndSetRoles();
  }, []);

  console.log("Roles data", roles);

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

  // const handleView = (role: any) => {
  //   console.log("View role", role);
  // };

  const handleSubmit = async (formData: any) => {
    setIsModalOpen(false);
    setEditingRole(null);
    setLoading(true);
    try {
      if (editingRole && editingRole.id) {
        // Edit
        await updateRole(editingRole.id, formData);
      } else {
        // Create
        await createRole(formData);
      }
      // Refresh the list from backend
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      console.error("Failed to save role", err);
    }
    setLoading(false);
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
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-4 py-3">{role.code}</td>
                    <td className="px-4 py-3">{role.name}</td>
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
          )}
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
