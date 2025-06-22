import { useLocation, useNavigate } from "react-router-dom";

const MaintenanceLogDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const maintenanceLog = state?.maintenanceLog;

  if (!maintenanceLog) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400">
        <p className="mb-4">
          No maintenance log data available. Please go back to the list.
        </p>
        <button
          onClick={() => navigate("/maintenance-log/view")}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Maintenance Logs
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <button
        onClick={() => navigate("/maintenance-log/view")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Maintenance Logs
      </button>

      <h1 className="text-3xl font-bold mb-6">Maintenance Log Details</h1>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Maintenance Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(maintenanceLog.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Created By:</span>{" "}
              {maintenanceLog.createdByUser?.emp_name}
            </p>
            <p>
              <span className="font-semibold">Organisation:</span>{" "}
              {maintenanceLog.organisation?.org_name}
            </p>
            <p>
              <span className="font-semibold">Next Maintenance Date:</span>{" "}
              {maintenanceLog.next_date
                ? new Date(maintenanceLog.next_date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Approval Status</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Mechanic Incharge:</span>{" "}
              <span
                className={
                  maintenanceLog.is_approved_mic === "approved"
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              >
                {maintenanceLog.is_approved_mic === "approved"
                  ? "Approved"
                  : "Pending"}
              </span>
            </p>
            <p>
              <span className="font-semibold">Site Incharge:</span>{" "}
              <span
                className={
                  maintenanceLog.is_approved_sic === "approved"
                    ? "text-green-600"
                    : maintenanceLog.is_approved_sic === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {maintenanceLog.is_approved_sic === "approved"
                  ? "Approved"
                  : maintenanceLog.is_approved_sic === "rejected"
                  ? "Rejected"
                  : "Pending"}
              </span>
            </p>
            <p>
              <span className="font-semibold">Project Manager:</span>{" "}
              <span
                className={
                  maintenanceLog.is_approved_pm === "approved"
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              >
                {maintenanceLog.is_approved_pm === "approved"
                  ? "Approved"
                  : "Pending"}
              </span>
            </p>
            {maintenanceLog.reject_reason && (
              <p>
                <span className="font-semibold">Rejection Reason:</span>{" "}
                <span className="text-red-600">
                  {maintenanceLog.reject_reason}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Equipment Details</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {maintenanceLog.equipmentData?.equipment_name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Serial No:</span>{" "}
            {maintenanceLog.equipmentData?.equipment_sr_no || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Additional ID:</span>{" "}
            {maintenanceLog.equipmentData?.additional_id || "N/A"}
          </p>
          <p>
            <span className="font-semibold">OEM:</span>{" "}
            {maintenanceLog.equipmentData?.oem || "N/A"}
          </p>
          <p>
            <span className="font-semibold">HSN Number:</span>{" "}
            {maintenanceLog.equipmentData?.hsn_number || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Purchase Date:</span>{" "}
            {maintenanceLog.equipmentData?.purchase_date
              ? new Date(
                  maintenanceLog.equipmentData.purchase_date
                ).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Maintenance Notes</h2>
        <p className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 whitespace-pre-line">
          {maintenanceLog.notes || "No notes available"}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Action Planned</h2>
        <p className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 whitespace-pre-line">
          {maintenanceLog.action_planned || "No action planned"}
        </p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Items Used</h2>
      {maintenanceLog.items && maintenanceLog.items.length > 0 ? (
        <div className="grid gap-4">
          {maintenanceLog.items.map((item: any) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm"
            >
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <p>
                  <span className="font-semibold">Item:</span>{" "}
                  {item.itemData?.item_name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Code:</span>{" "}
                  {item.itemData?.item_code || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span>{" "}
                  {item.quantity} {item.uomData?.unit_name || ""}
                </p>
                <p className="md:col-span-2">
                  <span className="font-semibold">Description:</span>{" "}
                  {item.itemData?.item_description || "N/A"}
                </p>
                {item.notes && (
                  <p className="md:col-span-3">
                    <span className="font-semibold">Notes:</span> {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          No items were used in this maintenance.
        </p>
      )}
    </div>
  );
};

export default MaintenanceLogDetailsPage;
