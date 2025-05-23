import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { deleteProject, fetchProjects } from "../../apis/projectsApi";
import { handleExport } from "../../utils/helperFunctions/downloadExcel_forProjects";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
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
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  // Sort handlers
  const handleSortByCustomer = () => {
    setProjects((prev) =>
      [...prev].sort((a, b) => a.customer.localeCompare(b.customer))
    );
    toast.info("Sorted by Customer");
  };

  const handleSortByProjectNo = () => {
    setProjects((prev) =>
      [...prev].sort((a, b) => a.projectNo.localeCompare(b.projectNo))
    );
    toast.info("Sorted by Project No");
  };

  const handleExportProjects = () => {
    handleExport(projects);
    toast.success("Exported as Excel!");
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <PageBreadcrumb pageTitle="Projects" />

      <div className="min-h-screen h-full w-full dark:bg-gray-900 flex flex-col">
        <div className="flex justify-end items-center mb-4 gap-3 px-6 pt-6">
          <button
            onClick={() => navigate("/projects/create")}
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
                    handleExportProjects();
                  }}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    fetchAndSetProjects();
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
                          handleSortByCustomer();
                        }}
                      >
                        Sort by Customer
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          handleSortByProjectNo();
                        }}
                      >
                        Sort by Project No
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
            <table className="w-full min-w-[1100px] text-base bg-white dark:bg-gray-800">
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
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedProjects &&
                  paginatedProjects.map((project, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => setSelectedProject(project)}
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
                                dropdownOpen === project.projectNo
                                  ? null
                                  : project.projectNo
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
                                  toast.success(
                                    "Project deleted successfully!"
                                  );
                                  setDropdownOpen(null);
                                  fetchAndSetProjects(); // Refresh the list
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
      <ProjectDrawer
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </>
  );
};
