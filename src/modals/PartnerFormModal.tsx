import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaReceipt,
  FaGlobe,
} from "react-icons/fa";
import { createCustomer, updateCustomer } from "../apis/customerApi";

interface PartnerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  partner?: any;
}

const PartnerFormModal: React.FC<PartnerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  partner,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gst: "",
    geoId: "",
    isCustomer: true,
  });

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.partner_name || "",
        address: partner.partner_address || "",
        gst: partner.partner_gst || "",
        geoId: partner.partner_geo_id || "",
        isCustomer: partner.isCustomer ?? true,
      });
    } else {
      setFormData({
        name: "",
        address: "",
        gst: "",
        geoId: "",
        isCustomer: true,
      });
    }
  }, [partner]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    // Map formData to backend payload
    const payload = {
      partner_name: formData.name,
      partner_address: formData.address,
      partner_gst: formData.gst,
      partner_geo_id: formData.geoId,
      isCustomer: formData.isCustomer,
    };

    try {
      if (partner && partner.id) {
        await updateCustomer(partner.id, payload);
      } else {
        await createCustomer(payload);
      }
      onSubmit(payload);
      onClose();
    } catch (error) {
      console.error("Failed to save partner", error);
      // Optionally show a toast or error message here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999999 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] z-10 dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <FaTimes className="text-gray-500 dark:text-gray-300" size={20} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {partner ? "Edit Partner" : "Add New Partner"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            icon={<FaUser />}
            label="Partner Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <InputField
            icon={<FaReceipt />}
            label="GST"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
          />

          <InputField
            icon={<FaGlobe />}
            label="Geo ID"
            name="geoId"
            value={formData.geoId}
            onChange={handleChange}
            type="number"
          />

          <div className="md:col-span-2">
            <TextAreaField
              icon={<FaMapMarkerAlt />}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center space-x-4 md:col-span-2">
            <label className="text-gray-700 dark:text-gray-200 font-medium">
              Is Customer
            </label>
            <input
              type="checkbox"
              name="isCustomer"
              checked={formData.isCustomer}
              onChange={handleChange}
              className="w-5 h-5"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {partner ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerFormModal;

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
