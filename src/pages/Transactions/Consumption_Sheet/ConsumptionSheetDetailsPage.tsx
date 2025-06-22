import { useLocation, useNavigate } from "react-router-dom";
import { DieselRequisition } from "../../../types/dieselRequisition"; // Adjust path if needed

const ConsumptionSheetDetailpage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const requisition: any | null = state?.requisition;

  if (!requisition) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400">
        <p className="mb-4">
          No requisition data available. Please go back to the list.
        </p>
        <button
          onClick={() => navigate("/consumption-sheet/view")}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Consumption Sheet
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <button
        onClick={() => navigate("/consumption-sheet/view")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Consumption Sheet
      </button>

      <h1 className="text-3xl font-bold mb-6">Consumption Sheet Details</h1>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(requisition.date).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Created By:</span>{" "}
            {requisition.createdByUser?.emp_name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Organisation:</span>{" "}
            {requisition.organisation?.org_name || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Mechanic Incharge Approval:</span>{" "}
            <span
              className={
                requisition.is_approved_mic === "approved"
                  ? "text-green-600"
                  : "text-yellow-600"
              }
            >
              {requisition.is_approved_mic || "Pending"}
            </span>
          </p>

          <p>
            <span className="font-semibold">Site Incharge Approval:</span>{" "}
            <span
              className={
                requisition.is_approved_sic === "approved"
                  ? "text-green-600"
                  : requisition.is_approved_sic === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {requisition.is_approved_sic || "Pending"}
            </span>
          </p>

          <p>
            <span className="font-semibold">Project Manager Approval:</span>{" "}
            <span
              className={
                requisition.is_approved_pm === "approved"
                  ? "text-green-600"
                  : "text-yellow-600"
              }
            >
              {requisition.is_approved_pm || "Pending"}
            </span>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">Requisitioned Items</h2>

      <div className="grid gap-4">
        {requisition.items.map((item: any) => (
          <div
            key={item.id}
            className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm"
          >
            <p>
              <span className="font-semibold">Item:</span>{" "}
              {item.itemData?.item_name || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Description:</span>{" "}
              {item.itemData?.item_description || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {item.quantity}{" "}
              {item.uomData?.unit_name || ""}
            </p>
            <p>
              <span className="font-semibold">Notes:</span>{" "}
              {item.notes || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumptionSheetDetailpage;
