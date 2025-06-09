import { useLocation, useNavigate } from "react-router-dom";
import { DieselRequisition } from "../../../types/dieselRequisition"; // Adjust path as needed

const DieselRequisitionDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const requisition: DieselRequisition | null = state?.requisition;

  if (!requisition) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400">
        <p className="mb-4">No requisition data available. Please go back to the list.</p>
        <button
          onClick={() => navigate("/diesel-requisitions")}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Diesel Requisitions
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <button
        onClick={() => navigate("/diesel-requisition/view")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Diesel Requisitions
      </button>

      <h1 className="text-3xl font-bold mb-6">Diesel Requisition Details</h1>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p><span className="font-semibold">Date:</span> {new Date(requisition.date).toLocaleDateString()}</p>
          <p><span className="font-semibold">Created By:</span> {requisition.createdByEmployee?.emp_name}</p>
          <p><span className="font-semibold">Organisation:</span> {requisition.organisation?.org_name}</p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Mechanic Incharge Approval:</span>{" "}
            <span className={requisition.is_approve_mic ? "text-green-600" : "text-yellow-600"}>
              {requisition.is_approve_mic ? "Approved" : "Pending"}
            </span>
          </p>

          <p>
            <span className="font-semibold">Site Incharge Approval:</span>{" "}
            <span
              className={
                requisition.is_approve_sic === true
                  ? "text-green-600"
                  : requisition.is_approve_sic === false
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {requisition.is_approve_sic === true
                ? "Approved"
                : requisition.is_approve_sic === false
                ? "Rejected"
                : "Pending"}
            </span>
          </p>

          <p>
            <span className="font-semibold">Project Manager Approval:</span>{" "}
            <span className={requisition.is_approve_pm ? "text-green-600" : "text-yellow-600"}>
              {requisition.is_approve_pm ? "Approved" : "Pending"}
            </span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Requisitioned Items</h2>

      <div className="grid gap-4">
        {requisition.items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm"
          >
            <p><span className="font-semibold">Item:</span> {item.consumableItem.item_name}</p>
            <p><span className="font-semibold">Description:</span> {item.consumableItem.item_description}</p>
            <p>
              <span className="font-semibold">Quantity:</span> {item.quantity}{" "}
              {item.unitOfMeasurement.unit_name}
            </p>
            <p><span className="font-semibold">Notes:</span> {item.Notes || "N/A"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DieselRequisitionDetailsPage;
