import React, { useState } from "react";

// Sample data for publications (for dropdown)
const samplePublications = ["Acme Publishing", "Globex Media", "Initech Press"];

// Sample Bills for demonstration (in real app, fetch from API)
const sampleBills = [
  {
    billId: "BILL-001",
    clientName: "Client A",
    publicationName: "Acme Publishing",
    insertionDate: "2024-06-01",
    position: "Front Page",
    category: "News",
    noOfAds: 2,
    orderRefNo: "ORD-1001",
    hui: "B/W",
    schemaMaterial: "PDF",
    widthCm: 12.5,
    heightCm: 10,
    rate: 50,
    amount: 1250,
    agencyComm1: 5,
    agencyComm2: 0,
    agencyComm3: 0,
    totalComm: 62.5,
    totalAmount: 1187.5,
    remark: "Urgent",
    status: "Billed",
    billUrl: "#",
  },
  {
    billId: "BILL-002",
    clientName: "Client B",
    publicationName: "Globex Media",
    insertionDate: "2024-06-10",
    position: "Back Page",
    category: "Sports",
    noOfAds: 1,
    orderRefNo: "ORD-1002",
    hui: "Color",
    schemaMaterial: "JPG",
    widthCm: 10,
    heightCm: 8,
    rate: 80,
    amount: 800,
    agencyComm1: 10,
    agencyComm2: 2,
    agencyComm3: 0,
    totalComm: 96,
    totalAmount: 704,
    remark: "Special",
    status: "Billed",
    billUrl: "#",
  },
  {
    billId: "BILL-003",
    clientName: "Client C",
    publicationName: "Initech Press",
    insertionDate: "2024-05-15",
    position: "Middle Page",
    category: "Business",
    noOfAds: 3,
    orderRefNo: "ORD-1003",
    hui: "B/W",
    schemaMaterial: "PNG",
    widthCm: 15,
    heightCm: 12,
    rate: 60,
    amount: 2700,
    agencyComm1: 0,
    agencyComm2: 0,
    agencyComm3: 0,
    totalComm: 0,
    totalAmount: 2700,
    remark: "Repeat",
    status: "Billed",
    billUrl: "#",
  },
];

const initialEditState = {
  clientName: "",
  publicationName: "",
  insertionDate: "",
  position: "",
  category: "",
  noOfAds: "",
  orderRefNo: "",
  hui: "",
  schemaMaterial: "",
  widthCm: "",
  heightCm: "",
  rate: "",
  agencyComm1: "",
  agencyComm2: "",
  agencyComm3: "",
  remark: "",
};

function calculateAmount(widthCm, heightCm, rate, noOfAds) {
  const w = parseFloat(widthCm) || 0;
  const h = parseFloat(heightCm) || 0;
  const r = parseFloat(rate) || 0;
  const n = parseInt(noOfAds) || 0;
  return w * h * r * n;
}

function calculateTotalComm(amount, c1, c2, c3) {
  const a = parseFloat(amount) || 0;
  const comm1 = parseFloat(c1) || 0;
  const comm2 = parseFloat(c2) || 0;
  const comm3 = parseFloat(c3) || 0;
  return (a * (comm1 + comm2 + comm3)) / 100;
}

function calculateTotalAmount(amount, totalComm) {
  const a = parseFloat(amount) || 0;
  const tc = parseFloat(totalComm) || 0;
  return a - tc;
}

const AllBills = () => {
  const [bills, setBills] = useState([...sampleBills]);
  const [showBillDetails, setShowBillDetails] = useState(null);

  // Handler to show Bill details
  const handleShowBillDetails = (bill) => {
    setShowBillDetails(bill);
  };

  // Handler to close Bill details modal
  const handleCloseBillDetails = () => {
    setShowBillDetails(null);
  };

  // Handler for download Bill (simulate download)
  const handleDownloadBill = (bill) => {
    // In real app, use bill.billUrl
    alert(`Downloading Bill for ${bill.billId}`);
  };

  return (
    <div className="w-[80vw] h-[90vh]">
      <h4 className=" transition ease-in-out duration-200 mt-6 mx-12 mb-2 text-xl text-left font-semibold">
        All Bills
      </h4>
      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <h2 className="text-2xl font-bold mb-4">List of All Bills</h2>
        <div className="w-full md:w-[95%]">
          <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-purple-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Bill No.</th>
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
              {bills && bills.length > 0 ? (
                bills.map((bill) => (
                  <tr key={bill.billId} className="hover:bg-purple-50">
                    <td className="py-2 px-4 border-b">{bill.billId}</td>
                    <td className="py-2 px-4 border-b">{bill.clientName}</td>
                    <td className="py-2 px-4 border-b">
                      {bill.publicationName}
                    </td>
                    <td className="py-2 px-4 border-b">{bill.insertionDate}</td>
                    <td className="py-2 px-4 border-b">₹{bill.amount}</td>
                    <td className="py-2 px-4 border-b flex gap-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        onClick={() => handleShowBillDetails(bill)}
                      >
                        Show Bill Details
                      </button>
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded"
                        onClick={() => handleDownloadBill(bill)}
                      >
                        Download Bill
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No Bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bill Details Modal */}
        {showBillDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                onClick={handleCloseBillDetails}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 className="text-xl font-semibold mb-4">
                Bill Details: {showBillDetails.billId}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                <div>
                  <strong>Bill No.:</strong> {showBillDetails.billId}
                </div>
                <div>
                  <strong>Client Name:</strong> {showBillDetails.clientName}
                </div>
                <div>
                  <strong>Publication Name:</strong>{" "}
                  {showBillDetails.publicationName}
                </div>
                <div>
                  <strong>Date of Insertion:</strong>{" "}
                  {showBillDetails.insertionDate}
                </div>
                <div>
                  <strong>Position:</strong> {showBillDetails.position}
                </div>
                <div>
                  <strong>Category:</strong> {showBillDetails.category}
                </div>
                <div>
                  <strong>No. of ads:</strong> {showBillDetails.noOfAds}
                </div>
                <div>
                  <strong>Order / Reference No.:</strong>{" "}
                  {showBillDetails.orderRefNo}
                </div>
                <div>
                  <strong>Hui:</strong> {showBillDetails.hui}
                </div>
                <div>
                  <strong>Schema Material:</strong>{" "}
                  {showBillDetails.schemaMaterial}
                </div>
                <div>
                  <strong>Width in cm:</strong> {showBillDetails.widthCm}
                </div>
                <div>
                  <strong>Height in cm:</strong> {showBillDetails.heightCm}
                </div>
                <div>
                  <strong>Rate:</strong> {showBillDetails.rate}
                </div>
                <div>
                  <strong>Amount:</strong> ₹{showBillDetails.amount}
                </div>
                <div>
                  <strong>Agency Commision 1 (%):</strong>{" "}
                  {showBillDetails.agencyComm1}
                </div>
                <div>
                  <strong>Agency Commision 2 (%):</strong>{" "}
                  {showBillDetails.agencyComm2}
                </div>
                <div>
                  <strong>Agency Commision 3 (%):</strong>{" "}
                  {showBillDetails.agencyComm3}
                </div>
                <div>
                  <strong>Total Commision:</strong> ₹{showBillDetails.totalComm}
                </div>
                <div>
                  <strong>Total Amount:</strong> ₹{showBillDetails.totalAmount}
                </div>
                <div className="md:col-span-2">
                  <strong>Remark/ Code / QRN:</strong> {showBillDetails.remark}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleCloseBillDetails}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  onClick={() => handleDownloadBill(showBillDetails)}
                >
                  Download Bill
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBills;
