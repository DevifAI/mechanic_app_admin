import { useLocation, useNavigate } from "react-router-dom";

const MaterialTransactionPageDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const transaction = state?.transaction;
  console.log({ transaction });
  if (!transaction) {
    return (
      <div className="p-6 text-red-600 dark:text-red-400">
        <p className="mb-4">
          No transaction data available. Please go back to the list.
        </p>
        <button
          onClick={() => navigate("/material-transactions/view")}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to Material Transactions
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
      <button
        onClick={() => navigate("/material-transactions/view")}
        className="text-blue-600 dark:text-blue-400 hover:underline mb-6"
      >
        ← Back to Material Transactions
      </button>

      <h1 className="text-3xl font-bold mb-6">Material Transaction Details</h1>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Transaction Information
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {transaction.date.split("-").reverse().join("-")}
            </p>
            <p>
              <span className="font-semibold">Type:</span>{" "}
              {transaction.data_type === "material_in"
                ? "Material In"
                : "Material Out"}
            </p>
            <p>
              <span className="font-semibold">Reason Type:</span>{" "}
              {transaction.type}
            </p>

            <p>
              <span className="font-semibold">Challan No:</span>{" "}
              {transaction.challan_no || "N/A"}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Approval Status</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Project Manager:</span>{" "}
              <span
                className={
                  transaction.is_approve_pm === "approved"
                    ? "text-green-600"
                    : transaction.is_approve_pm === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {transaction.is_approve_pm === "approved"
                  ? "Approved"
                  : transaction.is_approve_pm === "rejected"
                  ? "Rejected"
                  : "Pending"}
              </span>
            </p>
            {transaction.partnerDetails && (
              <p>
                <span className="font-semibold">Partner:</span>{" "}
                {transaction.partnerDetails.partner_name || "N/A"}
              </p>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Transaction Items</h2>
      {transaction.formItems && transaction.formItems.length > 0 ? (
        <div className="grid gap-4">
          {transaction.formItems.map((item: any, index: number) => (
            <div
              key={index}
              className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-sm"
            >
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <p>
                  <span className="font-semibold">Item:</span>{" "}
                  {item.consumableItem?.item_name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Code:</span>{" "}
                  {item.consumableItem?.item_code || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Quantity:</span> {item.qty}{" "}
                  {item.unitOfMeasure?.unit_name || ""}
                </p>
                <p className="md:col-span-3">
                  <span className="font-semibold">Description:</span>{" "}
                  {item.consumableItem?.item_description || "N/A"}
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
          No items found in this transaction.
        </p>
      )}
    </div>
  );
};

export default MaterialTransactionPageDetails;
