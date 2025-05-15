import { FaEye, FaEdit, FaTrash, FaPlus, FaDownload } from "react-icons/fa";
import  { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { ProjectModal } from "../../modals/ProjectModal"; // adjust the path as needed
import ProjectViewModal from "../../modals/ProjectViewModal"; // Import the ProjectViewModal

const dummyProjects = [
  {
    projectNo: "P001",
    customer: "ABC Corp",
    orderNo: "ORD123",
    contractStart: "2024-01-01",
    tenure: "12 months",
    revenues: "$50,000",
    equipments: 5,
    staff: 10,
    locations: 3,
  },
  {
    projectNo: "P002",
    customer: "XYZ Ltd",
    orderNo: "ORD124",
    contractStart: "2023-10-15",
    tenure: "6 months",
    revenues: "$25,000",
    equipments: 3,
    staff: 6,
    locations: 1,
  },
];

export const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State to control view modal visibility
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleView = (project: any) => {
    setSelectedProject(project);
    setIsViewModalOpen(true); // Open the view modal
  };

  const handleAdd = () => {
    setSelectedProject(null); // Set it to null for adding a new project
    setIsModalOpen(true);
  };

  return (
    <>
      <PageBreadcrumb pageTitle={"Projects"} />
      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end items-center mb-6 gap-2">
             <button

                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                     <FaDownload className="mr-2" />
                     Export
                    </button>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-base"
            onClick={handleAdd}
          >
            <FaPlus />
            Add Project
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-base bg-white dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="px-4 py-3">Project No</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Order No</th>
                <th className="px-4 py-3">Contract Start</th>
                <th className="px-4 py-3">Tenure</th>
                <th className="px-4 py-3">Revenues</th>
                <th className="px-4 py-3">Equipments</th>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Locations</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
              {dummyProjects.map((project, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center"
                >
                  <td className="px-4 py-3">{project.projectNo}</td>
                  <td className="px-4 py-3">{project.customer}</td>
                  <td className="px-4 py-3">{project.orderNo}</td>
                  <td className="px-4 py-3">{project.contractStart}</td>
                  <td className="px-4 py-3">{project.tenure}</td>
                  <td className="px-4 py-3">{project.revenues}</td>
                  <td className="px-4 py-3">{project.equipments}</td>
                  <td className="px-4 py-3">{project.staff}</td>
                  <td className="px-4 py-3">{project.locations}</td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleView(project)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FaEye size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setIsModalOpen(true);
                      }}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data: any) => {
          // Handle form submission (either add or update)
          console.log(data);
          setIsModalOpen(false);
        }}
        project={selectedProject} // Pass selected project for editing
      />

      {/* Project View Modal */}
      <ProjectViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        project={selectedProject}
      />
    </>
  );
};
