import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DownloadTemplateButtonForConsumableItems() {
  const handleDownload = () => {
    const worksheetData = [
      [
        "item_code",
        "item_name",
        "item_description",
        "product_type", // "Goods" or "Services"
        "item_group_name",
        "item_make_name",
        "unit_of_measurement_name",
        "item_qty_in_hand",
        "item_avg_cost",
        "inventory_account_code_name",
        "expense_account_code_name",
        "revenue_account_code_name",
      ],
      [
        "ITEM001",
        "Printer Ink",
        "High-quality ink cartridge",
        "Goods",
        "Diesel",
        "OEM1",
        "Litre",
        "100",
        "299.99",
        "Inventory Account",
        "Expense Account",
        "REV-002",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ConsumableItemsTemplate");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "ConsumableItemsTemplate.xlsx");
  };

  return (
    <button
      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
      onClick={handleDownload}
    >
      <FaDownload className="mr-2" />
      Download Consumable Items Upload Template
    </button>
  );
}
