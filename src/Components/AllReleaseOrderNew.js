import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import ReleasedOrderPDF from "./ReleasedOrderView/ReleasedOrderView"; // Only keep this one if it's the PDF component
import InvoicePDF from "./TaxInvoiceView/TaxInvoiceView";

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]); // Initialized as array
  const [searchTerm, setSearchTerm] = useState(""); // Initialized as empty string
  const [publicationSearchTerm, setPublicationSearchTerm] = useState(""); // Added for publication name search
  const [dateFilter, setDateFilter] = useState(""); // Added for date filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handlePreviewPDF = async (ro) => {
    const blob = await pdf(
      <ReleasedOrderPDF orderId={ro.orderId} showRODetails={ro} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
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

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[80vw] h-[90vh]">
      <h4 className="mt-6 mx-12 mb-2 text-xl text-left font-semibold transition ease-in-out duration-200">
        All Released Orders
      </h4>

      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">List of All Released Orders</h2>

        <div className="w-full md:w-[95%]">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by client name"
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
                <th className="py-2 px-4 border-b text-left">
                  Publication Name
                </th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="text-left">
              {allOrders.length > 0 ? (
                allOrders
                  .filter((ro) => {
                    const roDate = ro.roDate ? new Date(ro.roDate) : null;
                    const formattedDate =
                      roDate && !isNaN(roDate)
                        ? roDate.toISOString().split("T")[0]
                        : null;

                    return (
                      ro.clientName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                      ro.publicationName
                        ?.toLowerCase()
                        .includes(publicationSearchTerm.toLowerCase()) &&
                      (!dateFilter || formattedDate === dateFilter)
                    );
                  })

                  .map(
                    (ro) =>
                      ro.releasedOrderDetailsCompleted && (
                        <tr
                          key={ro.orderId}
                          className={`hover:bg-purple-50 ${
                            !ro.billDetailsCompleted && "bg-red-200"
                          }`}
                        >
                          <td className="py-2 px-4 border-b">
                            {new Date(ro.roDate).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4 border-b">{ro.orderId}</td>
                          <td className="py-2 px-4 border-b">
                            {ro.clientName}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {ro.publicationName}
                          </td>
                          <td className="py-2 px-4 border-b">₹{ro.roAmount.toFixed(2)}</td>
                          <td className="py-2 px-4 border-b">
                            {/* <PDFDownloadLink
                              document={
                                <ReleasedOrderPDF
                                  orderId={ro.orderId}
                                  showRODetails={ro}
                                />
                              }
                              fileName="released_order.pdf"
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                            >
                              {({ loading }) =>
                                loading ? "Preparing PDF..." : "Download R.O."
                              }
                            </PDFDownloadLink> */}
                            <button
                              onClick={() => handlePreviewPDF(ro)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                            >
                              Preview R.O.
                            </button>
                          </td>
                        </tr>
                      )
                  )
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No Released Orders found.
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

export default AllOrders;
