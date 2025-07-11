import React, { useState, useEffect } from "react";
import axios from "axios";
import getROAndQFDetails from "../../APICalls/getROAndQFDetails";
import ReleasedOrderView from "../ReleasedOrderView/ReleasedOrderView";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReleasedOrderPDF from "../ReleasedOrderView/ReleasedOrderView";
import InvoicePDF from "../TaxInvoiceView/TaxInvoiceView";

// Sample data for publications (for dropdown)
const samplePublications = ["Acme Publishing", "Globex Media", "Initech Press"];

// Initial state for Released Orders (ROs)
const initialReleasedOrders = [];

const initialEditState = {
  clientId: "",
  clientName: "",
  publicationId: "",
  publicationName: "",
  insertionDate: "",
  position: "",
  category: "",
  noOfAds: "",
  orderRefNo: "",
  hui: "",
  schemaMaterial: "",
  width: "",
  height: "",
  rate: "",
  agency1: "",
  agency2: "",
  agency3: "",
  remark: "",
  roNo: "", // Added roNo to the initial state
};

const sampleClients = [
  { clientId: "1", clientName: "Acme Corp", email: "contact@acme.com" },
  { clientId: "2", clientName: "Globex Inc", email: "info@globex.com" },
  { clientId: "3", clientName: "Initech", email: "support@initech.com" },
];

function calculateAmount(width, height, rate, noOfAds) {
  const w = parseFloat(width) || 0;
  const h = parseFloat(height) || 0;
  const r = parseFloat(rate) || 0;
  const n = parseInt(noOfAds) || 0;
  return w * h * r * n;
}

function calculatetotalCommission(amount, c1, c2, c3) {
  const a = parseFloat(amount) || 0;
  const comm1 = parseFloat(c1) || 0;
  const comm2 = parseFloat(c2) || 0;
  const comm3 = parseFloat(c3) || 0;
  return (a * (comm1 + comm2 + comm3)) / 100;
}

function calculateTotalAmount(amount, totalCommission) {
  const a = parseFloat(amount) || 0;
  const tc = parseFloat(totalCommission) || 0;
  return a - tc;
}

