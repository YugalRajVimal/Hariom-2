import React, { useState } from "react";

// Sample data for publishers
const samplePublishers = [
  { publisherName: "Acme Publishing", email: "contact@acmepub.com" },
  { publisherName: "Globex Media", email: "info@globexmedia.com" },
  { publisherName: "Initech Press", email: "support@initechpress.com" },
];

// Sample Released Orders (ROs) for demonstration (in real app, fetch from API)
const sampleReleasedOrders = {
  0: [
    {
      roId: "RO-001",
      roDate: "2024-06-01",
      amount: 1200,
      status: "Released",
      roUrl: "#",
      details: "Released Order details for Acme Publishing, RO-001",
    },
    {
      roId: "RO-002",
      roDate: "2024-06-10",
      amount: 800,
      status: "Released",
      roUrl: "#",
      details: "Released Order details for Acme Publishing, RO-002",
    },
  ],
  1: [
    {
      roId: "RO-003",
      roDate: "2024-05-15",
      amount: 1500,
      status: "Released",
      roUrl: "#",
      details: "Released Order details for Globex Media, RO-003",
    },
  ],
  2: [
    {
      roId: "RO-004",
      roDate: "2024-04-20",
      amount: 950,
      status: "Released",
      roUrl: "#",
      details: "Released Order details for Initech Press, RO-004",
    },
    {
      roId: "RO-005",
      roDate: "2024-05-05",
      amount: 500,
      status: "Released",
      roUrl: "#",
      details: "Released Order details for Initech Press, RO-005",
    },
  ],
};

const AllPublishers = () => {
  // State for all publishers, initialized with sample publishers
  const [publishers] = useState([...samplePublishers]);

  // State for showing Released Orders modal
  const [showROsFor, setShowROsFor] = useState(null);

  // State for showing RO details modal
  const [showRODetails, setShowRODetails] = useState(null);

  // Handler to open Released Orders modal for a publisher
  const handleShowROs = (publisherIdx) => {
    setShowROsFor(publisherIdx);
    setShowRODetails(null);
  };

  // Handler to close Released Orders modal
  const handleCloseROs = () => {
    setShowROsFor(null);
    setShowRODetails(null);
  };

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

  return (
    <div className="w-[75vw] h-[90vh]">
      <h4 className=" transition ease-in-out duration-200 mt-6 mx-12 mb-2 text-xl text-left font-semibold">
        All Publishers
      </h4>

      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">All Publishers</h2>
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
              {publishers && publishers.length > 0 ? (
                publishers.map((publisher, idx) => (
                  <tr key={idx} className="hover:bg-purple-50">
                    <td className="py-2 px-4 border-b">
                      {publisher.publisherName}
                    </td>
                    <td className="py-2 px-4 border-b">{publisher.email}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                        onClick={() => handleShowROs(idx)}
                      >
                        Publisher's Released Orders
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

        {/* Released Orders Modal */}
        {showROsFor !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={handleCloseROs}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">
                Released Orders for {publishers[showROsFor]?.publisherName}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-md overflow-hidden mb-4">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">RO ID</th>
                      <th className="py-2 px-4 border-b text-left">Date</th>
                      <th className="py-2 px-4 border-b text-left">Amount</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-left">
                    {sampleReleasedOrders[showROsFor] &&
                    sampleReleasedOrders[showROsFor].length > 0 ? (
                      sampleReleasedOrders[showROsFor].map((ro, oidx) => (
                        <tr key={oidx} className="hover:bg-purple-50">
                          <td className="py-2 px-4 border-b">{ro.roId}</td>
                          <td className="py-2 px-4 border-b">{ro.roDate}</td>
                          <td className="py-2 px-4 border-b">₹{ro.amount}</td>
                          <td className="py-2 px-4 border-b">{ro.status}</td>
                          <td className="py-2 px-4 border-b flex gap-2">
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                              onClick={() => handleShowRODetails(ro)}
                            >
                              Show RO Details
                            </button>
                            <button
                              className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded"
                              onClick={() => handleDownloadRO(ro)}
                            >
                              Download RO
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-4 text-center text-gray-500"
                        >
                          No Released Orders found for this publisher.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleCloseROs}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RO Details Modal */}
        {showRODetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
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
              <div className="mb-4">
                <p>
                  <strong>Date:</strong> {showRODetails.roDate}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{showRODetails.amount}
                </p>
                <p>
                  <strong>Status:</strong> {showRODetails.status}
                </p>
                <p>
                  <strong>Details:</strong> {showRODetails.details}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleCloseRODetails}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  onClick={() => handleDownloadRO(showRODetails)}
                >
                  Download RO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPublishers;
