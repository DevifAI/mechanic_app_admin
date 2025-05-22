import React from "react";
import {
  FaMapMarkerAlt,
  FaIdCard,
  FaUser,
  FaCheck,
  FaTimes,
  FaBuilding,
} from "react-icons/fa";

const PartnerDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  partner: any;
}> = ({ isOpen, onClose, partner }) => {
  if (!isOpen || !partner) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-opacity-30 transition-opacity pointer-events-auto"
        onClick={onClose}
        style={{ zIndex: 1 }}
      />
      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 2 }}
      >
        <div className="relative h-full flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close drawer"
          >
            <FaTimes
              className="text-gray-500 hover:text-red-500 dark:text-gray-300"
              size={20}
            />
          </button>
          <div className="p-6 overflow-y-auto pt-12">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg mr-4">
                <FaUser
                  className="text-blue-600 dark:text-blue-300"
                  size={24}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {partner.partner_name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Partner Details
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaBuilding className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Address
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {partner.partner_address}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaIdCard className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    GST
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {partner.partner_gst}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaMapMarkerAlt className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Geo ID
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {partner.partner_geo_id}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaCheck className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Is Customer
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {partner.isCustomer ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <FaCheck className="text-gray-500 dark:text-gray-300 mr-2" />
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    Active
                  </h3>
                </div>
                <p className="text-gray-800 dark:text-gray-200 pl-6">
                  {partner.isActive ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDrawer;
