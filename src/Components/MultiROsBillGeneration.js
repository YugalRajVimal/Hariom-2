// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import InvoicePDF from "./TaxInvoiceView/TaxInvoiceView";
// import { PDFDownloadLink } from "@react-pdf/renderer";

// const MultiROBillGeneration = () => {
//   const [allOrders, setAllOrders] = useState([]); // Initialized as array
//   const [selectedOrder, setSelectedOrder] = useState();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     orderId: 0,
//     descHeading: "",
//     billDate: "",
//     typeOfGST: "CGST+SGST",
//     percentageOfGST: 2.5,
//     discount: 0, // Added discount field
//     address: "", // Added address field
//     billAmount: 0, // Added billAmount field
//     billTotalAmount: 0, // Added billTotalAmount field
//     clientGSTNumber: "", // Added clientGSTNumber field
//     amountSummary: "", // Added amountSummary field
//     billClientName: "", // Added billClientName field
//   });

//   const [amountAfterDiscount, setAmountAfterDiscount] = useState(
//     formData.billAmount
//   );

//   const handleAmountInput = (e) => {
//     const value = parseFloat(e.target.value);
//     const discount = parseFloat(formData.discount) || 0;
//     const percentageOfGST = parseFloat(formData.percentageOfGST) || 0;

//     const discountedAmount = value - discount;
//     setAmountAfterDiscount(discountedAmount);

//     let totalAmount = discountedAmount;

//     if (formData.typeOfGST === "CGST+SGST") {
//       totalAmount =
//         discountedAmount + discountedAmount * ((percentageOfGST * 2) / 100);
//     } else if (formData.typeOfGST === "IGST") {
//       totalAmount =
//         discountedAmount + discountedAmount * (percentageOfGST / 100);
//     } else {
//       alert("Please fill in the Type of GST and Percentage of GST first.");
//     }

//     setFormData((prev) => ({
//       ...prev,
//       billAmount: value,
//       billTotalAmount: parseFloat(totalAmount.toFixed(2)),
//     }));
//   };

//   const handleTotalAmountInput = (e) => {
//     const totalValue = parseFloat(e.target.value);
//     const discount = parseFloat(formData.discount) || 0;
//     const percentageOfGST = parseFloat(formData.percentageOfGST) || 0;

//     let baseAmount = totalValue;

//     if (formData.typeOfGST === "CGST+SGST") {
//       baseAmount = totalValue / (1 + (percentageOfGST * 2) / 100);
//     } else if (formData.typeOfGST === "IGST") {
//       baseAmount = totalValue / (1 + percentageOfGST / 100);
//     } else {
//       alert("Please fill in the Type of GST and Percentage of GST first.");
//     }

//     const billAmountBeforeDiscount = baseAmount + discount;
//     setAmountAfterDiscount(baseAmount);

//     setFormData((prev) => ({
//       ...prev,
//       billTotalAmount: totalValue,
//       billAmount: parseFloat(billAmountBeforeDiscount.toFixed(2)),
//     }));
//   };

//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       billAmount: 0,
//       billTotalAmount: 0,
//     }));
//     setAmountAfterDiscount(0);
//   }, [formData.discount, formData.percentageOfGST, formData.typeOfGST]);

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

//   const handleSaveBillDetails = async () => {
//     const order = allOrders.find((order) => order.orderId == formData.orderId);
//     if (order) {
//       setSelectedOrder(order);
//       console.log(selectedOrder);
//     } else {
//       alert("Wrong Order ID");
//       setFormData({
//         orderId: 0,
//         descHeading: "",
//         billDate: "",
//         discount: 0,
//         address: "", // Reset address field
//         billAmount: 0, // Reset billAmount field
//         billTotalAmount: 0, // Reset billTotalAmount field
//         clientGSTNumber: "", // Reset clientGSTNumber field
//         amountSummary: "", // Reset amountSummary field
//         billClientName: "", // Reset billClientName field
//       });
//       return;
//     }

