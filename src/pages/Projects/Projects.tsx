import { FaDownload } from "react-icons/fa";
import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ProjectViewModal from "../../modals/ProjectViewModal";
import { useNavigate } from "react-router";
import { fetchProjects } from "../../apis/projectsApi";
import { handleExport } from "../../utils/helperFunctions/downloadExcel_forProjects";

export const Projects = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [original_projects, setOriginal_Projects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const projects = await fetchProjects();
        setOriginal_Projects(projects);
        const simplified = projects.map((p: any) => ({
          projectNo: p.project_no,
          customer: p.customer?.partner_name || "N/A",
          orderNo: p.order_no,
          contractStart: p.contract_start_date?.split("T")[0] || "N/A",
          tenure: p.contract_tenure,
          revenues:
            p.revenues.length > 0
              ? p.revenues.map((r: any) => r.revenue_description).join(", ")
              : "N/A",
          equipments: p.equipments.length,
          staff: p.staff.length,
          locations: p.store_locations.length,
        }));

        setProjects(simplified);
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = (project: any) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const handleEdit = (project: any) => {
    navigate(`/edit-project/${project.projectNo}`);
  };

  const handleDelete = (project: any) => {
    if (
      confirm(`Are you sure you want to delete project ${project.projectNo}?`)
    ) {
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle={"Projects"} />
      <div className="p-6 dark:bg-gray-900 min-h-screen">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => handleExport(original_projects)}
            className="
      flex items-center px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-md 
      shadow-sm  hover:border-black 
      transition-colors duration-300 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      cursor-pointer
    "
          >
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
          {isLoading ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">
              Loading projects...
            </div>
          ) : (
            <table className="min-w-full text-base bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Project No
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Order No
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Contract Start
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Tenure
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Revenues
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Equipments
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Staff
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Locations
                  </th>
                  <th className="px-4 py-3 text-center border border-gray-300 dark:border-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100">
                {projects &&
                  projects.map((project, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition text-center group cursor-pointer"
                      onClick={() => {
                        handleView(project);
                      }}
                    >
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        {project.projectNo}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        {project.customer}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        {project.orderNo}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        {project.contractStart}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        {project.tenure}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        {project.revenues}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        {project.equipments}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        {project.staff}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        {project.locations}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Edit Button */}
                          <button
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   handleEdit(project);
                            // }}
                            disabled
                            className="p-1.5 cursor-not-allowed rounded-md text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                            title="Edit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="black"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project);
                            }}
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="black"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ProjectViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        project={selectedProject}
      />
    </>
  );
};
