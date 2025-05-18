import React, { useEffect, useState } from "react";
import { fetchRoles } from "../../apis/roleApi";
import { fetchShifts } from "../../apis/shiftApi";
import { fetchEmpPositions } from "../../apis/empPositionApi";

type Option = { id: string; name: string };

export const EmployeeForm = ({
  onSubmit,
  loading = false, // add default value
}: {
  onSubmit: (data: any) => void;
  loading?: boolean;
}) => {
  const [formData, setFormData] = useState({
    emp_id: "",
    emp_name: "",
    blood_group: "",
    age: "",
    adress: "",
    position: "",
    is_active: true,
    shiftcode: "", // change from [] to ""
    role_id: "",
  });

  const [roles, setRoles] = useState<Option[]>([]);
  const [shifts, setShifts] = useState<Option[]>([]);
  const [positions, setPositions] = useState<Option[]>([]);

  // Fetch roles, shifts, positions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace these with your actual fetch functions
        const fetchedRoles = await fetchRoles();
        // console.log({ fetchedRoles });
        setRoles(fetchedRoles);

        const fetchedShifts = await fetchShifts();
        // console.log({ fetchedShifts });
        const mappedShifts = fetchedShifts.map((shift) => ({
          id: shift.id,
          name: shift.shift_code, // adjust to your property
        }));
        setShifts(mappedShifts);

        const fetchedPositions = await fetchEmpPositions();
        // console.log({ fetchedPositions });
        const mappedPositions = fetchedPositions.map((pos) => ({
          id: pos.id,
          name: pos.designation, // replace with actual field name from your data
        }));
        setPositions(mappedPositions);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchData();
  }, []);

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

  // Handle changes from MultiSelect component
  //   const handleMultiSelectChange = (field: string, values: string[]) => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [field]: values,
  //     }));
  //   };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Fields except the 3 multi-selects and checkbox
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

        {/* MultiSelect components */}
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

        {/* Checkbox */}
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
