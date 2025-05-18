import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createRevenue,
  updateRevenue,
  fetchRevenueById,
} from "../../apis/revenueApi";
import { toast, ToastContainer } from "react-toastify";
import { FaCode, FaAlignLeft, FaMoneyBill } from "react-icons/fa";

export default function RevenueFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    revenueCode: "",
    description: "",
    revenueValue: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchRevenueById(id)
        .then((data) => {
          setFormData({
            revenueCode: data.revenue_code,
            description: data.revenue_description,
            revenueValue: data.revenue_value.toString(),
          });
        })
        .catch(() => toast.error("Failed to load revenue"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      revenue_code: formData.revenueCode,
      revenue_description: formData.description,
      revenue_value: Number(formData.revenueValue),
    };
    setLoading(true);
    try {
      if (isEdit && id) {
        await updateRevenue(id, payload);
        toast.success("Revenue updated successfully!");
      } else {
        await createRevenue(payload);
        toast.success("Revenue created successfully!");
      }
      setTimeout(() => navigate("/revenues/view"), 800);
    } catch (error) {
      toast.error("Failed to save revenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {isEdit ? "Edit Revenue" : "Add New Revenue"}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <InputField
          icon={<FaCode />}
          label="Revenue Code"
          name="revenueCode"
          value={formData.revenueCode}
          onChange={handleChange}
        />
        <InputField
          icon={<FaAlignLeft />}
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <InputField
          icon={<FaMoneyBill />}
          label="Revenue Value"
          name="revenueValue"
          value={formData.revenueValue}
          onChange={handleChange}
          type="number"
        />
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/revenues/view")}
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

// Reusable Input Field Component
const InputField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
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
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
