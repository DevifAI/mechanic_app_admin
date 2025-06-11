import { useEffect, useState } from "react";
import { deleteProject, fetchProjects } from "../../apis/projectsApi";
import { handleExport } from "../../utils/helperFunctions/downloadExcel_forProjects";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { FaCircleChevronDown, FaPlus } from "react-icons/fa6";
import { FaSortAmountUp } from "react-icons/fa";
import { FaSortAmountDown } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import ProjectDrawer from "./ProjectDrawer";
import { useNavigate } from "react-router";
import Title from "../../components/common/Title";
import { IoIosMore } from "react-icons/io";

type ProjectRow = {
  id: any;
  projectNo: string;
  customer: string;
  orderNo: string;
  contractStart: string;
  tenure: string;
  duration: string | null;
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
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [rawProjects, setRawProjects] = useState<any[]>([]);
  const [optionsDropdownOpen, setOptionsDropdownOpen] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);

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
      const simplified = data.map((p: any) => {
        const start = new Date(p.contract_start_date);
        const end = p.contract_end_date ? new Date(p.contract_end_date) : null;
        let duration = "Ongoing";
        if (end && !isNaN(start.getTime())) {
          const diffMs = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          duration = `${diffDays} Days`;
        }

        return {
          id: p.id,
          projectNo: p.project_no,
          customer: p.customer?.partner_name || "N/A",
          orderNo: p.order_no,
          contractStart: p.contract_start_date?.split("T")[0] || "N/A",
          tenure: p.contract_tenure,
          duration,
          revenues:
            p.revenues.length > 0
              ? p.revenues.map((r: any) => r.revenue_description).join(", ")
              : "N/A",
          equipments: p.equipments.length,
          staff: p.staff.length,
          locations: p.store_locations.length,
        };
      });

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
    const handleClickOutside = () => {
      setDropdownOpen(null);
      setOptionsDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleExportProjects = () => {
    const formattedProjects = rawProjects.map(project => {
      const {
        createdAt,
        updatedAt,
        contract_start_date,
        contract_end_date,
        ...rest
      } = project;

      return {
        ...rest,
        contract_start_date: contract_start_date
          ? new Date(contract_start_date).toISOString().split("T")[0]
          : "",
        contract_end_date: contract_end_date
          ? new Date(contract_end_date).toISOString().split("T")[0]
          : "",
      };
    });

    handleExport(formattedProjects);
    toast.success("Exported as Excel!");
  };

  const handleSort = () => {
    const sorted = [...projects].sort((a, b) =>
      sortAsc
        ? a.projectNo.localeCompare(b.projectNo)
        : b.projectNo.localeCompare(a.projectNo)
    );
    setProjects(sorted);
    setSortAsc(!sortAsc);
  };

  return (
    <div className="h-[80vh] flex flex-col dark:bg-gray-900 overflow-hidden">
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* Header */}



      <div className="flex justify-between items-center px-6">
        <Title pageTitle="Projects" />

        <div className="flex justify-end items-center mb-4 gap-3">
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
              setOptionsDropdownOpen(!optionsDropdownOpen);
            }}
          >
            <IoIosMore />
            {optionsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-30 py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"

                  onClick={handleExportProjects}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    fetchAndSetProjects();
                    setOptionsDropdownOpen(false);
                  }}
                >
                  Refresh
                </button>
                <div
                  className="relative"

                >
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                    onClick={() => {
                      handleSort();
                      setOptionsDropdownOpen(false);
                    }}
                  >
                    {sortAsc ? <FaSortAmountDown /> : <FaSortAmountUp />}
                    <span>Sort {sortAsc ? "Asc" : "Desc"}</span>
                  </button>
                </div>
              </div>
            )}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-blue-600 font-semibold text-lg">
              Loading...
            </span>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="flex-1 overflow-hidden px-6 pt-4">
              <div className="h-full rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <div className="overflow-y-auto h-full">
                  <table className="w-full min-w-full text-base">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3">Project No</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Order No</th>
                        <th className="px-4 py-3">Contract Start</th>
                        <th className="px-4 py-3">Tenure</th>
                        <th className="px-4 py-3">Duration</th>
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
                          className="even:bg-gray-200 dark:even:bg-gray-900 cursor-pointer"
                          onClick={() => navigate(`/projects/${project.id}`, { state: { project: rawProjects[idx] } })}
                          onMouseEnter={() => setHoveredRow(project.projectNo)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className="px-4 py-2">{project.projectNo}</td>
                          <td className="px-4 py-2">{project.customer}</td>
                          <td className="px-4 py-2">{project.orderNo}</td>
                          <td className="px-4 py-2">{project.contractStart}</td>
                          <td className="px-4 py-2">{project.tenure}</td>
                          <td className="px-4 py-2">{project.duration}</td>
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
