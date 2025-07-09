import axios from "axios";
import React, { useEffect, useState } from "react";
import InvoicePDF from "./TaxInvoiceView/TaxInvoiceView";
import { PDFDownloadLink } from "@react-pdf/renderer";

const BillGeneration = () => {
  const [allOrders, setAllOrders] = useState([]); // Initialized as array
  const [selectedOrder, setSelectedOrder] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    orderId: 0,
    descHeading: "",
    billDate: "",
    typeOfGST: "",
    percentageOfGST: 2.5,
    discount: 0, // Added discount field
    address: "", // Added address field
    qRate: "", // Added qRate field
  });

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
        qRate: "", // Reset qRate field
      });
      return;
    }

    if (
      !selectedOrder.commonDetailsCompleted ||
      !selectedOrder.releasedOrderDetailsCompleted
    ) {
      alert("RO and Quotation must be completed before saving bill details.");
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
          qRate: formData.qRate, // Added qRate to the request
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
          console.log(selectedOrder);
        } else {
          alert("Wrong Order ID");
          setFormData((prev) => ({
            ...prev,
            orderId: 0,
            discount: 0,
            address: "",
            qRate: "",
          })); // Reset discount, address, and qRate fields
        }
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [formData.orderId]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[75vw]  h-full bg-white shadow-lg  p-8 space-y-6">
      <h4 className="text-3xl font-bold text-gray-800 border-b pb-3">
        Bill Generation
      </h4>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent page refresh
          handleSaveBillDetails(); // Your function to save data
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700"
            >
              Order ID
            </label>
            <input
              type="number"
              id="orderId"
              name="orderId"
              value={formData.orderId}
              onChange={(e) =>
                setFormData({ ...formData, orderId: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
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
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="billDate"
              className="block text-sm font-medium text-gray-700"
            >
              Bill Date
            </label>
            <input
              type="date"
              id="billDate"
              name="billDate"
              value={formData.billDate}
              onChange={(e) =>
                setFormData({ ...formData, billDate: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 w-full">
            <div className=" w-1/2">
              <label
                htmlFor="typeOfGST"
                className="block text-sm font-medium text-gray-700"
              >
                Type of GST
              </label>
              <select
                id="typeOfGST"
                name="typeOfGST"
                value={formData.typeOfGST}
                onChange={(e) =>
                  setFormData({ ...formData, typeOfGST: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              </label>
              <select
                id="percentageOfGST"
                name="percentageOfGST"
                value={formData.percentageOfGST}
                onChange={(e) =>
                  setFormData({ ...formData, percentageOfGST: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div>
            <label
              htmlFor="discount"
              className="block text-sm font-medium text-gray-700"
            >
              Bill Discount
            </label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={(e) =>
                setFormData({ ...formData, discount: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="qRate"
              className="block text-sm font-medium text-gray-700"
            >
              Q Rate
            </label>
            <input
              type="text"
              id="qRate"
              name="qRate"
              value={formData.qRate}
              onChange={(e) =>
                setFormData({ ...formData, qRate: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center pb-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md font-medium transition"
          >
            Save Bill Details
          </button>
        </div>
      </form>
      {/* {selectedOrder?.commonDetailsCompleted &&
        selectedOrder?.releasedOrderDetailsCompleted &&
        formData.orderId &&
        formData.billDate &&
        formData.descHeading &&
        formData.discount &&
        formData.address &&
        formData.qRate && (
          <PDFDownloadLink
            document={
              <InvoicePDF allDetails={selectedOrder} billDetails={formData} />
            }
            fileName="tax-invoice.pdf"
            className="w-full sm:w-auto"
          >
            {({ loading }) =>
              loading ? (
                <button
                  disabled
                  className="w-full sm:w-auto px-6 py-2 bg-gray-400 text-white rounded-lg shadow-md"
                >
                  Preparing PDF...
                </button>
              ) : (
                <button className="w-full sm:w-auto px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md font-medium transition my-10">
                  Download Tax Invoice
                </button>
              )
            }
          </PDFDownloadLink>
        )} */}
    </div>
  );
};

export default BillGeneration;