//     if (
//       !selectedOrder.commonDetailsCompleted ||
//       !selectedOrder.releasedOrderDetailsCompleted
//     ) {
//       alert("RO must be completed before saving bill details.");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/save-bill`,
//         {
//           orderId: formData.orderId,
//           descHeading: formData.descHeading,
//           billDate: formData.billDate,
//           typeOfGST: formData.typeOfGST,
//           percentageOfGST: parseFloat(formData.percentageOfGST),
//           discount: parseFloat(formData.discount), // Added discount to the request
//           address: formData.address, // Added address to the request
//           billAmount: formData.billAmount, // Added billAmount to the request
//           billTotalAmount: parseFloat(formData.billTotalAmount), // Added billTotalAmount to the request
//           clientGSTNumber: formData.clientGSTNumber, // Added clientGSTNumber to the request
//           amountSummary: formData.amountSummary, // Added amountSummary to the request
//           billClientName: formData.billClientName, // Added billClientName to the request
//         },
//         {
//           headers: { Authorization: `${token}` },
//         }
//       );
//       if (response.status === 200) {
//         alert("Bill Details saved");
//       }
//     } catch (err) {
//       alert(err);
//       console.error("Failed to save bill:", err);
//     }
//   };

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       console.log(formData.orderId);
//       if (formData.orderId > 0) {
//         const order = allOrders.find(
//           (order) => order.orderId == formData.orderId
//         );
//         if (order) {
//           setSelectedOrder(order);
//           setFormData((prev) => ({
//             ...prev,
//             billClientName: order.clientName,
//           }));
//           console.log(selectedOrder);
//         } else {
//           alert("Wrong Order ID");
//           setFormData((prev) => ({
//             ...prev,
//             orderId: 0,
//             discount: 0,
//             address: "",
//             billAmount: "",
//             billTotalAmount: 0, // Reset billTotalAmount field
//             clientGSTNumber: "", // Reset clientGSTNumber field
//             amountSummary: "", // Reset amountSummary field
//             billClientName: "", // Reset billClientName field
//           })); // Reset discount, address, billAmount, billTotalAmount, clientGSTNumber, and amountSummary fields
//         }
//       }
//     }, 1000);
//     return () => clearTimeout(timeout);
//   }, [formData.orderId]);

//   if (loading) return <p>Loading data...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="w-[80vw] h-[90vh] bg-white  p-8 space-y-6">
//       <h4 className="text-3xl font-bold text-gray-800 border-b pb-3">
//         Multiple RO's Bill Generation
//       </h4>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault(); // Prevent page refresh
//           handleSaveBillDetails(); // Your function to save data
//         }}
//         className="space-y-6"
//       >
//         <div className="space-y-4">
//           <div className="flex justify-around w-full gap-4">
//             <div className="w-1/4">
//               <label
//                 htmlFor="orderId"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Order ID
//                 <span className="text-red-600">*</span>
//               </label>
//               <input
//                 required
//                 type="number"
//                 id="orderId"
//                 name="orderId"
//                 value={formData.orderId}
//                 onChange={(e) =>
//                   setFormData({ ...formData, orderId: e.target.value })
//                 }
//                 className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="w-1/4">
//               <label
//                 htmlFor="billDate"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Bill Date
//                 <span className="text-red-600">*</span>
//               </label>
//               <input
//                 required
//                 type="date"
//                 id="billDate"
//                 name="billDate"
//                 value={formData.billDate}
//                 onChange={(e) =>
//                   setFormData({ ...formData, billDate: e.target.value })
//                 }
//                 className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="w-1/4">
//               <label
//                 htmlFor="discount"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Bill Discount
//                 <span className="text-red-600">*</span>
//               </label>
//               <input
//                 required
//                 type="number"
//                 id="discount"
//                 name="discount"
//                 value={formData.discount}
//                 onChange={(e) =>
//                   setFormData({ ...formData, discount: e.target.value })
//                 }
//                 className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex gap-2 w-2/3">
//               <div className=" w-1/2">
//                 <label
//                   htmlFor="typeOfGST"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Type of GST
//                   <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   id="typeOfGST"
//                   name="typeOfGST"
//                   value={formData.typeOfGST}
//                   onChange={(e) =>
//                     setFormData({ ...formData, typeOfGST: e.target.value })
//                   }
//                   className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="" disabled>
//                     Select GST type
//                   </option>
//                   <option value="CGST+SGST">CGST+SGST</option>
//                   <option value="IGST">IGST</option>
//                 </select>
//               </div>

