import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEquipment,
  updateEquipment,
  fetchEquipmentById,
} from "../../apis/equipmentApi";
import { toast, ToastContainer } from "react-toastify";
import { FaCogs, FaDollarSign, FaTag, FaCalendarAlt } from "react-icons/fa";
import { fetchEquipmentGroups } from "../../apis/equipmentGroupApi";

export default function EquipmentFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [equipmentGroups, setEquipmentGroups] = useState<
    { value: string; label: string }[]
  >([]);

  const [formData, setFormData] = useState({
    equipmentName: "",
    serialNo: "",
    additionalId: "",
    purchaseDate: "",
    oem: "",
    purchaseCost: 0,
    equipmentManual: "",
    maintenanceLog: "",
    otherLog: "",
    projectTag: "",
    equipmentGroup: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch equipment groups for select options
    fetchEquipmentGroups()
      .then((groups) => {
        setEquipmentGroups(
          groups.map((g) => ({
            value: g.id,
            label: g.equipment_group,
          }))
        );
      })
      .catch(() => toast.error("Failed to load equipment groups"));
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchEquipmentById(id)
        .then((data) => {
          setFormData({
            equipmentName: data.equipment_name,
            serialNo: data.equipment_sr_no,
            additionalId: data.additional_id,
            purchaseDate: data.purchase_date,
            oem: data.oem,
            purchaseCost: data.purchase_cost,
            equipmentManual: data.equipment_manual,
            maintenanceLog: JSON.stringify(data.maintenance_log ?? ""),
            otherLog: JSON.stringify(data.other_log ?? ""),
            projectTag: JSON.stringify(data.project_tag ?? ""),
            equipmentGroup: data.equipment_group_id,
          });
        })
        .catch(() => toast.error("Failed to load equipment"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  function safeParse(jsonString: string) {
    try {
      return jsonString ? JSON.parse(jsonString) : {};
    } catch {
      return {};
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      equipment_name: formData.equipmentName,
      equipment_sr_no: formData.serialNo,
      additional_id: formData.additionalId,
      purchase_date: formData.purchaseDate,
      oem: formData.oem,
      purchase_cost: Number(formData.purchaseCost),
      equipment_manual: formData.equipmentManual,
      maintenance_log: safeParse(formData.maintenanceLog),
      other_log: safeParse(formData.otherLog),
      project_tag: safeParse(formData.projectTag),
      equipment_group_id: formData.equipmentGroup,
    };

    setLoading(true);
    try {
      if (isEdit && id) {
        await updateEquipment(id, payload);
        toast.success("Equipment updated successfully!");
      } else {
        await createEquipment(payload);
        toast.success("Equipment created successfully!");
      }
      setTimeout(() => navigate("/equipments/view"), 800);
    } catch (error) {
      toast.error("Failed to save equipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {isEdit ? "Edit Equipment" : "Add New Equipment"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            icon={<FaCogs />}
            label="Equipment Name"
            name="equipmentName"
            value={formData.equipmentName}
            onChange={handleChange}
          />
          <InputField
            icon={<FaTag />}
            label="Serial No"
            name="serialNo"
            value={formData.serialNo}
            onChange={handleChange}
          />
          <InputField
            icon={<FaTag />}
            label="Additional ID"
            name="additionalId"
            value={formData.additionalId}
            onChange={handleChange}
          />
          <div className="relative">
            <InputField
              icon={<FaCalendarAlt />}
              label="Purchase Date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              type="date"
              inputRef={dateInputRef}
            />
            <FaCalendarAlt
              className="absolute right-3 top-9 text-gray-400 cursor-pointer"
              onClick={() => dateInputRef.current?.showPicker?.()}
              style={{ pointerEvents: "auto" }}
            />
          </div>
          <InputField
            icon={<FaCogs />}
            label="OEM"
            name="oem"
            value={formData.oem}
            onChange={handleChange}
          />
          <InputField
            icon={<FaDollarSign />}
            label="Purchase Cost"
            name="purchaseCost"
            value={formData.purchaseCost}
            onChange={handleChange}
            type="number"
          />
          <div className="md:col-span-2">
            <TextAreaField
              icon={<FaCogs />}
              label="Equipment Manual"
              name="equipmentManual"
              value={formData.equipmentManual}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaField
              icon={<FaCogs />}
              label="Maintenance Log"
              name="maintenanceLog"
              value={formData.maintenanceLog}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaField
              icon={<FaCogs />}
              label="Other Log"
              name="otherLog"
              value={formData.otherLog}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaField
              icon={<FaCogs />}
              label="Project Tag"
              name="projectTag"
              value={formData.projectTag}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-2">
            <SelectField
              icon={<FaCogs />}
              label="Equipment Group"
              name="equipmentGroup"
              value={formData.equipmentGroup}
              onChange={handleChange}
              options={equipmentGroups}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/equipments/view")}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update"
              : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Reuse your InputField, TextAreaField, and SelectField from your modal (copy them here)
const InputField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  inputRef,
}: any) => (
  <div>
    <label className="flex items-center mb-1 text-gray-700 dark:text-gray-200 font-medium">
      <span className="mr-2">{icon}</span>
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      ref={inputRef}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    />
  </div>
);

const TextAreaField = ({ icon, label, name, value, onChange }: any) => (
  <div>
    <label className="flex items-center mb-1 text-gray-700 dark:text-gray-200 font-medium">
      <span className="mr-2">{icon}</span>
      {label}
    </label>
    <textarea
      name={name}
      rows={3}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    />
  </div>
);

const SelectField = ({ icon, label, name, value, onChange, options }: any) => (
  <div>
    <label className="flex items-center mb-1 text-gray-700 dark:text-gray-200 font-medium">
      <span className="mr-2">{icon}</span>
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      <option value="">Select Group</option>
      {options.map((group: { value: string; label: string }) => (
        <option key={group.value} value={group.value}>
          {group.label}
        </option>
      ))}
    </select>
  </div>
);
