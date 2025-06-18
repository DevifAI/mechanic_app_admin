import React, { useEffect, useState } from "react";
import { fetchRoles } from "../../apis/roleApi";
import { fetchShifts } from "../../apis/shiftApi";
import { fetchEmpPositions } from "../../apis/empPositionApi";
import { getAllOrganisations } from "../../apis/organisationApi";

type Option = { id: string; name: string };

type EmployeeFormProps = {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
};

// Define the app access roles as constants
const APP_ACCESS_ROLES = [
  { text: "Mechanic", value: "mechanic" },
  { text: "Mechanic Incharge", value: "mechanicIncharge" },
  { text: "Site Incharge", value: "siteIncharge" },
  { text: "Store Manager", value: "storeManager" },
  { text: "Account Manager", value: "accountManager" },
  { text: "Project Manager", value: "projectManager" },
  { text: "admin", value: "admin" },
];

export const EmployeeForm = ({
  initialData,
  onSubmit,
  loading = false,
}: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_name: "",
    blood_group: "",
    age: "",
    adress: "",
    position: "",
    is_active: true,
    shiftcode: "",
    role_id: "",
    org_id: "",
    app_access_role: "", // Add app_access_role to form data
  });

  const [roles, setRoles] = useState<Option[]>([]);
  const [shifts, setShifts] = useState<Option[]>([]);
  const [positions, setPositions] = useState<Option[]>([]);
  const [organisations, setOrganisations] = useState<Option[]>([]);

  // Fetch roles, shifts, positions on mount
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    const fetchData = async () => {
      try {
        const fetchedRoles = await fetchRoles();
        setRoles(fetchedRoles);

        const fetchedShifts = await fetchShifts();
        const mappedShifts = fetchedShifts.map((shift) => ({
          id: shift.id,
          name: shift.shift_code,
        }));
        setShifts(mappedShifts);

        const fetchedPositions = await fetchEmpPositions();
        const mappedPositions = fetchedPositions.map((pos) => ({
          id: pos.id,
          name: pos.designation,
        }));
        setPositions(mappedPositions);

        const fetchedOrgs = await getAllOrganisations();
        const mappedOrgs = fetchedOrgs.map((org) => ({
          id: org.id,
          name: org.org_name,
        }));
        setOrganisations(mappedOrgs);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, [loading, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Fields except the dropdowns and checkbox
  const fields = [
    { label: "Employee ID", name: "emp_id" },
    { label: "Name", name: "emp_name" },
    { label: "Blood Group", name: "blood_group" },
    { label: "Age", name: "age", type: "number" },
    { label: "Address", name: "adress" },
  ];

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
      <div className="flex flex-wrap -mx-3">
        {fields.map((field) => (
          <div key={field.name} className="w-full sm:w-1/2 px-3 mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              min={field.type === "number" ? 0 : undefined}
              name={field.name}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        {/* App Access Role Dropdown */}
        <div className="w-full sm:w-1/2 px-3 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            App Access Role
          </label>
          <select
            name="app_access_role"
            value={formData.app_access_role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select access role</option>
            {APP_ACCESS_ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.text}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Code Dropdown */}
        <div className="w-full sm:w-1/2 px-3 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Shift Code
          </label>
          <select
            name="shiftcode"
            value={formData.shiftcode}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select shift code</option>
            {shifts.map(({ id, name }) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Role ID Dropdown */}
        <div className="w-full sm:w-1/2 px-3 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role ID
          </label>
          <select
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select role</option>
            {roles.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Position Dropdown */}
        <div className="w-full sm:w-1/2 px-3 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Position
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select position</option>
            {positions.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Organisation Dropdown */}
        <div className="w-full sm:w-1/2 px-3 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Organisation
          </label>
          <select
            name="org_id"
            value={formData.org_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select organisation</option>
            {organisations.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Checkbox */}
        <div className="w-full sm:w-1/2 px-3 mb-6 flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Active
          </label>
        </div>
      </div>

      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};