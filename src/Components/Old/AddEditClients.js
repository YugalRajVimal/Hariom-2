import React, { useState, useEffect } from "react";
import axios from "axios";

const sampleClients = [
  { clientName: "Acme Corp", email: "contact@acme.com" },
  { clientName: "Globex Inc", email: "info@globex.com" },
  { clientName: "Initech", email: "support@initech.com" },
];

const AddEditClients = () => {
  // State for form data (Add New Client)
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
  });

  // State for all clients, initialized with sample clients
  const [clients, setClients] = useState([...sampleClients]);

  // State for edit modal visibility and which client is being edited
  const [editIndex, setEditIndex] = useState(null);

  // State for edit form data
  const [editFormData, setEditFormData] = useState({
    clientName: "",
    email: "",
  });

  // State for search query
  const [search, setSearch] = useState("");

  // State for past quotations visibility
  const [showPastQuotations, setShowPastQuotations] = useState(false);

  // State for past quotations data
  const [pastQuotations, setPastQuotations] = useState([]);

  // State for more details visibility
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // State for more details data
  const [moreDetails, setMoreDetails] = useState(null);

  // Handler for input changes (Add New Client)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for form submission (Add New Client)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/add-client`,
        { ...formData },
        { headers: { Authorization: `${token}` } }
      );
      if (response.status === 201) {
        // Add new client to the clients list
        setClients((prev) => [...prev, formData]);
        // Optionally, reset form after submit
        setFormData({
          clientName: "",
          email: "",
        });
      } else {
        console.error("Failed to add client");
      }
    } catch (error) {
      console.error("Error adding client", error);
    }
  };

  // Handler to open edit modal and set edit form data
  const handleEditClient = (idx) => {
    setEditIndex(idx);
    setEditFormData({
      clientName: clients[idx].clientName,
      email: clients[idx].email,
    });
  };

  // Handler for input changes in edit modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/edit-client`,
        { ...editFormData },
        { headers: { Authorization: `${token}` } }
      );
      if (response.status === 200) {
        setClients((prev) =>
          prev.map((client, idx) =>
            idx === editIndex ? { ...editFormData } : client
          )
        );
        setEditIndex(null);
        setEditFormData({
          clientName: "",
          email: "",
        });
      } else {
        console.error("Failed to edit client");
      }
    } catch (error) {
      console.error("Error editing client", error);
    }
  };

  const handlePastQuotations = async (clientId) => {
    console.log(clientId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/get-client-past-quotations/${clientId}`,
        { headers: { Authorization: `${token}` } }
      );
      if (response.status === 200) {
        setPastQuotations(response.data.data);
        setShowPastQuotations(true);
      } else {
        console.error("Failed to fetch past quotations");
      }
    } catch (error) {
      console.error("Error fetching past quotations", error);
    }
  };
  const handleMoreDetails = async (id) => {
    console.log(id);
    const foundQuotation = pastQuotations.find(
      (quotation) => quotation._id === id
    );
    console.log(foundQuotation);

    if (foundQuotation) {
      setMoreDetails(foundQuotation);
      console.log(moreDetails);
    } else {
      console.error("Quotation not found");
    }
    setShowMoreDetails(true);
  };

  // Handler to close edit modal
  const handleCloseEdit = () => {
    setEditIndex(null);
    setEditFormData({
      clientName: "",
      email: "",
    });
  };

  // Handler to close past quotations modal
  const handleClosePastQuotations = () => {
    setShowPastQuotations(false);
    setPastQuotations([]);
  };

  // Handler to close more details modal
  const handleCloseMoreDetails = () => {
    setShowMoreDetails(false);
    setMoreDetails({
      clientId: "",
      clientName: "",
      address: "",
      date: "",
      subject: "",
      publicationId: "",
      publication: "",
      rate: "",
      size: "",
      hui: "",
    });
  };

  // Fetch all clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-all-clients`,
          { headers: { Authorization: `${token}` } }
        );
        if (response.status === 200) {
          setClients(response.data);
        } else {
          console.error("Failed to fetch clients");
        }
      } catch (error) {
        console.error("Error fetching clients", error);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.clientName.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-[75vw] h-[90vh]">
      <h4 className="transition ease-in-out duration-200 mt-6 mx-12 mb-2 text-xl text-left font-semibold">
        Add/Edit Clients
      </h4>
      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">Add New Clients</h2>
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-[90%] flex flex-col gap-6 pb-6"
        >
          {/* Client Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">
              Client Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2 "
            />
          </div>
          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2 "
            />
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">All Clients</h2>
        {/* Search */}
        <div className="w-full md:w-[90%] mb-4">
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-purple-700 rounded-md px-3 py-2 w-full"
          />
        </div>
        {/* Client List */}
        <div className="w-full md:w-[90%]">
          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-purple-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {filteredClients && filteredClients.length > 0 ? (
                filteredClients.map((client, idx) => (
                  <tr key={idx} className="hover:bg-purple-50">
                    <td className="py-2 px-4 border-b">{client.clientName}</td>
                    <td className="py-2 px-4 border-b">{client.email}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handleEditClient(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handlePastQuotations(client._id)}
                      >
                        Past Quotations
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Past Quotations List */}
        {showPastQuotations && (
          <div className="w-full md:w-[90%] mt-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto bg-white rounded-xl p-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-2">Past Quotations</h3>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-4"
                onClick={handleClosePastQuotations}
              >
                Close
              </button>
            </div>

            <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-purple-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">QFNumber</th>

                  <th className="py-2 px-4 border-b text-left">Publication</th>

                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-left">
                {pastQuotations && pastQuotations.length > 0 ? (
                  pastQuotations.map((quotation, idx) => (
                    <tr key={idx} className="hover:bg-purple-50">
                      <td className="py-2 px-4 border-b">
                        {quotation.quotationFormNumber}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {quotation.publication}
                      </td>

                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleMoreDetails(quotation._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          More Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500">
                      No past quotations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* More Details */}
        {showMoreDetails && (
          <div className="w-full md:w-[90%] mt-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto bg-white rounded-xl p-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-2">More Details</h3>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-4"
                onClick={handleCloseMoreDetails}
              >
                Close
              </button>
            </div>

            <div className="text-left">
            <p>
                <strong>Quotation Form Number:</strong> {moreDetails.quotationFormNumber}
              </p>
              <p>
                <strong>Client ID:</strong> {moreDetails.clientId}
              </p>
              <p>
                <strong>Client Name:</strong> {moreDetails.clientName}
              </p>
              <p>
                <strong>Address:</strong> {moreDetails.address}
              </p>
              <p>
                <strong>Date:</strong> {moreDetails.date}
              </p>
              <p>
                <strong>Subject:</strong> {moreDetails.subject}
              </p>
              <p>
                <strong>Publication ID:</strong> {moreDetails.publicationId}
              </p>
              <p>
                <strong>Publication:</strong> {moreDetails.publication}
              </p>
              <p>
                <strong>Rate:</strong> {moreDetails.rate}
              </p>
              <p>
                <strong>Size:</strong> {moreDetails.size}
              </p>
              <p>
                <strong>HUI:</strong> {moreDetails.hui}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEditClients;
