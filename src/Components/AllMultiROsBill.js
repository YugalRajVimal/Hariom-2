import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import QuotationPDF from "./QuotationView/QuotationView";
import MultiROInvoicePDF from "./TaxInvoiceView/MultiROTaxInvoiceView";

const AllMultiROBillsNew = () => {
  const [allOrders, setAllOrders] = useState([]); // Initialized as array
  const [searchTerm, setSearchTerm] = useState(""); // Initialized as empty string
  const [publicationSearchTerm, setPublicationSearchTerm] = useState(""); // Added for publication name search
  const [dateFilter, setDateFilter] = useState(""); // Added for date filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const uploadFile = async (order) => {
    try {
      const blob = await pdf(<MultiROInvoicePDF allDetails={order} />).toBlob();
      const formData = new FormData();
      const customOrderId = Array.isArray(order.orderIds)
        ? order.orderIds.join("-")
        : order.orderIds;
      const customName = `invoice-${customOrderId}.pdf`;
      formData.append("file", blob, customName);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/upload-invoice`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error occurred while uploading file", error);
    }
  };

  const previewFile = async (data) => {
    try {
      const previewUrl = `${process.env.REACT_APP_API_URL}/invoice/${data.fileName}`;
      window.open(previewUrl, "_blank");
    } catch (error) {
      console.error("Error occurred while previewing file", error);
    }
  };

  const handlePreviewPDF = async (order) => {
    console.log("Starting handlePreviewPDF function");
    const data = await uploadFile(order);
    console.log("PDF file uploaded", data);
    await previewFile(data);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePublicationSearch = (e) => {
    setPublicationSearchTerm(e.target.value);
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-all-multi-bill`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        console.log(response.data);
        setAllOrders(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[80vw] h-[90vh]">
      <h4 className="mt-6 mx-12 mb-2 text-xl text-left font-semibold transition ease-in-out duration-200">
        All Multiple RO's Bills
      </h4>

      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">List of All Multi ROs Bills</h2>

        <div className="w-full md:w-[95%]">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by OrderId"
              value={searchTerm}
              onChange={handleSearch}
              className="w-1/2 border rounded px-3 py-2 mb-4"
            />

            <input
              type="text"
              placeholder="Search by publication name"
              value={publicationSearchTerm}
              onChange={handlePublicationSearch}
              className="w-1/2 border rounded px-3 py-2 mb-4"
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={handleDateFilter}
            className="w-full border rounded px-3 py-2 mb-4"
          />

          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-purple-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Order Id</th>
                <th className="py-2 px-4 border-b text-left">Client Name</th>

                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-left">
              {allOrders.length > 0 ? (
                allOrders
                  .filter((order) => {
                    // Filter by OrderId
                    const orderIdMatch =
                      searchTerm === "" ||
                      (Array.isArray(order.orderIds) &&
                        order.orderIds.some((id) =>
                          id.toString().includes(searchTerm.trim())
                        ));

                    // Filter by Publication Name
                    // Filter by Client Name
                    const clientNameMatch =
                      publicationSearchTerm === "" ||
                      order.billClientName
                        .toLowerCase()
                        .includes(publicationSearchTerm.toLowerCase());

                    // Filter by Date
                    const dateMatch =
                      dateFilter === "" ||
                      new Date(order.billDate).toISOString().split("T")[0] ===
                        dateFilter;

                    return orderIdMatch && clientNameMatch && dateMatch;
                  })
                  .map((order) => (
                    <tr
                      key={`${order._id}-${order.orderId}`}
                      className="hover:bg-purple-50"
                    >
                      <td className="py-2 px-4 border-b">
                        {new Date(order.billDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {Array.isArray(order.orderIds)
                          ? order.orderIds.join(", ")
                          : order.orderId}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {order.billClientName}
                      </td>
                      <td className="py-2 px-4 border-b">
                        ₹{parseFloat(order.billTotalAmount).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 border-b flex flex-col gap-2 justify-center items-center">
                        <button
                          onClick={() => handlePreviewPDF(order)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Preview Invoice
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No Multi ROs Bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllMultiROBillsNew;
