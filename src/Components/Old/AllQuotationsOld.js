import axios from "axios";
import React, { useState, useEffect } from "react";

import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import QuotationPDF from "../QuotationView/QuotationView";

const AllQuotationForm = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const handlePreviewPDF = async (quotation) => {
    const blob = await pdf(
      <QuotationPDF showQFDetails={quotation} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-all-quotations`,
          { headers: { Authorization: `${token}` } }
        );
        console.log(response.data);
        setQuotations(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initialEditState = {
    quotationFormNumber: "",
    clientId: "",
    clientName: "",
    publicationId: "",
    publication: "",
    date: "",
    address: "",
    subject: "",
    hui: "",
    size: "",
    rate: "",
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

  // Handler to close Edit RO modal
  const handleCloseEditQF = () => {
    setEditQF(null);
    setEditForm(initialEditState);
  };

  const [editQF, setEditQF] = useState(null);
  const [editForm, setEditForm] = useState(initialEditState);

  // Handler to open Edit RO modal
  const handleEditQF = (qf, idx) => {
    setEditQF({ ...qf, idx });
    setEditForm({
      quotationFormNumber: qf.quotationFormNumber,
      clientId: qf.clientId,
      clientName: qf.clientName,
      publicationId: qf.publicationId,
      publication: qf.publication,
      date: qf.date,
      address: qf.address,
      subject: qf.subject,
      hui: qf.hui,
      size: qf.size,
      rate: qf.rate,
    });
  };

  // Handler to save edited RO
  const handleSaveEditQF = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "quotationFormNumber",
      "clientId",
      "clientName",
      "publicationId",
      "publication",
      "date",
      "address",
      "subject",
      "hui",
      "size",
      "rate",
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

    setQuotations((prev) => {
      const updated = [...prev];
      updated[editQF.idx] = {
        ...updated[editQF.idx],
        ...editForm,
      };
      return updated;
    });

    // Save the edited RO to the server
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/edit-quotation`,
        {
          ...editForm,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error saving edited QF: ", error);
    }

    handleCloseEditQF();
  };

  const [clients, setClients] = useState([]);
  const [publishers, setPublishers] = useState([]);

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
        [`${name}`]: selectedPublisher.publisherName,
      }));
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[80vw] h-[90vh]">
      <h4 className=" transition ease-in-out duration-200 mt-6 mx-12 mb-2 text-xl text-left font-semibold">
        All Quotations
      </h4>
      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6 px-6">
        <h2 className="text-2xl font-bold mb-4">List of All Quotations</h2>
        <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-purple-100 ">
            <tr>
              <th className="py-4 px-4 border-b text-left">QFNumber</th>

              <th className="py-4 px-4 border-b text-left">Client Name</th>
              <th className="py-4 px-4 border-b text-left">Publication</th>
              <th className="py-4 px-4 border-b text-left">Date</th>
              <th className="py-4 px-4 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {quotations.map((quotation, idx) => (
              <tr key={quotation.id} className="hover:bg-purple-50">
                <td className="py-2 px-4 border-b">
                  {quotation.quotationFormNumber}
                </td>

                <td className="py-2 px-4 border-b">{quotation.clientName}</td>
                <td className="py-2 px-4 border-b">{quotation.publication}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(quotation.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b flex flex-col gap-2 text-center">
                  {/* <button
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    onClick={() => setSelectedQuotation(quotation)}
                  >
                    Show Details
                  </button> */}
                  {/* <PDFDownloadLink
                    document={<QuotationPDF showQFDetails={quotation} />}
                    fileName="quotation.pdf"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {({ loading }) =>
                      loading ? (
                        <button disabled>Preparing PDF...</button>
                      ) : (
                        <button>Download QF</button>
                      )
                    }
                  </PDFDownloadLink> */}
                  <button
                    onClick={() => handlePreviewPDF(quotation)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                  >
                    Preview Quotation
                  </button>
                  {/* <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                    onClick={() => handleEditQF(quotation, idx)}
                  >
                    Edit Q.F.
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedQuotation && (
          <div className="mt-4 bg-white rounded-xl w-full p-4">
            <h5 className="text-lg font-semibold">Quotation Details</h5>
            <div className="mt-2">
              <p>
                <strong>Quotation Form Number:</strong>{" "}
                {selectedQuotation.quotationFormNumber}
              </p>

              <p>
                <strong>Client Name:</strong> {selectedQuotation.clientName}
              </p>
              <p>
                <strong>Address:</strong> {selectedQuotation.address}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedQuotation.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Subject:</strong> {selectedQuotation.subject}
              </p>
              <p>
                <strong>Publication:</strong> {selectedQuotation.publication}
              </p>
              <p>
                <strong>Size:</strong> {selectedQuotation.size}
              </p>
              <p>
                <strong>HUI:</strong> {selectedQuotation.hui}
              </p>
              <p>
                <strong>Rate:</strong> {selectedQuotation.rate}
              </p>
            </div>
          </div>
        )}
        {/* Edit QF Modal */}
        {editQF && (
          <div className="absolute  w-full max-w-5xl z-50 flex items-start justify-center  overflow-y-auto ">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative mt-[30px] shadow-lg shadow-black">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl"
                onClick={handleCloseEditQF}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">
                Edit Quotation Form: {editQF.quotationFormNumber}
              </h3>
              <form onSubmit={handleSaveEditQF}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  <div>
                    <label className="block font-medium mb-1">
                      Quotation Form No.
                    </label>
                    <input
                      type="text"
                      name="quotationFormNumber"
                      value={editForm.quotationFormNumber}
                      required
                      disabled
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
                      value={editForm.publication}
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
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editForm.address}
                      onChange={handleEditFormChange}
                      required
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={editForm.subject}
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
                      Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="size"
                      value={editForm.size}
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
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleCloseEditQF}
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

export default AllQuotationForm;
