import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import QuotationPDF from "./QuotationView/QuotationView";
import InvoicePDF from "./TaxInvoiceView/TaxInvoiceView";

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]); // Initialized as array
  const [searchTerm, setSearchTerm] = useState(""); // Initialized as empty string
  const [publicationSearchTerm, setPublicationSearchTerm] = useState(""); // Added for publication name search
  const [dateFilter, setDateFilter] = useState(""); // Added for date filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="w-[75vw] h-[90vh]">
      <h4 className="mt-6 mx-12 mb-2 text-xl text-left font-semibold transition ease-in-out duration-200">
        All Quotations
      </h4>

      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">List of All Quotations</h2>

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
                  .filter((q) => {
                    const qDate = q.roDate ? new Date(q.roDate) : null;
                    const formattedDate =
                      qDate && !isNaN(qDate)
                        ? qDate.toISOString().split("T")[0]
                        : null;

                    return (
                      q.clientName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                      q.publicationName
                        ?.toLowerCase()
                        .includes(publicationSearchTerm.toLowerCase()) &&
                      (!dateFilter || formattedDate === dateFilter)
                    );
                  })

                  .map(
                    (q) =>
                      q.quotationDetailsCompleted && (
                        <tr key={q.orderId} className="hover:bg-purple-50">
                          <td className="py-2 px-4 border-b">
                            {new Date(q.qDate).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4 border-b">{q.orderId}</td>
                          <td className="py-2 px-4 border-b">{q.clientName}</td>
                          <td className="py-2 px-4 border-b">
                            {q.publicationName}
                          </td>
                          <td className="py-2 px-4 border-b">₹{q.qAmount}</td>
                          <td className="py-2 px-4 border-b flex flex-col gap-2 justify-center items-center">
                            <PDFDownloadLink
                              document={<QuotationPDF showQFDetails={q} />}
                              fileName="quotation.pdf"
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                            >
                              {({ loading }) =>
                                loading
                                  ? "Preparing PDF..."
                                  : "Download Quotation"
                              }
                            </PDFDownloadLink>
                            {q.billDetailsCompleted && (
                              <PDFDownloadLink
                                document={
                                  <InvoicePDF allDetails={q} billDetails={q} />
                                }
                                fileName="tax-invoice.pdf"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                              >
                                {({ loading }) =>
                                  loading
                                    ? "Preparing PDF..."
                                    : "Download Tax Invoice"
                                }
                              </PDFDownloadLink>
                            )}
                          </td>
                        </tr>
                      )
                  )
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No Quotations found.
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
