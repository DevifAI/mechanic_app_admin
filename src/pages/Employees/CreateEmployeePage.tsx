import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaUpload,
  FaPlus,
  FaSpinner,
  FaFileExcel,
  FaTimes,
  FaDownload,
} from "react-icons/fa";
import { EmployeeForm } from "../../components/employee/EmployeeForm";
import {
  createEmployee,
  fetchEmployeeById,
  updateEmployee,
} from "../../apis/employyeApi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        setIsLoading(true);
        const response = await fetchEmployeeById(id);
        setEditData(response);
      } catch (error) {
        console.error("Failed to fetch employee", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      if (editData && id) {
        await updateEmployee(id, data);
        toast.success("Employee updated successfully!");
        setTimeout(() => navigate("/employees/view"), 800);
      } else {
        await createEmployee(data);
        toast.success("Employee created successfully!");
        setTimeout(() => navigate("/employees/view"), 800);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || "Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Create Employee
          </h1>
          <button
            onClick={() => navigate("/employees/view")}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span>Back to Employees</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("form")}
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === "form"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                <FaPlus className="mr-2" />
                Single Employee
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`flex items-center px-6 py-4 text-sm font-medium ${
                  activeTab === "bulk"
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                <FaUpload className="mr-2" />
                Bulk Upload
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === "form" ? (
              <EmployeeForm
                loading={isLoading}
                initialData={editData}
                onSubmit={handleSubmit}
              />
            ) : (
              <BulkUploadSection />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BulkUploadSection = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  // const navigate = useNavigate();
  const dummyData = {
    emp_id: "EMP20704",
    emp_name: "Abir Roy",
    blood_group: "O+",
    age: 31,
    adress: "123 Main St, City",
    position: "JR. Engineer",
    is_active: true,
    shiftcode: "SHIFT-M2",
    role_name: "Mechanic",
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:5000/api/master/super/admin/employee/bulk-upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Upload response:", data);

      if (response.ok) {
        if (data.errors && data.errors.length > 0) {
          const errorMessages = data.errors
            .map((e: any) => `${e.row}: ${e.message}`)
            .join("<br/>");
          toast.error(
            <div
              dangerouslySetInnerHTML={{
                __html: "Upload failed:<br/>" + errorMessages,
              }}
            />
          );
        } else if (data.message) {
          toast.error("Upload failed: " + data.message);
        } else {
          toast.error("Upload failed");
        }
        return;
      }

      toast.success(
        `Bulk upload completed successfully! Created ${data.createdCount} employees.`
      );
      setFile(null);
      // navigate("/employees/view");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const DownloadTemplateButton = () => {
    const handleDownload = () => {
      // Prepare data replacing IDs with mapped names
      const exportData = [
        {
          emp_id: dummyData.emp_id,
          emp_name: dummyData.emp_name,
          blood_group: dummyData.blood_group,
          age: dummyData.age,
          adress: dummyData.adress,
          position: dummyData.position,
          is_active: dummyData.is_active ? "Yes" : "No",
          shiftcode: dummyData.shiftcode,
          role_name: dummyData.role_name,
        },
      ];

      // Create a worksheet from JSON
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");

      // Generate buffer
      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // Save file
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, "employee_template.xlsx");
    };

    return (
      <button
        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
        onClick={handleDownload}
      >
        <FaDownload className="mr-2" />
        Download Template
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <FaUpload className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Drag and drop files here
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">or</p>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            <span>Browse files</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".csv, .xlsx"
            />
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supported formats: CSV, Excel (Max 5MB)
          </p>
        </div>

        {file && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mt-6 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                  <FaFileExcel className="text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`px-6 py-2 rounded-md text-white flex items-center ${
            !file || isUploading
              ? "bg-blue-400 dark:bg-blue-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
        >
          {isUploading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <FaUpload className="mr-2" />
              Upload Employees
            </>
          )}
        </button>
      </div>

      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
          Download Template
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Use our template file to ensure your employee data is formatted
          correctly.
        </p>
        <DownloadTemplateButton />
      </div>
    </div>
  );
};
