import { useEffect, useState } from "react";
import { deleteProject, fetchProjects } from "../../apis/projectsApi";
import { handleExport } from "../../utils/helperFunctions/downloadExcel_forProjects";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import ProjectDrawer from "./ProjectDrawer";
import { useNavigate } from "react-router";

type ProjectRow = {
  id: any;
  projectNo: string;
  customer: string;
  orderNo: string;
  contractStart: string;
  tenure: string;
  revenues: string;
  equipments: number;
  staff: number;
  locations: number;
};

export const Projects = () => {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rawProjects, setRawProjects] = useState<any[]>([]);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedProjects,
  } = usePagination(projects, rowsPerPage);

  const navigate = useNavigate();

  const fetchAndSetProjects = async () => {
    setLoading(true);
    try {
      const data = await fetchProjects();
      setRawProjects(data);
      const simplified = data.map((p: any) => ({
        id: p.id,
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
      console.error("Error loading projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleExportProjects = () => {
    handleExport(rawProjects);
    toast.success("Exported as Excel!");
  };

  return (
    <div className="h-[80vh] flex flex-col dark:bg-gray-900 overflow-hidden">
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* Header Section */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Projects</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/projects/create")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <FaPlus />
            <span>New</span>
          </button>
          <button
            onClick={handleExportProjects}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-blue-600 font-semibold text-lg">Loading...</span>
          </div>
        ) : (
          <>
            {/* Table Container */}
            <div className="flex-1 overflow-hidden px-6 pt-4">
              <div className="h-[100%] rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="overflow-y-auto h-full">
                  <table className="w-full min-w-full text-base">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm sticky top-0 z-10">
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
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                      {paginatedProjects?.map((project, idx) => (
                        <tr
                          key={idx}
                          className="even:bg-gray-200 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-lg hover:-translate-y-[2px] transition duration-200 cursor-pointer"
                          // First, update your row click handler to navigate to the detail page
                          onClick={() => navigate(`/projects/${project.id}`, { state: { project: rawProjects[idx] } })}
                          onMouseEnter={() => setHoveredRow(project.projectNo)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className="px-4 py-2">{project.projectNo}</td>
                          <td className="px-4 py-2">{project.customer}</td>
                          <td className="px-4 py-2">{project.orderNo}</td>
                          <td className="px-4 py-2">{project.contractStart}</td>
                          <td className="px-4 py-2">{project.tenure}</td>
                          <td className="px-4 py-2">{project.revenues}</td>
                          <td className="px-4 py-2">{project.equipments}</td>
                          <td className="px-4 py-2">{project.staff}</td>
                          <td className="px-4 py-2">{project.locations}</td>
                          <td className="flex justify-center gap-2 relative">
                            {hoveredRow === project.projectNo && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDropdownOpen(
                                    dropdownOpen === project.projectNo ? null : project.projectNo
                                  );
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded-full transition"
                                title="Actions"
                              >
                                <FaCircleChevronDown className="text-blue-500" size={20} />
                              </button>
                            )}
                            {dropdownOpen === project.projectNo && (
                              <div
                                className="absolute z-20 right-0 mt-8 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                                  onClick={() => {
                                    setDropdownOpen(null);
                                    navigate(`/projects/edit/${project.id}`);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-gray-700 transition"
                                  onClick={async () => {
                                    try {
                                      await deleteProject(project.id);
                                      toast.success("Project deleted successfully!");
                                      setDropdownOpen(null);
                                      fetchAndSetProjects();
                                    } catch (error) {
                                      console.error("Delete failed:", error);
                                      toast.error("Failed to delete project");
                                    }
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
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
              />
            </div>
          </>
        )}
      </div>

      <ProjectDrawer
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  );
};