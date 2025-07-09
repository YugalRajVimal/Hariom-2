import React, { useState } from "react";

// Sample data for clients
const sampleClients = [
  { clientName: "Acme Corp", email: "contact@acme.com" },
  { clientName: "Alobex Inc", email: "info@globex.com" },
  { clientName: "Initech", email: "support@initech.com" },
];

// Sample orders for demonstration (in real app, fetch from API)
const sampleOrders = {
  0: [
    {
      orderId: "ORD-001",
      orderDate: "2024-06-01",
      amount: 1200,
      status: "Completed",
      invoiceUrl: "#",
      details: "Order details for Acme Corp, ORD-001",
    },
    {
      orderId: "ORD-002",
      orderDate: "2024-06-10",
      amount: 800,
      status: "Pending",
      invoiceUrl: "#",
      details: "Order details for Acme Corp, ORD-002",
    },
  ],
  1: [
    {
      orderId: "ORD-003",
      orderDate: "2024-05-15",
      amount: 1500,
      status: "Completed",
      invoiceUrl: "#",
      details: "Order details for Globex Inc, ORD-003",
    },
  ],
  2: [
    {
      orderId: "ORD-004",
      orderDate: "2024-04-20",
      amount: 950,
      status: "Completed",
      invoiceUrl: "#",
      details: "Order details for Initech, ORD-004",
    },
    {
      orderId: "ORD-005",
      orderDate: "2024-05-05",
      amount: 500,
      status: "Pending",
      invoiceUrl: "#",
      details: "Order details for Initech, ORD-005",
    },
  ],
};

const AllClients = () => {
  // State for all clients, initialized with sample clients
  const [clients] = useState([...sampleClients]);

  // State for search input
  const [search, setSearch] = useState("");

  // State for showing orders modal
  const [showOrdersFor, setShowOrdersFor] = useState(null);

  // State for showing order details modal
  const [showOrderDetails, setShowOrderDetails] = useState(null);

  // Handler to open orders modal for a client
  const handleShowOrders = (clientIdx) => {
    setShowOrdersFor(clientIdx);
    setShowOrderDetails(null);
  };

  // Handler to close orders modal
  const handleCloseOrders = () => {
    setShowOrdersFor(null);
    setShowOrderDetails(null);
  };

  // Handler to show order details
  const handleShowOrderDetails = (order) => {
    setShowOrderDetails(order);
  };

  // Handler to close order details modal
  const handleCloseOrderDetails = () => {
    setShowOrderDetails(null);
  };

  // Handler for download invoice (simulate download)
  const handleDownloadInvoice = (order) => {
    // In real app, use order.invoiceUrl
    alert(`Downloading invoice for ${order.orderId}`);
  };

  // Filtered and sorted clients for dictionary-like search
  const filteredClients = clients
    .filter((client) =>
      client.clientName.toLowerCase().includes(search.trim().toLowerCase())
    )
    .sort((a, b) => a.clientName.localeCompare(b.clientName));

  // Group clients by first letter for dictionary-like display
  const groupedClients = filteredClients.reduce((acc, client, idx) => {
    const firstLetter = client.clientName[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push({
      ...client,
      idx: clients.findIndex((c) => c === client),
    });
    return acc;
  }, {});

  // Sorted group keys
  const groupKeys = Object.keys(groupedClients).sort();

  return (
    <div className="w-[75vw] h-[90vh]">
      <h4 className="  transition ease-in-out duration-200 mt-6 mx-12 mb-2 text-xl text-left font-semibold">
        All Clients
      </h4>

      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">All Clients</h2>
        {/* Search Input */}
        <div className="w-full md:w-[90%] mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-purple-400 rounded-md px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-300"
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
              {groupKeys.length > 0 ? (
                groupKeys.map((letter) => (
                  <React.Fragment key={letter}>
                    {/* <tr>
                      <td
                        colSpan={3}
                        className="bg-gray-100 font-semibold text-purple-700 py-2 px-4 border-b"
                        style={{ letterSpacing: "2px" }}
                      >
                        {letter}
                      </td>
                    </tr> */}
                    {groupedClients[letter].map((clientObj) => (
                      <tr key={clientObj.idx} className="hover:bg-purple-50">
                        <td className="py-2 px-4 border-b">
                          {clientObj.clientName}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {clientObj.email}
                        </td>
                        <td className="py-2 px-4 border-b">
                          <button
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
                            onClick={() => handleShowOrders(clientObj.idx)}
                          >
                            Client's Orders
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
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

        {/* Orders Modal */}
        {showOrdersFor !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={handleCloseOrders}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">
                Orders for {clients[showOrdersFor]?.clientName}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-md overflow-hidden mb-4">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="py-2 px-4 border-b text-left">Order ID</th>
                      <th className="py-2 px-4 border-b text-left">Date</th>
                      <th className="py-2 px-4 border-b text-left">Amount</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-left">
                    {sampleOrders[showOrdersFor] &&
                    sampleOrders[showOrdersFor].length > 0 ? (
                      sampleOrders[showOrdersFor].map((order, oidx) => (
                        <tr key={oidx} className="hover:bg-purple-50">
                          <td className="py-2 px-4 border-b">
                            {order.orderId}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {order.orderDate}
                          </td>
                          <td className="py-2 px-4 border-b">
                            ₹{order.amount}
                          </td>
                          <td className="py-2 px-4 border-b">{order.status}</td>
                          <td className="py-2 px-4 border-b flex gap-2">
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                              onClick={() => handleShowOrderDetails(order)}
                            >
                              Show Details
                            </button>
                            <button
                              className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded"
                              onClick={() => handleDownloadInvoice(order)}
                            >
                              Download Invoice
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
                          No orders found for this client.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleCloseOrders}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={handleCloseOrderDetails}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">
                Order Details: {showOrderDetails.orderId}
              </h3>
              <div className="mb-4">
                <p>
                  <strong>Date:</strong> {showOrderDetails.orderDate}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{showOrderDetails.amount}
                </p>
                <p>
                  <strong>Status:</strong> {showOrderDetails.status}
                </p>
                <p>
                  <strong>Details:</strong> {showOrderDetails.details}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleCloseOrderDetails}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  onClick={() => handleDownloadInvoice(showOrderDetails)}
                >
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllClients;
