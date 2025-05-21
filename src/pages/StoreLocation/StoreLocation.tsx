import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { fetchStores, deleteStore } from "../../apis/storeApi";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../utils/Pagination";
import { toast, ToastContainer } from "react-toastify";

type StoreRow = {
  id: string;
  store_code: string;
  store_name?: string;
  store_location: string;
};

export const StoreLocation = () => {
  const [stores, setStores] = useState<StoreRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const navigate = useNavigate();

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: paginatedStores,
  } = usePagination(stores, rowsPerPage);


  const fetchAndSetStores = async () => {
    setLoading(true);
    try {
      const data = await fetchStores();
      setStores(
        data.map((item: any) => ({
          id: item.id,
          store_code: item.store_code,
          store_name: item.store_name,
          store_location: item.store_location,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch stores", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetStores();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleDelete = async (store: StoreRow) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      setLoading(true);
      try {
        await deleteStore(store.id);
        await fetchAndSetStores();
        toast.success("Store deleted successfully!");
      } catch (err) {
        console.error("Failed to delete store", err);
        toast.error("Failed to delete store!");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Store Location" />
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="p-6 dark:bg-gray-900 min-h-screen">
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
                  <th className="px-4 py-3">Store Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600 text-gray-800 dark:text-gray-100 text-center">
                {paginatedStores &&
                  paginatedStores.map((store) => (
                    <tr
                      key={store.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-4 py-3">{store.store_code}</td>
                      <td className="px-4 py-3">{store.store_name || "-"}</td>
                      <td className="px-4 py-3">{store.store_location}</td>
                      <td className="px-4 py-3 flex justify-center gap-2 relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(
                              dropdownOpen === store.id ? null : store.id
                            );
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          title="Actions"
                        >
                          <span style={{ fontSize: 20, lineHeight: 1 }}>⋮</span>
                        </button>
                        {dropdownOpen === store.id && (
                          <div
                            className="absolute z-20 right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                navigate(`/store-locations/edit/${store.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              onClick={() => {
                                setDropdownOpen(null);
                                handleDelete(store);
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>
    </>
  );
};
