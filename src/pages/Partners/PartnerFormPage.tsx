import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../apis/customerApi";
import { toast } from "react-toastify";
import {
  FaUser,
  FaMapMarkerAlt,
  FaReceipt,
  FaGlobe,
} from "react-icons/fa";

export default function PartnerFormPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    partner_name: "",
    partner_address: "",
    partner_gst: "",
    partner_geo_id: "",
    isCustomer: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCustomer(formData);
      toast.success("Partner created successfully!");
      navigate("/partners/view");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create partner."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <FaUser className="text-blue-600" /> Create Partner
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            <span className="inline-flex items-center gap-2">
              <FaUser /> Partner Name
            </span>
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="partner_name"
              value={formData.partner_name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            <span className="inline-flex items-center gap-2">
              <FaReceipt /> GST
            </span>
          </label>
          <div className="relative">
            <FaReceipt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="partner_gst"
              value={formData.partner_gst}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            <span className="inline-flex items-center gap-2">
              <FaGlobe /> Geo ID
            </span>
          </label>
          <div className="relative">
            <FaGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="partner_geo_id"
              value={formData.partner_geo_id}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
            <span className="inline-flex items-center gap-2">
              <FaMapMarkerAlt /> Address
            </span>
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
            <textarea
              name="partner_address"
              value={formData.partner_address}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isCustomer"
            checked={formData.isCustomer}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700 dark:text-gray-200">
            Is Customer
          </label>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/partners/view")}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}