const AllReleasedOrders = () => {
  const [releasedOrders, setReleasedOrders] = useState(initialReleasedOrders);
  const [showRODetails, setShowRODetails] = useState(false);
  const [editRO, setEditRO] = useState(null);
  const [editForm, setEditForm] = useState(initialEditState);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReleasedOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-all-released-orders`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setReleasedOrders(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching released orders: ", error);
      }
    };
    fetchReleasedOrders();
  }, []);

  const [clients, setClients] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [clientRes, publisherRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/get-all-clients`, {
            headers: { Authorization: `${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/get-all-publishers`, {
            headers: { Authorization: `${token}` },
          }),
        ]);
        console.log(clientRes.data);
        console.log(publisherRes.data);

        setClients(clientRes.data || []);
        setPublishers(publisherRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handler to show RO details
  const handleShowRODetails = (ro) => {
    setShowRODetails(ro);
  };

  // Handler to close RO details modal
  const handleCloseRODetails = () => {
    setShowRODetails(null);
  };

  // Handler for download RO (simulate download)
  const handleDownloadRO = (ro) => {
    // In real app, use ro.roUrl
    alert(`Downloading Released Order for ${ro.roId}`);
  };

  // Handler to open Edit RO modal
  const handleEditRO = (ro, idx) => {
    setEditRO({ ...ro, idx });
    setEditForm({
      quotationFormNo: ro.quotationFormNo,
      clientId: ro.clientId,
      clientName: ro.clientName,
      publicationId: ro.publicationId,
      publicationName: ro.publicationName,
      insertionDate: ro.insertionDate,
      position: ro.position,
      category: ro.category,
      noOfAds: ro.noOfAds,
      orderRefNo: ro.orderRefNo,
      hui: ro.hui,
      schemaMaterial: ro.schemaMaterial,
      width: ro.width,
      height: ro.height,
      rate: ro.rate,
      agency1: ro.agency1,
      agency2: ro.agency2,
      agency3: ro.agency3,
      remark: ro.remark,
      roNo: ro.roNo, // Added roNo to the edit form
    });
  };

  // Handler to close Edit RO modal
  const handleCloseEditRO = () => {
    setEditRO(null);
    setEditForm(initialEditState);
  };

  // Handler for edit form change
  const handleEditFormChange = (e) => {
    const { name, value, type } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "number" ? value.replace(/^0+/, "") : value,
    }));
  };

  // Handler for edit form radio change
  const handleEditFormRadio = (e) => {
    setEditForm((prev) => ({
      ...prev,
      hui: e.target.value,
    }));
  };

  // Handler to save edited RO
  const handleSaveEditRO = async (e) => {
    e.preventDefault();
    // Calculate derived fields
    const amount = calculateAmount(
      editForm.width,
      editForm.height,
      editForm.rate,
      editForm.noOfAds
    );
    const totalCommission = calculatetotalCommission(
      amount,
      editForm.agency1,
      editForm.agency2,
      editForm.agency3
    );
    const totalAmount = calculateTotalAmount(amount, totalCommission);

    // Validate required fields
    const requiredFields = [
      "clientId",
      "clientName",
      "publicationId",
      "publicationName",
      "insertionDate",
      "position",
      "category",
      "noOfAds",
      "orderRefNo",
      "hui",
      "schemaMaterial",
      "width",
      "height",
      "rate",
      "remark",
      "roNo", // Added roNo to the required fields
    ];
    for (let field of requiredFields) {
      if (
        editForm[field] === "" ||
        editForm[field] === null ||
        (typeof editForm[field] === "string" && editForm[field].trim() === "")
      ) {
        alert("Please fill all required fields.");
        return;
      }
    }

    // Update the RO in the list
    setReleasedOrders((prev) => {
      const updated = [...prev];
      updated[editRO.idx] = {
        ...updated[editRO.idx],
        ...editForm,
        amount: amount,
        totalCommission: totalCommission,
        totalAmount: totalAmount,
      };
      return updated;
    });

    // Save the edited RO to the server
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/edit-released-order`,
        {
          ...editForm,
          amount: amount,
          totalCommission: totalCommission,
          totalAmount: totalAmount,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error saving edited RO: ", error);
    }

    handleCloseEditRO();
  };

  // Handler for search by client name
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDownloadBill = async (roId) => {
    const res = await getROAndQFDetails(roId);
    console.log(res);
  };

  const handleClientIdName = (e) => {
    const { name, value } = e.target;
    const selectedClient = clients.find(
      (client) => client.clientName === value
    );
    if (selectedClient) {
      setEditForm((prev) => ({ ...prev, [`${name}Id`]: selectedClient._id }));
      setEditForm((prev) => ({
        ...prev,
        [`${name}Name`]: selectedClient.clientName,
      }));
    }
  };

  const handlePublisherIdName = (e) => {
    const { name, value } = e.target;
    const selectedPublisher = publishers.find(
      (publisher) => publisher.publisherName === value
    );
    if (selectedPublisher) {
      setEditForm((prev) => ({
        ...prev,
        [`${name}Id`]: selectedPublisher._id,
      }));
      setEditForm((prev) => ({
        ...prev,
        [`${name}Name`]: selectedPublisher.publisherName,
      }));
    }
  };

  return (
    <div className="w-[80vw] h-[90vh]">
      <h4 className=" transition ease-in-out duration-200 mt-6 mx-12 mb-2 text-xl text-left font-semibold">
        All Released Orders
      </h4>
      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">List of All Released Orders</h2>
        <div className="w-full md:w-[95%]">
          <input
            type="text"
            placeholder="Search by client name"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border rounded px-2 py-1 mb-4"
          />
          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-purple-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">RO No.</th>
                <th className="py-2 px-4 border-b text-left">QF No.</th>

                <th className="py-2 px-4 border-b text-left">Client Name</th>
                <th className="py-2 px-4 border-b text-left">Publication</th>
                <th className="py-2 px-4 border-b text-left">
                  Date of Insertion
                </th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {releasedOrders && releasedOrders.length > 0 ? (
                releasedOrders
                  .filter((ro) =>
                    ro.clientName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((ro, idx) => (
                    <tr key={ro.roId} className="hover:bg-purple-50">
                      <td className="py-2 px-4 border-b">{ro.roNo}</td>
                      <td className="py-2 px-4 border-b">
                        {ro.quotationFormNo}
                      </td>

                      <td className="py-2 px-4 border-b">{ro.clientName}</td>
                      <td className="py-2 px-4 border-b">
                        {ro.publicationName}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(ro.insertionDate).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border-b">₹{ro.amount}</td>
                      <td className="py-2 px-4 border-b flex flex-col gap-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => handleShowRODetails(ro)}
                        >
                          Show RO Details
                        </button>
                        <PDFDownloadLink
                          document={<ReleasedOrderPDF showRODetails={ro} />}
                          fileName="released_order.pdf"
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-center"
                        >
                          {({ loading }) =>
                            loading ? (
                              <button disabled>Preparing PDF...</button>
                            ) : (
                              <button>Download RO</button>
                            )
                          }
                        </PDFDownloadLink>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                          onClick={() => handleEditRO(ro, idx)}
                        >
                          Edit R.O.
                        </button>
                      </td>
                    </tr>
                  ))
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

        {/* RO Details Modal */}
        {showRODetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={handleCloseRODetails}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">
                Released Order Details: {showRODetails.roId}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                <div>
                  <strong>RO No.:</strong> {showRODetails.roNo}
                </div>
                <div>
                  <strong>QF No.:</strong> {showRODetails.quotationFormNo}
                </div>
                <div>
                  <strong>Client Name:</strong> {showRODetails.clientName}
                </div>
                <div>
                  <strong>Publication Name:</strong>{" "}
                  {showRODetails.publicationName}
                </div>
                <div>
                  <strong>Date of Insertion:</strong>{" "}
                  {new Date(showRODetails.insertionDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Position:</strong> {showRODetails.position}
                </div>
                <div>
                  <strong>Category:</strong> {showRODetails.category}
                </div>
                <div>
                  <strong>No. of ads:</strong> {showRODetails.noOfAds}
                </div>
                <div>
                  <strong>Order / Reference No.:</strong>{" "}
                  {showRODetails.orderRefNo}
                </div>
                <div>
                  <strong>Hui:</strong> {showRODetails.hui}
                </div>
                <div>
                  <strong>Schema Material:</strong>{" "}
                  {showRODetails.schemaMaterial}
                </div>
                <div>
                  <strong>Width in cm:</strong> {showRODetails.width}
                </div>
                <div>
                  <strong>Height in cm:</strong> {showRODetails.height}
                </div>
                <div>
                  <strong>Rate:</strong> {showRODetails.rate}
                </div>
                <div>
                  <strong>Amount:</strong> ₹{showRODetails.amount}
                </div>
                <div>
                  <strong>Agency Commision 1 (%):</strong>{" "}
                  {showRODetails.agency1}
                </div>
                <div>
                  <strong>Agency Commision 2 (%):</strong>{" "}
                  {showRODetails.agency2}
                </div>
                <div>
                  <strong>Agency Commision 3 (%):</strong>{" "}
                  {showRODetails.agency3}
                </div>
                <div>
                  <strong>Total Commision:</strong> ₹
                  {showRODetails.totalCommission}
                </div>
                <div>
                  <strong>Total Amount:</strong> ₹{showRODetails.totalAmount}
                </div>
                <div className="md:col-span-2">
                  <strong>Remark/ Code / QRN:</strong> {showRODetails.remark}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleCloseRODetails}
                >
                  Close
                </button>
                <PDFDownloadLink
                  document={<ReleasedOrderPDF showRODetails={showRODetails} />}
                  fileName="released_order.pdf"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  {({ loading }) =>
                    loading ? (
                      <button disabled>Preparing PDF...</button>
                    ) : (
                      <button>Download RO</button>
                    )
                  }
                </PDFDownloadLink>
              </div>
            </div>
          </div>
        )}

        {/* Edit RO Modal */}
        {editRO && (
          <div className="absolute h-screen w-full max-w-5xl z-50 flex items-start justify-center overflow-y-auto shadow-lg shadow-black">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative mt-[30px] shadow-lg shadow-black">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
                onClick={handleCloseEditRO}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">
                Edit Released Order: {editRO.roNo}
              </h3>
              <form onSubmit={handleSaveEditRO}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <div>
                    <label className="block font-medium mb-1">RO No.</label>
                    <input
                      type="text"
                      value={editRO.roNo}
                      disabled
                      className="w-full border rounded px-2 py-1 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Quotation Form No.
                    </label>
                    <input
                      type="text"
                      name="quotationFormNo"
                      value={editForm.quotationFormNo}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="client"
                      value={editForm.clientName}
                      onChange={handleClientIdName}
                      required
                      className="w-full border rounded px-2 py-1"
                    >
                      <option defaultValue={editForm.clientName} value="">
                        Select Client
                      </option>
                      {clients.map((client) => (
                        <option key={client._id} value={client.clientName}>
                          {client.clientName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1">
                      Publication Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="publication"
                      value={editForm.publicationName}
                      onChange={handlePublisherIdName}
                      required
                      className="w-full border rounded px-2 py-1"
                    >
                      <option defaultValue={editForm.publisherName} value="">
                        Select Publication
                      </option>
                      {publishers.map((pub) => (
                        <option key={pub._id} value={pub.publisherName}>
                          {pub.publisherName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Date of Insertion <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="insertionDate"
                      value={editForm.insertionDate}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={editForm.position}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={editForm.category}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      No. of ads <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="noOfAds"
                      min="1"
                      value={editForm.noOfAds}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Order / Reference No.{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="orderRefNo"
                      value={editForm.orderRefNo}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Hui <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4 mt-1">
                      <label>
                        <input
                          type="radio"
                          name="hui"
                          value="B/W"
                          checked={editForm.hui === "B/W"}
                          onChange={handleEditFormRadio}
                          required
                        />{" "}
                        B/W
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="hui"
                          value="Color"
                          checked={editForm.hui === "Color"}
                          onChange={handleEditFormRadio}
                          required
                        />{" "}
                        Color
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Schema Material <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="schemaMaterial"
                      value={editForm.schemaMaterial}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Width in cm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="width"
                      step="0.01"
                      min="0"
                      value={editForm.width}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Height in cm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="height"
                      step="0.01"
                      min="0"
                      value={editForm.height}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Rate <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="rate"
                      min="0"
                      value={editForm.rate}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Amount <span className="text-gray-400">(Auto)</span>
                    </label>
                    <input
                      type="number"
                      value={calculateAmount(
                        editForm.width,
                        editForm.height,
                        editForm.rate,
                        editForm.noOfAds
                      )}
                      disabled
                      className="w-full border rounded px-2 py-1 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Agency Commision 1 (%)
                    </label>
                    <input
                      type="number"
                      name="agency1"
                      min="0"
                      value={editForm.agency1}
                      onChange={handleEditFormChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Agency Commision 2 (%)
                    </label>
                    <input
                      type="number"
                      name="agency2"
                      min="0"
                      value={editForm.agency2}
                      onChange={handleEditFormChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Agency Commision 3 (%)
                    </label>
                    <input
                      type="number"
                      name="agency3"
                      min="0"
                      value={editForm.agency3}
                      onChange={handleEditFormChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Total Commision{" "}
                      <span className="text-gray-400">(Auto)</span>
                    </label>
                    <input
                      type="number"
                      value={calculatetotalCommission(
                        calculateAmount(
                          editForm.width,
                          editForm.height,
                          editForm.rate,
                          editForm.noOfAds
                        ),
                        editForm.agency1,
                        editForm.agency2,
                        editForm.agency3
                      )}
                      disabled
                      className="w-full border rounded px-2 py-1 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Total Amount <span className="text-gray-400">(Auto)</span>
                    </label>
                    <input
                      type="number"
                      value={calculateTotalAmount(
                        calculateAmount(
                          editForm.width,
                          editForm.height,
                          editForm.rate,
                          editForm.noOfAds
                        ),
                        calculatetotalCommission(
                          calculateAmount(
                            editForm.width,
                            editForm.height,
                            editForm.rate,
                            editForm.noOfAds
                          ),
                          editForm.agency1,
                          editForm.agency2,
                          editForm.agency3
                        )
                      )}
                      disabled
                      className="w-full border rounded px-2 py-1 bg-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-1">
                      Remark/ Code / QRN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="remark"
                      value={editForm.remark}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleCloseEditRO}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllReleasedOrders;

// import React from "react";

// const ReleasedOrderView = (props) => {

//     const {handleCloseRODetails, showRODetails, handleDownloadRO} = props;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
//         <button
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
//           onClick={handleCloseRODetails}
//           aria-label="Close"
//         >
//           &times;
//         </button>
//         <h3 className="text-xl font-semibold mb-4">
//           Released Order Details: {showRODetails.roId}
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
//           <div>
//             <strong>RO No.:</strong> {showRODetails.roNo}
//           </div>
//           <div>
//             <strong>QF No.:</strong> {showRODetails.quotationFormNo}
//           </div>
//           <div>
//             <strong>Client Name:</strong> {showRODetails.clientName}
//           </div>
//           <div>
//             <strong>Publication Name:</strong> {showRODetails.publicationName}
//           </div>
//           <div>
//             <strong>Date of Insertion:</strong> {showRODetails.insertionDate}
//           </div>
//           <div>
//             <strong>Position:</strong> {showRODetails.position}
//           </div>
//           <div>
//             <strong>Category:</strong> {showRODetails.category}
//           </div>
//           <div>
//             <strong>No. of ads:</strong> {showRODetails.noOfAds}
//           </div>
//           <div>
//             <strong>Order / Reference No.:</strong> {showRODetails.orderRefNo}
//           </div>
//           <div>
//             <strong>Hui:</strong> {showRODetails.hui}
//           </div>
//           <div>
//             <strong>Schema Material:</strong> {showRODetails.schemaMaterial}
//           </div>
//           <div>
//             <strong>Width in cm:</strong> {showRODetails.width}
//           </div>
//           <div>
//             <strong>Height in cm:</strong> {showRODetails.height}
//           </div>
//           <div>
//             <strong>Rate:</strong> {showRODetails.rate}
//           </div>
//           <div>
//             <strong>Amount:</strong> ₹{showRODetails.amount}
//           </div>
//           <div>
//             <strong>Agency Commision 1 (%):</strong> {showRODetails.agency1}
//           </div>
//           <div>
//             <strong>Agency Commision 2 (%):</strong> {showRODetails.agency2}
//           </div>
//           <div>
//             <strong>Agency Commision 3 (%):</strong> {showRODetails.agency3}
//           </div>
//           <div>
//             <strong>Total Commision:</strong> ₹{showRODetails.totalCommission}
//           </div>
//           <div>
//             <strong>Total Amount:</strong> ₹{showRODetails.totalAmount}
//           </div>
//           <div className="md:col-span-2">
//             <strong>Remark/ Code / QRN:</strong> {showRODetails.remark}
//           </div>
//         </div>
//         <div className="flex justify-end gap-2">
//           <button
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//             onClick={handleCloseRODetails}
//           >
//             Close
//           </button>
//           <button
//             className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
//             onClick={() => handleDownloadRO(showRODetails)}
//           >
//             Download RO
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReleasedOrderView;
