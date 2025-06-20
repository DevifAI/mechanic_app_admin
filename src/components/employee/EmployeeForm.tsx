import React, { useEffect, useState } from "react";
import { fetchRoles } from "../../apis/roleApi";
import { fetchShifts } from "../../apis/shiftApi";
// import { fetchEmpPositions } from "../../apis/empPositionApi";
import { getAllOrganisations } from "../../apis/organisationApi";
import { State, City } from "country-state-city";

type Option = { id: string; name: string };

type EmployeeFormProps = {
  initialData?: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
};

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
    app_access_role: "",
    state: "",
    city: "",
    pincode: "",
    acc_holder_name: "",
    bank_name: "",
    acc_no: "",
    ifsc_code: "",
  });

  const [roles, setRoles] = useState<Option[]>([]);
  const [shifts, setShifts] = useState<Option[]>([]);
  // const [positions, setPositions] = useState<Option[]>([]);
  const [organisations, setOrganisations] = useState<Option[]>([]);
  const [states] = useState(State.getStatesOfCountry("IN"));
  const [cities, setCities] = useState<any[]>([]);


  console.log({ initialData })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, shiftsData,  orgsData] = await Promise.all([
          fetchRoles(),
          fetchShifts(),
          // fetchEmpPositions(),
          getAllOrganisations(),
        ]);

        setRoles(rolesData);
        setShifts(shiftsData.map(s => ({ id: s.id, name: s.shift_code })));
       
        setOrganisations(orgsData.map(o => ({ id: o.id, name: o.org_name })));

        // If editing, populate fields and cities from state
        if (initialData) {
          setFormData(initialData);

          const stateMatch = states.find(s => s.name === initialData.state);
          if (stateMatch) {
            const cityData = City.getCitiesOfState("IN", stateMatch.isoCode);
            setCities(cityData);
          }
        }
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    fetchData();
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateCode = e.target.value;
    const selectedState = states.find((s) => s.isoCode === selectedStateCode);

    setFormData((prev) => ({
      ...prev,
      state: selectedState?.name || "",
      city: "",
    }));

    setCities(City.getCitiesOfState("IN", selectedStateCode));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      city: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(formData.age) < 0 || parseInt(formData.age) > 100) {
      alert("Age must be between 0 and 100");
      return;
    }
    onSubmit(formData);
  };

  const inputField = (
    label: string,
    name: string,
    type: string = "text",
    required: boolean = true
  ) => (
    <div className="w-full sm:w-1/2 px-3 mb-4">
      <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <div className="flex flex-wrap -mx-3">
        {inputField("Employee ID", "emp_id")}
        {inputField("Name", "emp_name")}
        {inputField("Blood Group", "blood_group")}
        {inputField("Age", "age", "number")}
        {inputField("Address", "adress")}

        {/* Dropdowns */}
        <div className="w-full sm:w-1/2 px-3 mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Shift Code <span className="text-red-500">*</span>
          </label>
          <select
            name="shiftcode"
            value={formData.shiftcode}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Shift</option>
            {shifts.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2 px-3 mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Role ID <span className="text-red-500">*</span>
          </label>
          <select
            name="role_id"
            value={formData.role_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2 px-3 mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            App Access Role <span className="text-red-500">*</span>
          </label>
          <select
            name="app_access_role"
            value={formData.app_access_role}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Role</option>
            {APP_ACCESS_ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.text}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-1/2 px-3 mb-4">
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            Organisation <span className="text-red-500">*</span>
          </label>
          <select
            name="org_id"
            value={formData.org_id}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Organisation</option>
            {organisations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="w-full px-3 mb-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={states.find((s) => s.name === formData.state)?.isoCode || ""}
                onChange={handleStateChange}
                required
                className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.city}
                onChange={handleCityChange}
                required
                disabled={!formData.state}
                className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              {inputField("Pincode", "pincode")}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="w-full px-3 mb-6">
          <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3">Bank Details</h3>
          <div className="flex flex-wrap -mx-3">
            {inputField("Account Holder Name", "acc_holder_name")}
            {inputField("Bank Name", "bank_name")}
            {inputField("Account Number", "acc_no")}
            {inputField("IFSC Code", "ifsc_code")}
          </div>
        </div>

        {/* Active checkbox */}
        <div className="w-full sm:w-1/2 px-3 mb-6 flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600"
          />
          <label className="text-sm text-gray-700 dark:text-gray-300">Active</label>
        </div>
      </div>

      <div className="text-right px-3">
        <button
          type="submit"
          disabled={loading}
          className={`inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};
