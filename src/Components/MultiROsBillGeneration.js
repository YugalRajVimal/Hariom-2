import axios from "axios";
import React, { useEffect, useState } from "react";
import InvoicePDF from "./TaxInvoiceView/TaxInvoiceView";
import { PDFDownloadLink } from "@react-pdf/renderer";

const MultiROBillGeneration = () => {
  const [allOrders, setAllOrders] = useState([]); // Initialized as array
  const [selectedOrder, setSelectedOrder] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    orderId: 0,
    descHeading: "",
    billDate: "",
    typeOfGST: "CGST+SGST",
    percentageOfGST: 2.5,
    discount: 0, // Added discount field
    address: "", // Added address field
    billAmount: 0, // Added billAmount field
    billTotalAmount: 0, // Added billTotalAmount field
    clientGSTNumber: "", // Added clientGSTNumber field
    amountSummary: "", // Added amountSummary field
    billClientName: "", // Added billClientName field
  });

  const [amountAfterDiscount, setAmountAfterDiscount] = useState(
    formData.billAmount
  );

  const handleAmountInput = (e) => {
    const value = parseFloat(e.target.value);
    const discount = parseFloat(formData.discount) || 0;
    const percentageOfGST = parseFloat(formData.percentageOfGST) || 0;

    const discountedAmount = value - discount;
    setAmountAfterDiscount(discountedAmount);

    let totalAmount = discountedAmount;

    if (formData.typeOfGST === "CGST+SGST") {
      totalAmount =
        discountedAmount + discountedAmount * ((percentageOfGST * 2) / 100);
    } else if (formData.typeOfGST === "IGST") {
      totalAmount =
        discountedAmount + discountedAmount * (percentageOfGST / 100);
    } else {
      alert("Please fill in the Type of GST and Percentage of GST first.");
    }

    setFormData((prev) => ({
      ...prev,
      billAmount: value,
      billTotalAmount: parseFloat(totalAmount.toFixed(2)),
    }));
  };

  const handleTotalAmountInput = (e) => {
    const totalValue = parseFloat(e.target.value);
    const discount = parseFloat(formData.discount) || 0;
    const percentageOfGST = parseFloat(formData.percentageOfGST) || 0;

    let baseAmount = totalValue;

    if (formData.typeOfGST === "CGST+SGST") {
      baseAmount = totalValue / (1 + (percentageOfGST * 2) / 100);
    } else if (formData.typeOfGST === "IGST") {
      baseAmount = totalValue / (1 + percentageOfGST / 100);
    } else {
      alert("Please fill in the Type of GST and Percentage of GST first.");
    }

    const billAmountBeforeDiscount = baseAmount + discount;
    setAmountAfterDiscount(baseAmount);

    setFormData((prev) => ({
      ...prev,
      billTotalAmount: totalValue,
      billAmount: parseFloat(billAmountBeforeDiscount.toFixed(2)),
    }));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      billAmount: 0,
      billTotalAmount: 0,
    }));
    setAmountAfterDiscount(0);
  }, [formData.discount, formData.percentageOfGST, formData.typeOfGST]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-all-orders`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        setAllOrders(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSaveBillDetails = async () => {
    const order = allOrders.find((order) => order.orderId == formData.orderId);
    if (order) {
      setSelectedOrder(order);
      console.log(selectedOrder);
    } else {
      alert("Wrong Order ID");
      setFormData({
        orderId: 0,
        descHeading: "",
        billDate: "",
        discount: 0,
        address: "", // Reset address field
        billAmount: 0, // Reset billAmount field
        billTotalAmount: 0, // Reset billTotalAmount field
        clientGSTNumber: "", // Reset clientGSTNumber field
        amountSummary: "", // Reset amountSummary field
        billClientName: "", // Reset billClientName field
      });
      return;
    }

    if (
      !selectedOrder.commonDetailsCompleted ||
      !selectedOrder.releasedOrderDetailsCompleted
    ) {
      alert("RO must be completed before saving bill details.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/save-bill`,
        {
          orderId: formData.orderId,
          descHeading: formData.descHeading,
          billDate: formData.billDate,
          typeOfGST: formData.typeOfGST,
          percentageOfGST: parseFloat(formData.percentageOfGST),
          discount: parseFloat(formData.discount), // Added discount to the request
          address: formData.address, // Added address to the request
          billAmount: formData.billAmount, // Added billAmount to the request
          billTotalAmount: parseFloat(formData.billTotalAmount), // Added billTotalAmount to the request
          clientGSTNumber: formData.clientGSTNumber, // Added clientGSTNumber to the request
          amountSummary: formData.amountSummary, // Added amountSummary to the request
          billClientName: formData.billClientName, // Added billClientName to the request
        },
        {
          headers: { Authorization: `${token}` },
        }
      );
      if (response.status === 200) {
        alert("Bill Details saved");
      }
    } catch (err) {
      alert(err);
      console.error("Failed to save bill:", err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log(formData.orderId);
      if (formData.orderId > 0) {
        const order = allOrders.find(
          (order) => order.orderId == formData.orderId
        );
        if (order) {
          setSelectedOrder(order);
          setFormData((prev) => ({
            ...prev,
            billClientName: order.clientName,
          }));
          console.log(selectedOrder);
        } else {
          alert("Wrong Order ID");
          setFormData((prev) => ({
            ...prev,
            orderId: 0,
            discount: 0,
            address: "",
            billAmount: "",
            billTotalAmount: 0, // Reset billTotalAmount field
            clientGSTNumber: "", // Reset clientGSTNumber field
            amountSummary: "", // Reset amountSummary field
            billClientName: "", // Reset billClientName field
          })); // Reset discount, address, billAmount, billTotalAmount, clientGSTNumber, and amountSummary fields
        }
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData.orderId]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[80vw] h-[90vh] bg-white  p-8 space-y-6">
      <h4 className="text-3xl font-bold text-gray-800 border-b pb-3">
        Multiple RO's Bill Generation
      </h4>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page refresh
          handleSaveBillDetails(); // Your function to save data
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="flex justify-around w-full gap-4">
            <div className="w-1/4">
              <label
                htmlFor="orderId"
                className="block text-sm font-medium text-gray-700"
              >
                Order ID
                <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="number"
                id="orderId"
                name="orderId"
                value={formData.orderId}
                onChange={(e) =>
                  setFormData({ ...formData, orderId: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/4">
              <label
                htmlFor="billDate"
                className="block text-sm font-medium text-gray-700"
              >
                Bill Date
                <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="date"
                id="billDate"
                name="billDate"
                value={formData.billDate}
                onChange={(e) =>
                  setFormData({ ...formData, billDate: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/4">
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700"
              >
                Bill Discount
                <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 w-2/3">
              <div className=" w-1/2">
                <label
                  htmlFor="typeOfGST"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type of GST
                  <span className="text-red-600">*</span>
                </label>
                <select
                  id="typeOfGST"
                  name="typeOfGST"
                  value={formData.typeOfGST}
                  onChange={(e) =>
                    setFormData({ ...formData, typeOfGST: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select GST type
                  </option>
                  <option value="CGST+SGST">CGST+SGST</option>
                  <option value="IGST">IGST</option>
                </select>
              </div>

              <div className=" w-1/2">
                <label
                  htmlFor="percentageOfGST"
                  className="block text-sm font-medium text-gray-700"
                >
                  Percentage of GST
                  <span className="text-red-600">*</span>
                </label>
                <select
                  id="percentageOfGST"
                  name="percentageOfGST"
                  value={formData.percentageOfGST}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      percentageOfGST: e.target.value,
                    })
                  }
                  className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select GST percentage
                  </option>
                  <option value={2.5}>2.5%</option>
                  <option value={5}>5%</option>
                  <option value={6.1}>6.1%</option>
                  <option value={9}>9%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={24}>24%</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-around w-full gap-4">
            <div className="w-1/4">
              <label
                htmlFor="descHeading"
                className="block text-sm font-medium text-gray-700"
              >
                Description Heading
              </label>
              <input
                type="text"
                id="descHeading"
                name="descHeading"
                value={formData.descHeading}
                onChange={(e) =>
                  setFormData({ ...formData, descHeading: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/4">
              <label
                htmlFor="billAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount
                <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="number"
                id="billAmount"
                name="billAmount"
                value={formData.billAmount}
                onChange={(e) => {
                  setFormData({ ...formData, billAmount: e.target.value });
                  handleAmountInput(e);
                }}
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/4">
              <label
                htmlFor="billTotalAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount after Discount
              </label>
              <input
                type="number"
                id=""
                name=""
                value={amountAfterDiscount}
                disabled
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/4">
              <label
                htmlFor="billTotalAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Total Amount
                <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="number"
                id="billTotalAmount"
                name="billTotalAmount"
                value={formData.billTotalAmount}
                onChange={(e) => {
                  setFormData({ ...formData, billTotalAmount: e.target.value });
                  handleTotalAmountInput(e);
                }}
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-around w-full gap-4">
          <div className="w-1/4">
            <label
              htmlFor="billClientName"
              className="block text-sm font-medium text-gray-700"
            >
              Bill Client Name
            </label>
            <input
              type="text"
              id="billClientName"
              name="billClientName"
              value={formData.billClientName}
              onChange={(e) =>
                setFormData({ ...formData, billClientName: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-1/4">
            <label
              htmlFor="clientGSTNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Client GST Number
            </label>
            <input
              type="text"
              id="clientGSTNumber"
              name="clientGSTNumber"
              value={formData.clientGSTNumber}
              onChange={(e) =>
                setFormData({ ...formData, clientGSTNumber: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-1/4">
            <label
              htmlFor="amountSummary"
              className="block text-sm font-medium text-gray-700"
            >
              Amount Summary
            </label>
            <input
              type="text"
              id="amountSummary"
              name="amountSummary"
              value={formData.amountSummary}
              onChange={(e) =>
                setFormData({ ...formData, amountSummary: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-1/4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
              <span className="text-red-600">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-around w-full gap-4"></div>

        <div className="flex justify-center pb-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md font-medium transition"
          >
            Save Bill Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiROBillGeneration;
