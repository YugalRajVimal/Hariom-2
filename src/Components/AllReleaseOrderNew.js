import React, { useState, useEffect } from "react";
import axios from "axios";
// import * as XLSX from "xlsx";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

import { pdf } from "@react-pdf/renderer";
import ReleasedOrderPDF from "./ReleasedOrderView/ReleasedOrderView";

// const AllOrders = () => {
//   const [allOrders, setAllOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/get-all-orders`,
//           {
//             headers: { Authorization: `${token}` },
//           }
//         );

//         setAllOrders(response.data || []);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch data.");
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   // 🔽 Excel Download Handler

//   if (loading) return <p>Loading data...</p>;
//   if (error) return <p>{error}</p>;

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]); // Initialized as array
  const [searchTerm, setSearchTerm] = useState(""); // Initialized as empty string
  const [publicationSearchTerm, setPublicationSearchTerm] = useState(""); // Added for publication name search
  const [dateFilter, setDateFilter] = useState(""); // Added for date filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDateBox, setShowDateBox] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const uploadFile = async (ro) => {
    console.log("Starting uploadFile function for release order", ro.orderId);
    try {
      const blob = await pdf(
        <ReleasedOrderPDF orderId={ro.orderId} showRODetails={ro} />
      ).toBlob();
      console.log("Blob created for release order", ro.orderId);
      const formData = new FormData();
      const customName = `RO.No.${ro.orderId}.pdf`;
      formData.append("file", blob, customName);
      console.log("FormData prepared for release order", ro.orderId);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/upload-release-order`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Fetch completed for release order", ro.orderId);
      const data = await res.json();
      console.log("Data received for release order", ro.orderId, data);
      return data;
    } catch (error) {
      console.error(
        "Error occurred while uploading file for release order",
        ro.orderId,
        error
      );
    }
  };

  const previewFile = async (data) => {
    console.log("Starting previewFile function for file", data.fileName);
    try {
      const previewUrl = `${process.env.REACT_APP_API_URL}/release-order/${data.fileName}`;
      console.log("Preview URL generated for file", data.fileName, previewUrl);
      window.open(previewUrl, "_blank");
      console.log("File preview opened for file", data.fileName);
    } catch (error) {
      console.error(
        "Error occurred while previewing file",
        data.fileName,
        error
      );
    }
  };

  const handlePreviewPDF = async (ro) => {
    console.log(
      "Starting handlePreviewPDF function for release order",
      ro.orderId
    );
    const data = await uploadFile(ro);
    console.log("PDF file uploaded for release order", ro.orderId, data);
    await previewFile(data);
    console.log("PDF file previewed for release order", ro.orderId);
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

  const downloadExcel = (orders = allOrders) => {
    if (!orders || orders.length === 0) {
      alert("No data to export");
      return;
    }

    // Map orders into flat JSON for Excel
    const dataForExcel = orders.map((ro) => ({
      orderId: ro.orderId,
      publicationName: ro.publicationName,
      roDate: ro.roDate ? new Date(ro.roDate).toLocaleDateString("en-GB") : "",
      agencyCode: ro.agencyCode,
      code: ro.code,
      hui: ro.hui,
      orderRefId: ro.orderRefId,
      category: ro.category,
      clientName: ro.clientName,
      dateOfInsertion: ro.dateOfInsertion,
      position: ro.position,
      roRate: ro.roRate,
      roWidth: ro.roWidth,
      roHeight: ro.roHeight,
      scheme: ro.scheme,
      roAmount: ro.roAmount,
      remark: ro.remark,
      agencyCommission1: ro.agencyCommission1,
      agencyCommission2: ro.agencyCommission2,
      agencyCommission3: ro.agencyCommission3,
      roTotalAmount: ro.roTotalAmount,
      percentageOfGST: ro.percentageOfGST,
    }));

    const headers = Object.keys(dataForExcel[0]);

    // Build sheet data: header row + data rows
    const sheetData = [
      headers,
      ...dataForExcel.map((row) => headers.map((h) => row[h] ?? "")),
    ];

    // Create worksheet from array-of-arrays so we control header row
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Auto-adjust column widths (with min & max caps)
    worksheet["!cols"] = headers.map((header) => {
      const maxLen = Math.max(
        header.length,
        ...dataForExcel.map((r) =>
          r[header] !== undefined && r[header] !== null
            ? r[header].toString().length
            : 0
        )
      );
      const wch = Math.min(Math.max(maxLen + 2, 10), 50); // min 10, max 50
      return { wch };
    });

    // Which keys are numeric (right-align these)
    const numericKeys = new Set([
      "roRate",
      "roWidth",
      "roHeight",
      "roAmount",
      "agencyCommission1",
      "agencyCommission2",
      "agencyCommission3",
      "roTotalAmount",
      "percentageOfGST",
    ]);

    // Apply styles row-by-row
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellRef];
        if (!cell) continue;

        // Header row
        if (R === 0) {
          cell.s = {
            font: { name: "Calibri", sz: 12, bold: true },
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText: true,
            },
            fill: { patternType: "solid", fgColor: { rgb: "FFE2E8F0" } }, // ARGB (FF + hex)
          };
        } else {
          const headerForCol = headers[C];
          const isNumeric = numericKeys.has(headerForCol);

          cell.s = {
            font: { name: "Calibri", sz: 10 },
            alignment: {
              horizontal: isNumeric ? "right" : "center",
              vertical: "center",
              wrapText: true,
            },
          };

          // Ensure numeric cells are typed as numbers when possible
          const raw = dataForExcel[R - 1][headerForCol]; // R-1 because first data row maps to R=1
          if (isNumeric && raw !== null && raw !== undefined && raw !== "") {
            const num = Number(raw);
            if (!Number.isNaN(num)) {
              cell.t = "n";
              cell.v = num;
            }
          }
        }
      }
    }

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ReleasedOrders");

    // Write and save
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "ReleasedOrders.xlsx"
    );
  };

  const handleDownloadByDateRange = () => {
    console.log("handleDownloadByDateRange called.");
    console.log("From Date:", fromDate);
    console.log("To Date:", toDate);

    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date");
      console.log("Validation failed: From Date or To Date is missing.");
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);
    console.log("Parsed 'from' date:", from);
    console.log("Parsed 'to' date:", to);

    // filter orders
    const filteredOrders = allOrders.filter((order) => {
      if (!order.roDate) {
        // console.log("Order skipped: roDate is missing for order", order); // Can be too verbose
        return false;
      }
      const orderDate = new Date(order.roDate);
      const isWithinRange = orderDate >= from && orderDate <= to;
      // console.log(`Order ID: ${order.id}, RO Date: ${order.roDate}, Parsed Date: ${orderDate}, Within Range: ${isWithinRange}`); // Can be too verbose
      return isWithinRange;
    });

    console.log("Total orders before filtering:", allOrders.length);
    console.log("Filtered orders count:", filteredOrders.length);
    console.log("Filtered orders:", filteredOrders);


    if (filteredOrders.length === 0) {
      alert("No orders found in the selected date range");
      console.log("No orders found after filtering.");
      return;
    }

    // pass filteredOrders into downloadExcel
    console.log("Calling downloadExcel with filtered orders.");
    downloadExcel(filteredOrders);
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[80vw] h-[90vh]">
      <h4 className="mt-6 mx-12 mb-2 text-xl text-left font-semibold transition ease-in-out duration-200">
        All Released Orders
      </h4>

      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        {/* <h2 className="text-2xl font-bold mb-4">List of All Released Orders</h2> */}

        <div className="flex flex-col md:flex-row  justify-between mb-4 w-full">
          <h2 className="text-2xl font-bold mb-4">
            List of All Released Orders
          </h2>
          <button
            onClick={() => setShowDateBox(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Download Excel
          </button>
        </div>
        {showDateBox && (
          <div className="absolute z-50 top-0 left-0 bg-black/50 h-screen w-screen">
            <div className="relative h-screen w-screen">
              <button
                className="absolute top-4 right-4 text-white text-4xl md:text-7xl font-bold z-50"
                onClick={() => {
                  /* TODO: Add logic to close the overlay, e.g., setShowPdfPreview(false) */
                  setShowDateBox(false);
                }}
              >
                &times;
              </button>
              <div className="p-10 md:p-20 bg-white rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center">
                <h3 className="text-xl font-semibold mb-2">
                  Download Excel Sheet
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="fromDate"
                      className="text-sm font-medium text-gray-700 mb-1"
                    >
                      From Date:
                    </label>
                    <input
                      type="date"
                      id="fromDate"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="toDate"
                      className="text-sm font-medium text-gray-700 mb-1"
                    >
                      To Date:
                    </label>

                    <input
                      type="date"
                      id="toDate"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <button
                  onClick={handleDownloadByDateRange}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mt-4"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

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
                          <td className="py-2 px-4 border-b">
                            ₹{ro.roAmount.toFixed(2)}
                          </td>
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
