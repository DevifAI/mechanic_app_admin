import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  createItem,
  fetchItemById,
  updateItem,
} from "../../apis/consumableApi";

import { ItemPostPayload } from "../../types/consumableItemTypes";
import { ItemGroup } from "../../types/itemGroupTypes";
import { OEM } from "../../types/oemTypes";
import { UOM } from "../../types/uomTypes";
import { Account } from "../../types/accountTypes";
import { RevenueMaster } from "../../types/revenueMasterTypes.";
import { getAllItemGroups } from "../../apis/intemGroupApi";
import { getAllOEMs } from "../../apis/oemApi";
import { getAllUOMs } from "../../apis/uomApi";
import { getAllAccounts } from "../../apis/accountApi";
import { fetchRevenues } from "../../apis/revenueApi";
import ConsumableBulkUpload from "./ConsumableBulkUpload";

export default function ConsumableFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    itemCode: "",
    name: "",
    description: "",
    type: "",
    make: "",
    uom: "",
    qtyInHand: 0,
    accIn: "",
    accOut: "",
    itemGroup: "",
    revenue: "",
  });

  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [oems, setOems] = useState<OEM[]>([]);
  const [uoms, setUoms] = useState<UOM[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [revenues, setRevenues] = useState<RevenueMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "bulk">("form");

  // Enum options for Product Type
  const PRODUCT_TYPE_OPTIONS = [
    { label: "Goods", value: "Goods" },
    { label: "Services", value: "Services" },
  ];

  useEffect(() => {
    Promise.all([
      getAllItemGroups(),
      getAllOEMs(),
      getAllUOMs(),
      getAllAccounts(),
      fetchRevenues(),
    ])
      .then(([groups, oems, uoms, accounts, revenues]) => {
        setItemGroups(groups);
        setOems(oems);
        setUoms(uoms);
        setAccounts(accounts);
        setRevenues(revenues);
      })
      .catch(() => toast.error("Failed to fetch dropdown data"));
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      fetchItemById(id)
        .then((data) => {
          setFormData({
            itemCode: data.item_code || "",
            name: data.item_name || "",
            description: data.item_description || "",
            type: data.product_type || "",
            make: data.item_make || "",
            uom: data.unit_of_measurement || "",
            qtyInHand: data.item_qty_in_hand || 0,
            accIn: data.inventory_account_code || "",
            accOut: data.expense_account_code || "",
            itemGroup: data.item_group_id || "",
            revenue: data.revenue_account_code || "",
          });
        })
        .catch(() => toast.error("Failed to load consumable"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: ItemPostPayload = {
      item_code: formData.itemCode,
      item_name: formData.name,
      item_description: formData.description,
      product_type: formData.type,
      item_group_id: formData.itemGroup,
      item_make: formData.make,
      unit_of_measurement: formData.uom,
      item_qty_in_hand: formData.qtyInHand,
      item_avg_cost: 0,
      inventory_account_code: formData.accIn,
      expense_account_code: formData.accOut,
      revenue_account_code: formData.revenue,
    };

    try {
      if (isEdit && id) {
        await updateItem(id, payload);
        toast.success("Consumable updated successfully!");
      } else {
        await createItem(payload);
        toast.success("Consumable created successfully!");
      }
      setTimeout(() => navigate("/consumables/view"), 800);
    } catch (err) {
      toast.error("Failed to save consumable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex items-center px-4 py-2 rounded-md transition ${
            activeTab === "form"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          Consumable Form
        </button>
        {!isEdit && (
          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center px-4 py-2 rounded-md transition ${
              activeTab === "bulk"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            <span className="mr-2">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v3.1a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-3.1a.5.5 0 0 1 1 0v3.1A1.5 1.5 0 0 1 15 15H1a1.5 1.5 0 0 1-1.5-1.5v-3.1a.5.5 0 0 1 .5-.5z" />
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 1 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
              </svg>
            </span>
            Bulk Upload
          </button>
        )}
      </div>
      {activeTab === "form" ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {isEdit ? "Edit Consumable" : "Add New Consumable"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <InputField
              label="Item Code"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange}
            />
            <InputField
              label="Item Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <SelectField
              label="Product Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={PRODUCT_TYPE_OPTIONS}
            />

            <SelectField
              label="Item Group"
              name="itemGroup"
              value={formData.itemGroup}
              onChange={handleChange}
              options={itemGroups.map((i) => ({
                label: i.group_name,
                value: i.id,
              }))}
            />
            <SelectField
              label="Item Make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              options={oems.map((o) => ({ label: o.oem_name, value: o.id }))}
            />
            <SelectField
              label="UOM"
              name="uom"
              value={formData.uom}
              onChange={handleChange}
              options={uoms.map((u) => ({ label: u.unit_name, value: u.id }))}
            />
            <InputField
              label="Qty in Hand"
              name="qtyInHand"
              value={formData.qtyInHand}
              onChange={handleChange}
              type="number"
            />
            <SelectField
              label="Inventory Account"
              name="accIn"
              value={formData.accIn}
              onChange={handleChange}
              options={accounts.map((a) => ({
                label: a.account_name,
                value: a.id,
              }))}
            />
            <SelectField
              label="Expense Account"
              name="accOut"
              value={formData.accOut}
              onChange={handleChange}
              options={accounts.map((a) => ({
                label: a.account_name,
                value: a.id,
              }))}
            />
            <SelectField
              label="Revenue Account"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              options={revenues.map((r) => ({
                label: r.revenue_code,
                value: r.id,
              }))}
            />

            <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate("/consumables/view")}
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
        </>
      ) : (
        <ConsumableBulkUpload />
      )}
    </div>
  );
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
}) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
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

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: any;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
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

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: { label: string; value: string }[];
}) => (
  <div>
    <label className="mb-1 text-gray-700 dark:text-gray-200 font-medium">
      {label}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
