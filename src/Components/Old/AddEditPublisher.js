import React, { useState, useEffect } from "react";
import axios from "axios";

const samplePublishers = [
  { publisherName: "Acme Publishing", email: "contact@acmepub.com" },
  { publisherName: "Globex Media", email: "info@globexmedia.com" },
  { publisherName: "Initech Press", email: "support@initechpress.com" },
];

const AddEditPublisher = () => {
  // State for form data (Add New Publisher)
  const [formData, setFormData] = useState({
    publisherName: "",
    email: "",
  });

  // State for all publishers, initialized with sample publishers
  const [publishers, setPublishers] = useState([...samplePublishers]);

  // State for edit modal visibility and which publisher is being edited
  const [editIndex, setEditIndex] = useState(null);

  // State for edit form data
  const [editFormData, setEditFormData] = useState({
    publisherName: "",
    email: "",
  });

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // Filtered publishers based on search term
  const filteredPublishers = publishers.filter(
    (publisher) =>
      publisher.publisherName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      publisher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // State for past ReleasedOrders visibility
  const [showPastReleasedOrders, setShowPastReleasedOrders] = useState(false);

  // State for past ReleasedOrders data
  const [pastReleasedOrders, setPastReleasedOrders] = useState([]);

  // State for more details visibility
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // State for more details data
  const [moreDetails, setMoreDetails] = useState(null);

  // Handler for input changes (Add New Publisher)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for form submission (Add New Publisher)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/add-publisher`,
        { ...formData },
        { headers: { Authorization: `${token}` } }
      );
      if (response.status === 201) {
        // Add new publisher to the publishers list
        setPublishers((prev) => [...prev, formData]);
        // Optionally, reset form after submit
        setFormData({
          publisherName: "",
          email: "",
        });
      } else {
        console.error("Failed to add publisher");
      }
    } catch (error) {
      console.error("Error adding publisher", error);
    }
  };

  // Handler to open edit modal and set edit form data
  const handleEditPublisher = (idx) => {
    setEditIndex(idx);
    setEditFormData({
      publisherName: publishers[idx].publisherName,
      email: publishers[idx].email,
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
        `${process.env.REACT_APP_API_URL}/api/edit-publisher`,
        { ...editFormData },
        { headers: { Authorization: `${token}` } }
      );
      if (response.status === 200) {
        setPublishers((prev) =>
          prev.map((publisher, idx) =>
            idx === editIndex ? { ...editFormData } : publisher
          )
        );
        setEditIndex(null);
        setEditFormData({
          publisherName: "",
          email: "",
        });
      } else {
        console.error("Failed to edit publisher");
      }
    } catch (error) {
      console.error("Error editing publisher", error);
    }
  };

  // Handler to close edit modal
  const handleCloseEdit = () => {
    setEditIndex(null);
    setEditFormData({
      publisherName: "",
      email: "",
    });
  };

  // Handler to close past Released Orders modal
  const handleClosePastReleasedOrders = () => {
    setShowPastReleasedOrders(false);
    setPastReleasedOrders([]);
  };

  // Handler to close more details modal
  const handleCloseMoreDetails = () => {
    setShowMoreDetails(false);
    setMoreDetails({
      // all details of Released Order
      roNo: "",
      clientId: "",
      clientName: "",
      publicationId: "",
      publicationName: "",
      insertionDate: "",
      position: "",
      category: "",
      noOfAds: "",
      referenceNo: "",
      hui: "",
      schemaMaterial: "",
      width: "",
      height: "",
      rate: "",
      amount: "",
      agency1: "",
      agency2: "",
      agency3: "",
      totalCommission: "",
      totalAmount: "",
      remark: "",
    });
  };

  const handlePastReleasedOrders = async (publicationId) => {
    console.log(publicationId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/get-publisher-past-ros/${publicationId}`,
        { headers: { Authorization: `${token}` } }
      );
      if (response.status === 200) {
        console.log("Quotations fetched successfully:", response.data.data);
        setPastReleasedOrders(response.data.data);
        console.log("---", pastReleasedOrders);
        setShowPastReleasedOrders(true);
      } else {
        console.error("Failed to fetch past released orders");
      }
    } catch (error) {
      console.error("Error fetching past released orders", error);
    }
  };
  const handleMoreDetails = async (id) => {
    console.log(id);
    const foundRO = pastReleasedOrders.find((ro) => ro._id === id);
    console.log("--", foundRO);

    if (foundRO) {
      setMoreDetails(foundRO);
      console.log(moreDetails);
    } else {
      console.error("Quotation not found");
    }
    setShowMoreDetails(true);
  };

  // Fetch all publishers on mount
  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-all-publishers`,
          { headers: { Authorization: `${token}` } }
        );
        if (response.status === 200) {
          setPublishers(response.data);
        } else {
          console.error("Failed to fetch publishers");
        }
      } catch (error) {
        console.error("Error fetching publishers", error);
      }
    };

    fetchPublishers();
  }, []);

  return (
    <div className="w-[80vw] h-[90vh]">
      <h4 className="transition ease-in-out duration-200 mt-6 mx-12 mb-2 text-xl text-left font-semibold">
        Add/Edit Publishers
      </h4>
      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">Add New Publisher</h2>
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-[90%] flex flex-col gap-6 pb-6"
        >
          {/* Publisher Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">
              Publisher Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="publisherName"
              value={formData.publisherName}
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
      <div className=" w-full flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">All Publishers</h2>
        {/* Search Input */}
        <div className="flex mb-4 w-[80%] justify-start">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Publisher"
            className="border border-purple-700 rounded-md px-3 py-2 w-full"
          />
        </div>
        {/* Publisher List */}
        <div className="w-full md:w-[90%]">
          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-purple-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Publisher Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-left">
              {filteredPublishers && filteredPublishers.length > 0 ? (
                filteredPublishers.map((publisher, idx) => (
                  <tr key={idx} className="hover:bg-purple-50">
                    <td className="py-2 px-4 border-b">
                      {publisher.publisherName}
                    </td>
                    <td className="py-2 px-4 border-b">{publisher.email}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handleEditPublisher(idx)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                        onClick={() => handlePastReleasedOrders(publisher._id)}
                      >
                        Past Released Orders
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    No publishers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Publisher Modal */}
        {editIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={handleCloseEdit}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">Edit Publisher</h3>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-left">
                    Publisher Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="publisherName"
                    value={editFormData.publisherName}
                    onChange={handleEditChange}
                    required
                    className="border border-purple-700 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 font-medium text-left">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    required
                    disabled
                    className="border border-purple-700 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleCloseEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Past Released Order List */}
        {showPastReleasedOrders && (
          <div className="w-full md:w-[90%] mt-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto bg-white rounded-xl p-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-2">
                Past Released Quotations
              </h3>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-4"
                onClick={handleClosePastReleasedOrders}
              >
                Close
              </button>
            </div>

            <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-purple-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">RONumber</th>
                  <th className="py-2 px-4 border-b text-left">QFNumber</th>

                  <th className="py-2 px-4 border-b text-left">Client Name</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-left">
                {pastReleasedOrders && pastReleasedOrders.length > 0 ? (
                  pastReleasedOrders.map((ro, idx) => (
                    <tr key={idx} className="hover:bg-purple-50">
                      <td className="py-2 px-4 border-b">{ro.roNo}</td>

                      <td className="py-2 px-4 border-b">
                        {ro.quotationFormNo}
                      </td>

                      <td className="py-2 px-4 border-b">{ro.clientName}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => handleMoreDetails(ro._id)}
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
                      No past released order found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* More Details */}
        {showMoreDetails && (
          <div className="h-screen w-screen absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto flex justify-center items-start">
            <div className="w-full md:w-[90%] mt-10  bg-white rounded-xl p-6">
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
                {/* Show all details of Released Order  */}
                <div className="mb-2">
                  <strong>Released Order Number:</strong> {moreDetails.roNo}
                </div>
                <div className="mb-2">
                  <strong>Quotation Form Number:</strong>{" "}
                  {moreDetails.quotationFormNo}
                </div>
                <div className="mb-2">
                  <strong>Client ID:</strong> {moreDetails.clientId}
                </div>
                <div className="mb-2">
                  <strong>Client Name:</strong> {moreDetails.clientName}
                </div>
                <div className="mb-2">
                  <strong>Publication ID:</strong> {moreDetails.publicationId}
                </div>
                <div className="mb-2">
                  <strong>Publication Name:</strong>{" "}
                  {moreDetails.publicationName}
                </div>
                <div className="mb-2">
                  <strong>Insertion Date:</strong> {moreDetails.insertionDate}
                </div>
                <div className="mb-2">
                  <strong>Position:</strong> {moreDetails.position}
                </div>
                <div className="mb-2">
                  <strong>Category:</strong> {moreDetails.category}
                </div>
                <div className="mb-2">
                  <strong>Number of Ads:</strong> {moreDetails.noOfAds}
                </div>
                <div className="mb-2">
                  <strong>Reference Number:</strong> {moreDetails.referenceNo}
                </div>
                <div className="mb-2">
                  <strong>HUI:</strong> {moreDetails.hui}
                </div>
                <div className="mb-2">
                  <strong>Schema Material:</strong> {moreDetails.schemaMaterial}
                </div>
                <div className="mb-2">
                  <strong>Width:</strong> {moreDetails.width}
                </div>
                <div className="mb-2">
                  <strong>Height:</strong> {moreDetails.height}
                </div>
                <div className="mb-2">
                  <strong>Rate:</strong> {moreDetails.rate}
                </div>
                <div className="mb-2">
                  <strong>Amount:</strong> {moreDetails.amount}
                </div>
                <div className="mb-2">
                  <strong>Agency 1:</strong> {moreDetails.agency1}
                </div>
                <div className="mb-2">
                  <strong>Agency 2:</strong> {moreDetails.agency2}
                </div>
                <div className="mb-2">
                  <strong>Agency 3:</strong> {moreDetails.agency3}
                </div>
                <div className="mb-2">
                  <strong>Total Commission:</strong>{" "}
                  {moreDetails.totalCommission}
                </div>
                <div className="mb-2">
                  <strong>Total Amount:</strong> {moreDetails.totalAmount}
                </div>
                <div className="mb-2">
                  <strong>Remark:</strong> {moreDetails.remark}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEditPublisher;
