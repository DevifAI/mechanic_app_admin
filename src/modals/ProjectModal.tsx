import React, { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaSave,
  FaCalendarAlt,
  FaUserTie,
  FaFileAlt,
  FaClock,
} from "react-icons/fa";
import { Customer } from "../types/customerTypes";
import { fetchCustomers } from "../apis/customerApi";
import { fetchRevenues } from "../apis/revenueApi";

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  project?: any;
};

type Option = {
  value: string;
  text: string;
  selected: boolean;
};

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
}) => {
  const [formData, setFormData] = useState({
    projectNo: "",
    customer: "",
    orderNo: "",
    contractStartDate: "",
    contractTenure: "",
    revenueMaster: [],
    equipments: [],
    staff: [],
    storeLocations: [],
  });
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [revenueOptions, setRevenueOptions] = useState<Option[]>([]);

  // const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error loading customers", err);
      }
    };

    getCustomers();
  }, []);

  useEffect(() => {
    const getRevenues = async () => {
      try {
        const revenues = await fetchRevenues();
        setRevenueOptions(
          revenues.map((rev) => ({
            value: rev.id, // <-- This is the ID you will send
            text: `${rev.revenue_code} - ${rev.revenue_description}`,
            selected: false,
          }))
        );
      } catch (err) {
        console.error("Error loading revenues", err);
      }
    };
    getRevenues();
  }, []);

  // Update form data when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        projectNo: project.projectNo || "",
        customer: project.customer || "",
        orderNo: project.orderNo || "",
        contractStartDate: project.contractStart || "",
        contractTenure: project.tenure || "",
        revenueMaster: project.revenueMaster || [],
        equipments: project.equipments || [],
        staff: project.staff || [],
        storeLocations: project.storeLocations || [],
      });
    } else {
      setFormData({
        projectNo: "",
        customer: "",
        orderNo: "",
        contractStartDate: "",
        contractTenure: "",
        revenueMaster: [],
        equipments: [],
        staff: [],
        storeLocations: [],
      });
    }
  }, [project]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const dummyOptions = {
    customer: ["Partner A", "Partner B"],
    tenure: ["3 months", "6 months", "12 months"],
  };

  const multiOptions = {
    revenueMaster: revenueOptions,
    equipments: [
      { value: "eq1", text: "Excavator", selected: false },
      { value: "eq2", text: "Bulldozer", selected: false },
      { value: "eq3", text: "Crane", selected: false },
    ],
    staff: [
      { value: "emp1", text: "Alice", selected: false },
      { value: "emp2", text: "Bob", selected: false },
      { value: "emp3", text: "Charlie", selected: false },
    ],
    storeLocations: [
      { value: "loc1", text: "Mumbai", selected: false },
      { value: "loc2", text: "Delhi", selected: false },
      { value: "loc3", text: "Chennai", selected: false },
    ],
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh] z-10 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes
            className="text-gray-500 hover:text-red-500 dark:text-gray-300"
            size={20}
          />
        </button>

        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
            <FaFileAlt className="text-blue-600 dark:text-blue-300" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {project ? "Edit Project" : "Add New Project"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {project
                ? `Editing ${project.projectNo}`
                : "Fill in the project details"}
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project No */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project No
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="projectNo"
                  value={formData.projectNo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="PRJ-001"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400">
                  #
                </span>
              </div>
            </div>

            {/* Customer */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer
              </label>
              <div className="relative">
                <select
                  name="customer"
                  value={formData.customer}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                >
                  <option value="">Select customer</option>
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.partner_name}
                    </option>
                  ))}
                </select>
                <FaUserTie className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400" />
              </div>
            </div>

            {/* Order No */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Order No
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="orderNo"
                  value={formData.orderNo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="ORD-001"
                />
                <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400">
                  #
                </span>
              </div>
            </div>

            {/* Contract Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contract Start Date
              </label>
              <div
                className="relative"
                onClick={() =>
                  dateInputRef.current &&
                  dateInputRef.current.showPicker &&
                  dateInputRef.current.showPicker()
                }
                style={{ cursor: "pointer" }}
              >
                <input
                  type="date"
                  name="contractStartDate"
                  value={formData.contractStartDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  ref={dateInputRef}
                  onClick={(e) => e.stopPropagation()} // Prevents double opening
                />
                <FaCalendarAlt
                  className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400"
                  onClick={() =>
                    dateInputRef.current &&
                    dateInputRef.current.showPicker &&
                    dateInputRef.current.showPicker()
                  }
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>

            {/* Contract Tenure */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contract Tenure
              </label>
              <div className="relative">
                <select
                  name="contractTenure"
                  value={formData.contractTenure}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
                >
                  <option value="">Select tenure</option>
                  {dummyOptions.tenure.map((tenure, idx) => (
                    <option key={idx} value={tenure}>
                      {tenure}
                    </option>
                  ))}
                </select>
                <FaClock className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400" />
              </div>
            </div>

            {/* Revenue Master */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Revenue Master
              </label>
              <MultiSelect
                label="Revenue Master"
                options={multiOptions.revenueMaster}
                defaultSelected={formData.revenueMaster}
                onChange={(values) =>
                  handleMultiSelectChange("revenueMaster", values)
                }
              />
            </div>

            {/* Equipments */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Equipments
              </label>
              <MultiSelect
                label="Equipments"
                options={multiOptions.equipments}
                defaultSelected={formData.equipments}
                onChange={(values) =>
                  handleMultiSelectChange("equipments", values)
                }
              />
            </div>

            {/* Staff */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Staff
              </label>
              <MultiSelect
                label="Staff"
                options={multiOptions.staff}
                defaultSelected={formData.staff}
                onChange={(values) => handleMultiSelectChange("staff", values)}
              />
            </div>

            {/* Store Locations */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Store Locations
              </label>
              <MultiSelect
                label="Store Locations"
                options={multiOptions.storeLocations}
                defaultSelected={formData.storeLocations}
                onChange={(values) =>
                  handleMultiSelectChange("storeLocations", values)
                }
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
            >
              <FaSave className="mr-2" />
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modern MultiSelect Component
const MultiSelect = ({
  label,
  options,
  defaultSelected = [],
  onChange,
}: {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  onChange: (values: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] =
    useState<string[]>(defaultSelected);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onChange(selectedValues);
  }, [selectedValues, onChange]);

  const toggleOption = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between bg-white dark:bg-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <span
                  key={value}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded flex items-center"
                >
                  {option?.text}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(value);
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-gray-400 dark:text-gray-400">
              Select {label}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`px-3 py-2 cursor-pointer flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 ${
                    selectedValues.includes(option.value)
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }`}
                  onClick={() => toggleOption(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    readOnly
                    className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {option.text}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
