import { useLocation, useNavigate } from "react-router-dom";
import { DieselRequisition } from "../../../types/dieselRequisition"; // Adjust as needed

const DieselRequisitionDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const requisition: DieselRequisition | null = state?.requisition;

  if (!requisition) {
    return (
      <div className="p-6 text-red-500">
        No requisition data available. Please go back to the list.
        <button
          onClick={() => navigate("/diesel-requisitions")}
          className="block mt-4 text-blue-600 hover:underline"
        >
          ← Back to Diesel Requisitions
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/diesel-requisition/view")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Diesel Requisitions
      </button>

      <h1 className="text-2xl font-semibold mb-4">Diesel Requisition Details</h1>
      <p><strong>Date:</strong> {new Date(requisition.date).toLocaleDateString()}</p>
      <p><strong>Created By:</strong> {requisition.createdByEmployee?.emp_name}</p>
      <p><strong>Organisation:</strong> {requisition.organisation?.org_name}</p>
     <p>
  <strong>Is Approved By Mechanic Incharge:</strong>{" "}
  {requisition.is_approve_mic ? "Approved" : "Pending"}
</p>

<p>
  <strong>Is Approved By Site Incharge:</strong>{" "}
  {requisition.is_approve_sic === true
    ? "Approved"
    : requisition.is_approve_sic === false
    ? "Rejected"
    : "Pending"}
</p>

<p>
  <strong>Is Approved By Project Manager:</strong>{" "}
  {requisition.is_approve_pm ? "Approved" : "Pending"}
</p>


      <h2 className="text-xl font-semibold mt-6 mb-2">Items</h2>
      <ul className="space-y-3">
        {requisition.items.map((item) => (
          <li key={item.id} className="border rounded p-4 dark:border-gray-700">
            <p><strong>Item:</strong> {item.consumableItem.item_name}</p>
            <p><strong>Description:</strong> {item.consumableItem.item_description}</p>
            <p><strong>Quantity:</strong> {item.quantity} {item.unitOfMeasurement.unit_name}</p>
            <p><strong>Notes:</strong> {item.Notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DieselRequisitionDetailsPage;