//               <div className=" w-1/2">
//                 <label
//                   htmlFor="percentageOfGST"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Percentage of GST
//                   <span className="text-red-600">*</span>
//                 </label>
//                 <select
//                   id="percentageOfGST"
//                   name="percentageOfGST"
//                   value={formData.percentageOfGST}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       percentageOfGST: e.target.value,
//                     })
//                   }
//                   className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="" disabled>
//                     Select GST percentage
//                   </option>
//                   <option value={2.5}>2.5%</option>
//                   <option value={5}>5%</option>
//                   <option value={6.1}>6.1%</option>
//                   <option value={9}>9%</option>
//                   <option value={12}>12%</option>
//                   <option value={18}>18%</option>
//                   <option value={24}>24%</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-around w-full gap-4">
//             <div className="w-1/4">
//               <label
//                 htmlFor="descHeading"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Description Heading
//               </label>
//               <input
//                 type="text"
//                 id="descHeading"
//                 name="descHeading"
//                 value={formData.descHeading}
//                 onChange={(e) =>
//                   setFormData({ ...formData, descHeading: e.target.value })
//                 }
//                 className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="w-1/4">
//               <label
//                 htmlFor="billAmount"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Amount
//                 <span className="text-red-600">*</span>
//               </label>
//               <input
//                 required
//                 type="number"
//                 id="billAmount"
//                 name="billAmount"
//                 value={formData.billAmount}
//                 onChange={(e) => {
//                   setFormData({ ...formData, billAmount: e.target.value });
//                   handleAmountInput(e);
//                 }}
//                 className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="w-1/4">
//               <label
//                 htmlFor="billTotalAmount"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Amount after Discount
//               </label>
//               <input
//                 type="number"
//                 id=""
//                 name=""
//                 value={amountAfterDiscount}
//                 disabled
//                 className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="w-1/4">
//               <label
//                 htmlFor="billTotalAmount"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Total Amount
//                 <span className="text-red-600">*</span>
//               </label>
//               <input
//                 required
//                 type="number"
//                 id="billTotalAmount"
//                 name="billTotalAmount"
//                 value={formData.billTotalAmount}
//                 onChange={(e) => {
//                   setFormData({ ...formData, billTotalAmount: e.target.value });
//                   handleTotalAmountInput(e);
//                 }}
//                 className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-around w-full gap-4">
//           <div className="w-1/4">
//             <label
//               htmlFor="billClientName"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Bill Client Name
//             </label>
//             <input
//               type="text"
//               id="billClientName"
//               name="billClientName"
//               value={formData.billClientName}
//               onChange={(e) =>
//                 setFormData({ ...formData, billClientName: e.target.value })
//               }
//               className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="w-1/4">
//             <label
//               htmlFor="clientGSTNumber"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Client GST Number
//             </label>
//             <input
//               type="text"
//               id="clientGSTNumber"
//               name="clientGSTNumber"
//               value={formData.clientGSTNumber}
//               onChange={(e) =>
//                 setFormData({ ...formData, clientGSTNumber: e.target.value })
//               }
//               className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="w-1/4">
//             <label
//               htmlFor="amountSummary"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Amount Summary
//             </label>
//             <input
//               type="text"
//               id="amountSummary"
//               name="amountSummary"
//               value={formData.amountSummary}
//               onChange={(e) =>
//                 setFormData({ ...formData, amountSummary: e.target.value })
//               }
//               className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="w-1/4">
//             <label
//               htmlFor="address"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Address
//               <span className="text-red-600">*</span>
//             </label>
//             <textarea
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//               className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         <div className="flex justify-around w-full gap-4"></div>

