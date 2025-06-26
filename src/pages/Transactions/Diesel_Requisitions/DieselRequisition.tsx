import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { IoIosMore } from "react-icons/io";
import { getAllDieselRequisitions } from "../../../apis/dieselRequisitions.ts";
import * as XLSX from "xlsx";

export const DieselRequisition = () => {
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const navigate = useNavigate();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedRequisitions,
  } = usePagination(requisitions, rowsPerPage);

  const fetchAndSetRequisitions = async () => {
    setLoading(true);
    try {
      const data = await getAllDieselRequisitions(); // fetch diesel requisitions
      setRequisitions(data);
      console.log({ data });
    } catch (err) {
      toast.error("Failed to fetch Diesel Requisitions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetRequisitions();
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

  const exportRequisitionsToExcel = (requisitions: any[]) => {
    if (!requisitions || requisitions.length === 0) {
      toast.error("No requisitions to export.");
      return;
    }

    const exportData: any[] = [];

    requisitions.forEach((req) => {
      req.items.forEach((item: any) => {
        exportData.push({
          Date: new Date(req.date).toLocaleDateString(),
          "Created By": req.createdByEmployee?.emp_name || "N/A",
          Organisation: req.organisation?.org_name || "N/A",
          "Item Name": item.consumableItem?.item_name || "N/A",
          "Item Description": item.consumableItem?.item_description || "N/A",
          Quantity: item.quantity,
          Unit: item.unitOfMeasurement?.unit_name || "N/A",
          Notes: item.Notes || "",
          "Approved by MIC": req.is_approve_mic ? "Yes" : "Pending",
          "Approved by SIC":
            req.is_approve_sic === true
              ? "Approved"
              : req.is_approve_sic === false
              ? "Rejected"
              : "Pending",
          "Approved by PM": req.is_approve_pm ? "Yes" : "Pending",
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Diesel Requisitions");

    XLSX.writeFile(workbook, "diesel_requisitions.xlsx");
  };

  // Sort handlers (example: by date or createdByEmployee.emp_name)
  const handleSortByDate = () => {
    setRequisitions((prev) =>
      [...prev].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    toast.info("Sorted by Date");
  };

  const handleSortByEmployee = () => {
    setRequisitions((prev) =>
      [...prev].sort((a, b) =>
        a.createdByEmployee.emp_name.localeCompare(b.createdByEmployee.emp_name)
      )
    );
    toast.info("Sorted by Employee");
  };

  return (
    <>
      <div className="flex justify-between items-center px-6 mb-2 ">
        <PageBreadcrumb pageTitle="Diesel Requisitions" />
        <div className="flex justify-end items-center  gap-3 px-6">
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
                    exportRequisitionsToExcel(requisitions);
                  }}
                >
                  Export
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:text-white hover:bg-blue-500 dark:hover:bg-gray-700 transition"
                  onClick={() => {
                    setMoreDropdownOpen(false);
                    fetchAndSetRequisitions();
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
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          handleSortByDate();
                        }}
                      >
                        Sort by Date
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-white dark:hover:bg-gray-700 transition"
                        onClick={() => {
                          setMoreDropdownOpen(false);
                          setSortMenuOpen(false);
                          handleSortByEmployee();
                        }}
                      >
                        Sort by Employee
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="min-h-screen w-full dark:bg-gray-900 flex flex-col">
        <div className="overflow-x-auto flex-1 w-full overflow-auto px-6 pb-6">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="text-blue-600 font-semibold text-lg">
                Loading...
              </span>
            </div>
          ) : (
            <table className="w-full min-w-[900px] text-base bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
                <tr>
                  <th className="px-4 py-3 text-[12px]">S.No</th>{" "}
                  {/* Serial No. column */}
                  <th className="px-4 py-3 text-[12px]">Date</th>
                  <th className="px-4 py-3 text-[12px]">Created By</th>
                  <th className="px-4 py-3 text-[12px]">Organisation</th>
                  <th className="px-4 py-3 text-[12px]">Items Count</th>
                  <th className="px-4 py-3 text-[12px]">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedRequisitions.map((req, index) => (
                  <tr
                    key={req.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() =>
                      navigate(`/diesel-requisition/${req.id}`, {
                        state: { requisition: req },
                      })
                    }
                  >
                    <td className="px-4 py-3 text-[12px]">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>{" "}
                    {/* Serial No. cell */}
                    <td className="px-4 py-3 text-[12px]">
                      {new Date(req.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {req.createdByEmployee?.emp_name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-[12px]">
                      {req.organisation?.org_name || "N/A"}
                    </td>
                    <td className="px-4 py-3">{req.items?.length || 0}</td>
                    <td className="px-4 py-3 text-[12px]">
                      {req.is_approve_mic === "rejected" ||
                      req.is_approve_sic === "rejected" ||
                      req.is_approve_pm === "rejected" ? (
                        <span className="text-red-600 font-medium">
                          Rejected
                        </span>
                      ) : req.is_approve_mic === "approved" &&
                        req.is_approve_sic === "approved" &&
                        req.is_approve_pm === "approved" ? (
                        <span className="text-green-600 font-medium">
                          Approved
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium">
                          Pending
                        </span>
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
    </>
  );
};
