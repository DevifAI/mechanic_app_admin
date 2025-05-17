import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt, FaUserTie, FaClock } from "react-icons/fa";

import { MultiSelect } from "../../components/projects/MultiSelect";
import { fetchRevenues } from "../../apis/revenueApi";
import { fetchEquipments } from "../../apis/equipmentApi";
import { fetchCustomers } from "../../apis/customerApi";
import { fetchEmployees } from "../../apis/employyeApi";
import { fetchStores } from "../../apis/storeApi";
import { Customer } from "../../types/customerTypes";


type ProjectFormProps = {
  onClose: () => void;
  onSubmit: (data: any) => void;
};

type Option = {
  value: string;
  text: string;
  selected: boolean;
};

export const ProjectCreateForm: React.FC<ProjectFormProps> = ({
  onClose,
  onSubmit,
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
  const [equipmentOptions, setEquipmentOptions] = useState<Option[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<Option[]>([]);
  const [storeOptions, setStoreOptions] = useState<Option[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers
        const customersData = await fetchCustomers();
        setCustomers(customersData);

        //Fetch customer
        const employeesData = await fetchEmployees();
        const emp_enhanced_data = employeesData.map((emp) => ({
          value: emp.id,
          text: emp.emp_name ?? "",
          selected: false,
        }));

        setEmployeeOptions(emp_enhanced_data);

        //Fetch Store
        const storeData = await fetchStores();
        const storeData_enhanced = storeData.map((store) => ({
          value: store.id,
          text: store.store_name ?? "", // fallback to empty string,
          selected: false,
        }));

        setStoreOptions(storeData_enhanced);

        // Fetch revenues
        const revenues = await fetchRevenues();
        setRevenueOptions(
          revenues.map((rev: any) => ({
            value: rev.id,
            text: `${rev.revenue_code} - ${rev.revenue_description}`,
            selected: false,
          }))
        );

        // Fetch equipments
        const equipments = await fetchEquipments();
        setEquipmentOptions(
          equipments.map((eq: any) => ({
            value: eq.id,
            text: eq.equipment_name,
            selected: false,
          }))
        );
      } catch (err) {
        console.error("Error loading data", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name: string, values: string[]) => {
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dummyOptions = {
    tenure: ["3 months", "6 months", "12 months"],
  };

  const multiOptions = {
    revenueMaster: revenueOptions,
    equipments: equipmentOptions,
    staff: employeeOptions,
    storeLocations: storeOptions,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project No */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project No<span className="text-red-500"> *</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="projectNo"
              value={formData.projectNo}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="PRJ-001"
              required
            />
            <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400">
              #
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Creation Date
          </label>
          <div className="relative">
            <input
              type="text"
              name="creationDate"
              value={new Date().toLocaleDateString("en-GB")} // Formats as dd/mm/yyyy
              readOnly // Makes the field non-editable
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Customer */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Customer<span className="text-red-500"> *</span>
          </label>
          <div className="relative">
            <select
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              required
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
            Order No<span className="text-red-500"> *</span>
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              name="orderNo"
              value={formData.orderNo}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="001"
              required
            />
            <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400">
              #
            </span>
          </div>
        </div>

        {/* Contract Start Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contract Start Date<span className="text-red-500"> *</span>
          </label>
          <div
            className="relative"
            onClick={() => dateInputRef.current?.showPicker()}
            style={{ cursor: "pointer" }}
          >
            <input
              type="date"
              name="contractStartDate"
              value={formData.contractStartDate}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              ref={dateInputRef}
              onClick={(e) => e.stopPropagation()}
              required
            />
            <FaCalendarAlt
              className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-400"
              onClick={() => dateInputRef.current?.showPicker()}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Contract Tenure */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contract Tenure<span className="text-red-500"> *</span>
          </label>
          <div className="relative">
            <select
              name="contractTenure"
              value={formData.contractTenure}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
              required
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
      </div>

      {/* Multi-select Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Master */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Add Revenue Master<span className="text-red-500"> *</span>
          </label>
          <MultiSelect
            label="Revenue Master"
            options={multiOptions.revenueMaster}
            defaultSelected={formData.revenueMaster}
            onChange={(values: any) =>
              handleMultiSelectChange("revenueMaster", values)
            }
          />
        </div>

        {/* Equipments */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Add Equipments<span className="text-red-500"> *</span>
          </label>
          <MultiSelect
            label="Equipments"
            options={multiOptions.equipments}
            defaultSelected={formData.equipments}
            onChange={(values: any) =>
              handleMultiSelectChange("equipments", values)
            }
          />
        </div>

        {/* Staff */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Add Employees <span className="text-red-500"> *</span>
          </label>
          <MultiSelect
            label="Staff"
            options={multiOptions.staff}
            defaultSelected={formData.staff}
            onChange={(values: any) => handleMultiSelectChange("staff", values)}
          />
        </div>

        {/* Store Locations */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Add Store Locations<span className="text-red-500"> *</span>
          </label>
          <MultiSelect
            label="Store Locations"
            options={multiOptions.storeLocations}
            defaultSelected={formData.storeLocations}
            onChange={(values: any) =>
              handleMultiSelectChange("storeLocations", values)
            }
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
            </>
          ) : (
            "Create Project"
          )}
        </button>
      </div>
    </form>
  );
};