//         <div className="flex justify-center pb-4">
//           <button
//             type="submit"
//             className="w-full sm:w-auto px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md font-medium transition"
//           >
//             Save Bill Details
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default MultiROBillGeneration;

import axios from "axios";
import React, { useEffect, useState } from "react";
import InvoicePDF from "./TaxInvoiceView/TaxInvoiceView";
import { PDFDownloadLink } from "@react-pdf/renderer";

const MultiROBillGeneration = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]); // multiple
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    orderId: "", // now can hold comma-separated values
    descHeading: "",
    billDate: "",
    typeOfGST: "CGST+SGST",
    percentageOfGST: 2.5,
    discount: 0,
    address: "",
    billAmount: 0,
    billTotalAmount: 0,
    clientGSTNumber: "",
    amountSummary: "",
    billClientName: "", // comma-separated client names
  });
  const [billAmounts, setBillAmounts] = useState([]); // dynamic per order

  const [amountAfterDiscount, setAmountAfterDiscount] = useState(
    formData.billAmount
  );

  // 🧮 Amount Calculation Logic
  const handleAmountInput = (e) => {
    const value = parseFloat(e.target.value);
    const discount = parseFloat(formData.discount) || 0;
    const percentageOfGST = parseFloat(formData.percentageOfGST) || 0;

    const discountedAmount = value - discount;
    setAmountAfterDiscount(discountedAmount);

    let totalAmount = discountedAmount;
    if (formData.typeOfGST === "CGST+SGST") {
      totalAmount =
        discountedAmount + discountedAmount * ((percentageOfGST * 2) / 100);
    } else if (formData.typeOfGST === "IGST") {
      totalAmount =
        discountedAmount + discountedAmount * (percentageOfGST / 100);
    } else {
      alert("Please fill in the Type of GST and Percentage of GST first.");
    }

    setFormData((prev) => ({
      ...prev,
      billAmount: value,
      billTotalAmount: parseFloat(totalAmount.toFixed(2)),
    }));
  };

  const handleTotalAmountInput = (e) => {
    const totalValue = parseFloat(e.target.value);
    const discount = parseFloat(formData.discount) || 0;
    const percentageOfGST = parseFloat(formData.percentageOfGST) || 0;

    let baseAmount = totalValue;

    if (formData.typeOfGST === "CGST+SGST") {
      baseAmount = totalValue / (1 + (percentageOfGST * 2) / 100);
    } else if (formData.typeOfGST === "IGST") {
      baseAmount = totalValue / (1 + percentageOfGST / 100);
    } else {
      alert("Please fill in the Type of GST and Percentage of GST first.");
    }

    const billAmountBeforeDiscount = baseAmount + discount;
    setAmountAfterDiscount(baseAmount);

    setFormData((prev) => ({
      ...prev,
      billTotalAmount: totalValue,
      billAmount: parseFloat(billAmountBeforeDiscount.toFixed(2)),
    }));
  };

  // 🔄 Fetch Orders
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
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🧠 When user types multiple Order IDs (comma-separated)
  //   useEffect(() => {
  //     const timeout = setTimeout(() => {
  //       if (formData.orderId.trim() !== "") {
  //         const orderIds = formData.orderId
  //           .split(",")
  //           .map((id) => id.trim())
  //           .filter((id) => id !== "");

  //         // Find matching orders
  //         const matchedOrders = allOrders.filter((order) =>
  //           orderIds.includes(order.orderId.toString())
  //         );

  //         setSelectedOrders(matchedOrders);

  //         // 🔹 Check if some order IDs are not found
  //         const foundIds = matchedOrders.map((o) => o.orderId.toString());
  //         const notFoundIds = orderIds.filter((id) => !foundIds.includes(id));

  //         if (notFoundIds.length > 0) {
  //           alert(`RO not found for Order ID(s): ${notFoundIds.join(", ")}`);
  //         }

  //         // 🔹 Update client names if matches exist
  //         if (matchedOrders.length > 0) {
  //           const names = matchedOrders.map((o) => o.clientName).join(", ");
  //           setFormData((prev) => ({
  //             ...prev,
  //             billClientName: names,
  //           }));
  //         } else {
  //           setFormData((prev) => ({
  //             ...prev,
  //             billClientName: "",
  //           }));
  //         }
  //       }
  //     }, 800);

  //     return () => clearTimeout(timeout);
  //   }, [formData.orderId, allOrders]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData.orderId.trim() !== "") {
        const orderIds = formData.orderId
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id !== "");

        const matchedOrders = allOrders.filter((order) =>
          orderIds.includes(order.orderId.toString())
        );

        setSelectedOrders(matchedOrders);

        // 🆕 Initialize Amount fields dynamically
        setBillAmounts(new Array(orderIds.length).fill(0));

        const foundIds = matchedOrders.map((o) => o.orderId.toString());
        const notFoundIds = orderIds.filter((id) => !foundIds.includes(id));

        if (notFoundIds.length > 0) {
          alert(`RO not found for Order ID(s): ${notFoundIds.join(", ")}`);
        }

        if (matchedOrders.length > 0) {
          const names = matchedOrders.map((o) => o.clientName).join(", ");
          setFormData((prev) => ({
            ...prev,
            billClientName: names,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            billClientName: "",
          }));
        }
      } else {
        setSelectedOrders([]);
        setBillAmounts([]);
      }
    // 🆕 Clear all amount-related fields when clearing selection
    setFormData((prev) => ({
      ...prev,
      billAmount: 0,
      billTotalAmount: 0,
      discount: 0,
      amountSummary: "",
    }));
    setAmountAfterDiscount(0);
    }, 800);

    return () => clearTimeout(timeout);
  }, [formData.orderId, allOrders]);

  //   const handleDynamicAmountChange = (index, value) => {
  //     const newAmounts = [...billAmounts];
  //     newAmounts[index] = parseFloat(value) || 0;
  //     setBillAmounts(newAmounts);

  //     // Auto-calc total
  //     const discount = parseFloat(formData.discount) || 0;
  //     const percentageOfGST = parseFloat(formData.percentageOfGST) || 0;

  //     const totalBeforeTax = newAmounts.reduce((sum, v) => sum + v, 0) - discount;
  //     let total = totalBeforeTax;

  //     if (formData.typeOfGST === "CGST+SGST") {
  //       total += totalBeforeTax * ((percentageOfGST * 2) / 100);
  //     } else if (formData.typeOfGST === "IGST") {
  //       total += totalBeforeTax * (percentageOfGST / 100);
  //     }

  //     setFormData((prev) => ({
  //       ...prev,
  //       billAmount: newAmounts,
  //       billTotalAmount: parseFloat(total.toFixed(2)),
  //     }));
  //   };
  // 🧮 Handles amount changes per order & recalculates total
  const handleDynamicAmountChange = (index, value) => {
    const newAmounts = [...billAmounts];
    newAmounts[index] = parseFloat(value) || 0;
    setBillAmounts(newAmounts);

    const discount = parseFloat(formData.discount) || 0;
    const percentageOfGST = parseFloat(formData.percentageOfGST) || 0;

    // 🔹 Step 1: Total before tax and discount
    const totalBeforeDiscount = newAmounts.reduce((sum, v) => sum + v, 0);

    // 🔹 Step 2: Apply global discount
    const discountedTotal = totalBeforeDiscount - discount;

    // 🔹 Step 3: Apply GST on discounted total
    let totalAfterGST = discountedTotal;
    if (formData.typeOfGST === "CGST+SGST") {
      totalAfterGST += discountedTotal * ((percentageOfGST * 2) / 100);
    } else if (formData.typeOfGST === "IGST") {
      totalAfterGST += discountedTotal * (percentageOfGST / 100);
    }

    // 🔹 Step 4: Update state
    setFormData((prev) => ({
      ...prev,
      billAmount: newAmounts,
      billTotalAmount: parseFloat(totalAfterGST.toFixed(2)),
    }));
  };

  useEffect(() => {
    if (billAmounts.length > 0) {
      // Recalculate total when discount, GST %, or type changes
      const totalBeforeDiscount = billAmounts.reduce((sum, v) => sum + v, 0);
      const discount = parseFloat(formData.discount) || 0;
      const percentageOfGST = parseFloat(formData.percentageOfGST) || 0;

      const discountedTotal = totalBeforeDiscount - discount;

      setAmountAfterDiscount(discountedTotal);

      let totalAfterGST = discountedTotal;
      if (formData.typeOfGST === "CGST+SGST") {
        totalAfterGST += discountedTotal * ((percentageOfGST * 2) / 100);
      } else if (formData.typeOfGST === "IGST") {
        totalAfterGST += discountedTotal * (percentageOfGST / 100);
      }

      setFormData((prev) => ({
        ...prev,
        billTotalAmount: parseFloat(totalAfterGST.toFixed(2)),
      }));
    }
  }, [
    formData.discount,
    formData.percentageOfGST,
    formData.typeOfGST,
    billAmounts,
  ]);

  // 💾 Save Bill
  const handleSaveBillDetails = async () => {
    const orderIds = formData.orderId
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");

    if (orderIds.length === 0) {
      alert("Please enter at least one Order ID");
      return;
    }

    const validOrders = allOrders.filter((order) =>
      orderIds.includes(order.orderId.toString())
    );

    if (validOrders.length !== orderIds.length) {
      alert("Some Order IDs are invalid. Please check.");
      return;
    }

    for (const order of validOrders) {
      if (
        !order.commonDetailsCompleted ||
        !order.releasedOrderDetailsCompleted
      ) {
        alert(
          `RO ${order.orderId} must be completed before saving bill details.`
        );
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/save-multi-bill`,
        {
          orderIds,
          descHeading: formData.descHeading,
          billDate: formData.billDate,
          typeOfGST: formData.typeOfGST,
          percentageOfGST: parseFloat(formData.percentageOfGST),
          discount: parseFloat(formData.discount),
          address: formData.address,
          billAmount: billAmounts, // 👈 send array
          billTotalAmount: parseFloat(formData.billTotalAmount),
          clientGSTNumber: formData.clientGSTNumber,
          amountSummary: formData.amountSummary,
          billClientName: formData.billClientName,
        },
        { headers: { Authorization: `${token}` } }
      );
      if (response.status === 200) {
        alert("Bill Details saved for all selected Order IDs!");
      }
    } catch (err) {
      console.error("Failed to save bill:", err);
      alert("Error while saving bill details.");
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[80vw] h-[90vh] bg-white p-8 space-y-6">
      <h4 className="text-3xl font-bold text-gray-800 border-b pb-3">
        Multiple RO's Bill Generation
      </h4>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveBillDetails();
        }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="flex justify-around w-full gap-4">
            {/* 🆕 Multi Order IDs Input */}
            <div className="w-1/4">
              <label
                htmlFor="orderId"
                className="block text-sm font-medium text-gray-700"
              >
                Order IDs (comma separated)
                <span className="text-red-600">*</span>
              </label>
              <input
                required
                type="text"
                id="orderId"
                name="orderId"
                placeholder="e.g. 101, 102, 103"
                value={formData.orderId}
                onChange={(e) =>
                  setFormData({ ...formData, orderId: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Keep rest of inputs same as your original */}
            <div className="w-1/4">
              <label
                htmlFor="billDate"
                className="block text-sm font-medium text-gray-700"
              >
                Bill Date<span className="text-red-600">*</span>
              </label>
              <input
                required
                type="date"
                id="billDate"
                name="billDate"
                value={formData.billDate}
                onChange={(e) =>
                  setFormData({ ...formData, billDate: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-1/4">
              <label
                htmlFor="descHeading"
                className="block text-sm font-medium text-gray-700"
              >
                Description Heading
              </label>
              <input
                type="text"
                id="descHeading"
                name="descHeading"
                value={formData.descHeading}
                onChange={(e) =>
                  setFormData({ ...formData, descHeading: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* <div className="w-1/4">
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700"
              >
                Bill Discount<span className="text-red-600">*</span>
              </label>
              <input
                required
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
                className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div> */}
            <div className="flex gap-2 w-2/3">
              <div className=" w-1/2">
                <label
                  htmlFor="typeOfGST"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type of GST
                  <span className="text-red-600">*</span>
                </label>
                <select
                  id="typeOfGST"
                  name="typeOfGST"
                  value={formData.typeOfGST}
                  onChange={(e) =>
                    setFormData({ ...formData, typeOfGST: e.target.value })
                  }
                  className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select GST type
                  </option>
                  <option value="CGST+SGST">CGST+SGST</option>
                  <option value="IGST">IGST</option>
                </select>
              </div>

              <div className=" w-1/2">
                <label
                  htmlFor="percentageOfGST"
                  className="block text-sm font-medium text-gray-700"
                >
                  Percentage of GST
                  <span className="text-red-600">*</span>
                </label>
                <select
                  id="percentageOfGST"
                  name="percentageOfGST"
                  value={formData.percentageOfGST}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      percentageOfGST: e.target.value,
                    })
                  }
                  className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select GST percentage
                  </option>
                  <option value={2.5}>2.5%</option>
                  <option value={5}>5%</option>
                  <option value={6.1}>6.1%</option>
                  <option value={9}>9%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={24}>24%</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Auto Display Multiple Client Names */}
        <div className="flex justify-around w-full gap-4 mt-4">
          <div className="flex justify-around w-full gap-4">
            {/* ✅ Dynamic Amount Fields for Each Order */}
            <div className="w-full mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Amounts for Each Order ID:
              </label>

              <div className="grid grid-cols-3 gap-4">
                {selectedOrders.map((order, index) => (
                  <div key={order.orderId} className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">
                      Amount ({order.orderId})
                    </label>
                    <input
                      type="number"
                      value={billAmounts[index] || ""}
                      onChange={(e) =>
                        handleDynamicAmountChange(index, e.target.value)
                      }
                      placeholder={`Enter amount for ${order.orderId}`}
                      className="px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700">
                    Discount
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({ ...formData, discount: e.target.value })
                    }
                    className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm"
                  />
                </div>

                <div className="w-1/4">
                  <label
                    htmlFor="billTotalAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Amount after Discount
                  </label>
                  <input
                    type="number"
                    id=""
                    name=""
                    value={amountAfterDiscount}
                    disabled
                    className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700">
                    Total Bill Amount (after GST)
                  </label>
                  <input
                    type="number"
                    value={formData.billTotalAmount}
                    readOnly
                    className="mt-1 w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-around w-full gap-4">
          <div className="w-1/4">
            <label
              htmlFor="billClientName"
              className="block text-sm font-medium text-gray-700"
            >
              Bill Client Name
            </label>
            <input
              type="text"
              id="billClientName"
              name="billClientName"
              value={formData.billClientName}
              onChange={(e) =>
                setFormData({ ...formData, billClientName: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* <div className="w-1/4">
            <label
              htmlFor="billClientName"
              className="block text-sm font-medium text-gray-700"
            >
              Bill Client Names
            </label>
            <input
              type="text"
              id="billClientName"
              name="billClientName"
              value={formData.billClientName}
              
              className="mt-1 w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100"
            />
          </div> */}
          <div className="w-1/4">
            <label
              htmlFor="clientGSTNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Client GST Number
            </label>
            <input
              type="text"
              id="clientGSTNumber"
              name="clientGSTNumber"
              value={formData.clientGSTNumber}
              onChange={(e) =>
                setFormData({ ...formData, clientGSTNumber: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-1/4">
            <label
              htmlFor="amountSummary"
              className="block text-sm font-medium text-gray-700"
            >
              Amount Summary
            </label>
            <input
              type="text"
              id="amountSummary"
              name="amountSummary"
              value={formData.amountSummary}
              onChange={(e) =>
                setFormData({ ...formData, amountSummary: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-1/4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
              <span className="text-red-600">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1 w-full px-4 py-2 border border-purple-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center pb-4 mt-8">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md font-medium transition"
          >
            Save Bill Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiROBillGeneration;
