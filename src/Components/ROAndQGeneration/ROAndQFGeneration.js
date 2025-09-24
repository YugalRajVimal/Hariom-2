import axios from "axios";
import React, { useEffect, useState } from "react";
import ReleasedOrderPDF from "../ReleasedOrderView/ReleasedOrderView";
import { pdf } from "@react-pdf/renderer";

const ROAndQFGeneration = () => {
  const [formData, setFormData] = useState({
    // Common Details
    publicationName: "",
    clientName: "",
    noOfAds: 0,
    scheme: "",
    position: "",
    hui: "",
    remark: "",
    dateOfInsertion: "",

    // Released Order Details
    agencyCode: "ins 11141",
    orderRefId: "",
    category: "",
    code: "",
    roRate: 0,
    roDate: new Date().toISOString().split("T")[0],
    roHeight: 0,
    roWidth: 0,
    roMultiplyBy: 1,
    percentageOfGST: 5,
    agencyCommission1: "",
    agencyCommission2: "",
    agencyCommission3: "",
    totalCommission: 0,
    roAmount: 0,
    roTotalAmount: 0,

    // Quotation Details
    qRate: "",
    qDate: "",
    qHeight: 0,
    qWidth: 0,
    qMultiplyBy: 0,
    qAmount: 0,
    qTotalAmount: 0,
    address: "",
    invoice: "",
    pincode: "",
    customerId: "",
    phone: "",
    dueDate: "",
    referral: "",
    paymentTerms: "",
    discount: "",

    // Status Flags
    commonDetailsCompleted: false,
    releasedOrderDetailsCompleted: false,
    quotationDetailsCompleted: false,
  });

  const [gstAmount, setGSTAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  useEffect(() => {
    setGSTAmount(formData.roTotalAmount * (formData.percentageOfGST / 100));
  }, [formData.percentageOfGST, formData.roTotalAmount]);

  useEffect(() => {
    setNetAmount(
      formData.roTotalAmount +
        formData.roTotalAmount * (formData.percentageOfGST / 100)
    );
  }, [formData.percentageOfGST, formData.roTotalAmount]);

  const uploadFile = async (orderId, ro) => {
    console.log("Starting uploadFile function for release order", orderId);
    try {
      const blob = await pdf(
        <ReleasedOrderPDF orderId={orderId} showRODetails={ro} />
      ).toBlob();
      console.log("Blob created for release order", orderId);
      const formData = new FormData();
      const customName = `RO.No.${orderId}.pdf`;
      formData.append("file", blob, customName);
      console.log("FormData prepared for release order", orderId);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/upload-release-order`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log("Fetch completed for release order", orderId);
      const data = await res.json();
      console.log("Data received for release order", orderId, data);
      return data;
    } catch (error) {
      console.error(
        "Error occurred while uploading file for release order",
        orderId,
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

  const handlePreviewPDF = async (orderId, formData) => {
    console.log(
      "Starting handlePreviewPDF function for release order",
      orderId
    );
    const data = await uploadFile(orderId, formData);
    console.log("PDF file uploaded for release order", orderId, data);
    await previewFile(data);
    console.log("PDF file previewed for release order", orderId);
  };

  // Editing and Disable States
  const [roFormDisabled, setRoFormDisabled] = useState(false);
  const [roFormEditing, setRoFormEditing] = useState(false);

  const generateUniqueId = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/get-next-order-id`
      );
      const orderIdTemp = await response.data.nextOrderId;
      console.log(response.data.nextOrderId);
      return orderIdTemp;
    } catch (error) {
      console.error("Failed to generate unique ID:", error);
      return null;
    }
  };

  // Order Management States
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchOrderId = async () => {
      const uniqueId = await generateUniqueId();
      setOrderId(uniqueId);
    };
    fetchOrderId();
  }, []);

  const [selectedOrderId, setSelectedOrderId] = useState("--");
  const [newOrder, setNewOrder] = useState(true);
  const [oldOrders, setOldOrders] = useState([]);
  const [oldOrder, setOldOrder] = useState("");

  // Client & Publisher States
  const [clients, setClients] = useState([]);
  const [publishers, setPublishers] = useState([]);

  // Miscellaneous States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const orders = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-all-orders`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        console.log(orders.data);
        setOldOrders(orders.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-all-clients-publishers`,
          {
            headers: { Authorization: `${token}` },
          }
        );

        console.log(response.data);

        setClients(response.data.clients);
        setPublishers(response.data.publishers);

        console.log(clients);
        console.log(publishers);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log("Clients:", clients);
    console.log("Publishers:", publishers);
  }, [clients, publishers]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveReleasedOrder = async () => {
    // Handle Released Order submit here
    const roDetails = [
      //common
      "publicationName",
      "clientName",
      "noOfAds",
      "scheme",
      "position",
      "hui",
      "dateOfInsertion",
      // ro
      "agencyCode",
      "orderRefId",
      "category",
      "roRate",
      "roDate",
      "roHeight",
      "roWidth",
      "roMultiplyBy",
      "percentageOfGST",
      "agencyCommission1",
      "totalCommission",
      "roAmount",
      "roTotalAmount",
    ];
    // const isComplete = roDetails.every((detail) => formData[detail]);
    // if (isComplete) {
    setRoFormDisabled(true);
    setRoFormEditing(false);
    setFormData((prev) => ({
      ...prev,
      releasedOrderDetailsCompleted: true,
    }));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/add-all-crq`,
        {
          orderId,
          ...formData,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in Step 1:", error);
      throw error;
    }
    // } else {
    //   alert("Please fill all Released Order details before proceeding.");
    // }
  };

  // Calculations
  useEffect(() => {
    const {
      roWidth,
      roHeight,
      qWidth,
      qHeight,
      roMultiplyBy,
      qMultiplyBy,
      qRate,
      roRate,
      agencyCommission1,
      agencyCommission2,
      agencyCommission3,
      discount,
    } = formData;

    const rW = parseFloat(roWidth) || 0;
    const rH = parseFloat(roHeight) || 0;
    const rR = parseFloat(roRate) || 0;
    const rM = parseInt(roMultiplyBy) || 1;
    const qW = parseFloat(qWidth) || 0;
    const qH = parseFloat(qHeight) || 0;
    const qR = parseFloat(qRate) || 0;
    const qM = parseInt(qMultiplyBy) || 1;

    const rArea = rW * rH;
    const roAmount = rArea * rR * rM;
    const qArea = qW * qH;
    const qAmount = qArea * qR * qM;

    console.log(agencyCommission1);
    console.log(agencyCommission2);
    console.log(agencyCommission3);

    const a1 = parseFloat(agencyCommission1) || 0;
    const a2 = parseFloat(agencyCommission2) || 0;
    const a3 = parseFloat(agencyCommission3) || 0;
    let step1 = roAmount - roAmount * (a1 / 100);
    let step2;
    let commission = roAmount * (a1 / 100);
    if (a2) {
      step2 = step1 - step1 * (a2 / 100);
      commission = step1 * (a2 / 100);
    } else {
      step2 = step1;
    }
    let step3;
    if (a3) {
      step3 = step2 - step2 * (a3 / 100);
      commission = step2 * (a3 / 100);
    } else {
      step3 = step2;
    }
    const totalCommission = parseFloat(commission.toFixed(2));
    const roTotalAmount = parseFloat(step3.toFixed(2));
    const qTotalAmount = qAmount - discount;

    setFormData((prev) => ({
      ...prev,
      roAmount,
      totalCommission,
      roTotalAmount,
      qAmount,
      qTotalAmount,
    }));
  }, [
    formData.roWidth,
    formData.roHeight,
    formData.qWidth,
    formData.qHeight,
    formData.roMultiplyBy,
    formData.qMultiplyBy,
    formData.roRate,
    formData.noOfAds,
    formData.agencyCommission1,
    formData.agencyCommission2,
    formData.agencyCommission3,
    formData.qRate,
    formData.discount,
  ]);

  const handleSelectOldOrder = async (e) => {
    {
      if (e.target.value == "--") {
        setOrderId(await generateUniqueId());
        setNewOrder(true);
        setFormData({
          publicationName: "",
          clientName: "",
          noOfAds: 0,
          scheme: "",
          position: "",
          roHeight: 0,
          roWidth: 0,
          qHeight: 0,
          qWidth: 0,
          roMultiplyBy: 1,
          qMultiplyBy: 0,
          hui: "",
          remark: "",
          dateOfInsertion: "",
          agencyCode: "ins 11141",
          orderRefId: "",
          category: "",
          code: "",
          roRate: 0,
          roDate: new Date().toISOString().split("T")[0],
          agencyCommission1: "",
          agencyCommission2: "",
          agencyCommission3: "",
          totalCommission: 0,
          roAmount: 0,
          roTotalAmount: 0,
          address: "",
          invoice: "",
          pincode: "",
          customerId: "",
          phone: "",
          dueDate: "",
          referral: "",
          qRate: "",
          paymentTerms: "",
          discount: "",
          qDate: "",
        });
      } else {
        setNewOrder(false);
        const selectedOrder = oldOrders.find(
          (order) => order._id === e.target.value
        );
        if (selectedOrder) {
          setFormData(selectedOrder);
          setOldOrder(selectedOrder);
          setOrderId(selectedOrder.orderId);
          if (selectedOrder.releasedOrderDetailsCompleted) {
            setRoFormDisabled(true);
          }
        }
      }

      //   setOldOrder(oldOrders.find((order) => order.id === e.target.value));
    }
  };

  const handleNewOrder = async () => {
    {
      setOrderId(await generateUniqueId());
      setNewOrder(true);
      setSelectedOrderId("--");
      setRoFormDisabled(false);
      setRoFormEditing(true);
      setRoFormEditing(true);

      // formData.quotationDetailsCompleted = false;
      // oldOrder.quotationDetailsCompleted = false;

      setOldOrder("");

      setFormData({
        publicationName: "",
        clientName: "",
        noOfAds: 0,
        scheme: "",
        position: "",
        roHeight: 0,
        roWidth: 0,
        qHeight: 0,
        qWidth: 0,
        roMultiplyBy: 1,
        qMultiplyBy: 0,
        hui: "",
        remark: "",
        dateOfInsertion: "",
        agencyCode: "ins 11141",
        orderRefId: "",
        category: "",
        code: "",
        roRate: 0,
        roDate: new Date().toISOString().split("T")[0],
        percentageOfGST: 5,
        agencyCommission1: "",
        agencyCommission2: "",
        agencyCommission3: "",
        totalCommission: 0,
        roAmount: 0,
        roTotalAmount: 0,
        address: "",
        invoice: "",
        pincode: "",
        customerId: "",
        phone: "",
        dueDate: "",
        referral: "",
        qRate: "",
        paymentTerms: "",
        discount: "",
        qDate: "",
        quotationDetailsCompleted: false,
      });
    }
  };

  const [searchResult, setSearchResult] = useState([]);
  // Handles the input change and filters the clients
  const handleClientSearch = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, clientName: value }));

    if (value.trim() === "") {
      setSearchResult([]);
      return;
    }

    // Assuming `clients` is a state containing the list of all client names
    const filteredClients = clients.filter((client) =>
      client.toLowerCase().includes(value.toLowerCase())
    );

    console.log("Filtered Clients:", filteredClients);
    setSearchResult(filteredClients);
  };

  const [searchResultPublication, setSearchResultPublication] = useState([]);
  // Handles the input change and filters the clients
  const handlePublicationSearch = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, publicationName: value }));

    if (value.trim() === "") {
      setSearchResultPublication([]);
      return;
    }

    // Assuming `clients` is a state containing the list of all client names
    const filteredPublications = publishers.filter((publication) =>
      publication.toLowerCase().includes(value.toLowerCase())
    );

    console.log("filtered Publications", filteredPublications);
    setSearchResultPublication(filteredPublications);
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[80vw] orverflow-y-auto mb-10 ">
      {/* Modernized Common Details */}
      <div className="flex justify-between px-2 py-1 w-full bg-gray-100 shadow-sm ">
        <div className="text-left">
          <h4 className="text-gray-700 font-bold text-lg">
            Order ID:{" "}
            <span className="text-gray-900 text-xl font-semibold">
              {orderId}
            </span>
          </h4>
        </div>
        <div className="text-right">
          <span className="text-gray-700 font-bold text-lg">
            {newOrder ? "New Order" : "Old Order"}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center px-2 py-1">
        <button
          onClick={() => handleNewOrder()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          New Order
        </button>
        <div className="w-[70%] flex flex-col">
          {/* <label htmlFor="oldOrder" className="mb-1 font-xl text-left pr-2">
            Select Old Order
          </label> */}
          <select
            id="oldOrder"
            value={selectedOrderId}
            onChange={(e) => handleSelectOldOrder(e)}
            className="w-full border border-purple-700 rounded-md px-2 py-1 bg-white shadow"
          >
            <option value="--">Select Old Order</option>
            {oldOrders.map((order) => (
              <option key={order.id} value={order._id}>
                {order.orderId} | {order.clientName} | {order.publicationName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div className="bg-blue-200 px-2 py-1 rounded-t-md transition ease-in-out duration-200 mt-2 mx-12 text-xl text-left font-semibold flex justify-between items-center ">
          <span>Fill Details</span>
          {/* <span>{collapseCommonForm ? "↓" : "↑"}</span>  */}
        </div>
        <div
          className={`flex flex-col justify-center items-center bg-white rounded-t-xl mx-10 py-6  `}
        >
          <div className="w-full md:w-[90%] flex flex-col  gap-3">
            <div className=" flex flex-row gap-6 justify-around">
              {/* RoNo */}
              <div className="flex flex-col w-1/3">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  R.O. No.
                </label>
                <input
                  type="text"
                  value={orderId}
                  disabled
                  className="border bg-zinc-200 border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
              {/* Client Name */}
              <div className="flex flex-col relative w-2/3">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Client Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleClientSearch}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  disabled={roFormDisabled}
                  autoComplete="off"
                  required
                />

                {/* Dropdown list */}
                {searchResult.length > 0 && (
                  <ul className="absolute top-full left-0 w-full max-h-40 overflow-y-auto mt-1 border border-purple-400 bg-white shadow-md rounded-md z-10">
                    {searchResult.map((client, index) => (
                      <li
                        key={index}
                        className="px-2 py-1 hover:bg-purple-100 cursor-pointer text-sm "
                        onClick={() => {
                          setFormData({ ...formData, clientName: client });
                          setSearchResult([]);
                        }}
                      >
                        {client}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className=" flex flex-row gap-6 justify-around">
              {/* Publisher Name  */}
              <div className="flex flex-col relative w-2/3 ">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Publication Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="publicationName"
                  value={formData.publicationName}
                  onChange={handlePublicationSearch}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  disabled={roFormDisabled}
                  autoComplete="off"
                  required
                />

                {/* Dropdown list */}
                {searchResultPublication.length > 0 && (
                  <ul className="absolute top-full left-0 w-full max-h-40 overflow-y-auto mt-1 border border-purple-400 bg-white shadow-md rounded-md z-10">
                    {searchResultPublication.map((publication, index) => (
                      <li
                        key={index}
                        className="px-2 py-1 hover:bg-purple-100 cursor-pointer text-sm"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            publicationName: publication,
                          });
                          setSearchResultPublication([]);
                        }}
                      >
                        {publication}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Date of Insertion */}
              <div className="flex flex-col w-1/3">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Date of Insertion <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="dateOfInsertion"
                  value={formData.dateOfInsertion}
                  onChange={handleChange}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  disabled={roFormDisabled}
                  required
                />
              </div>
            </div>
            <div className=" flex flex-row gap-6 justify-around">
              {/* Position  */}
              <div className="flex flex-col w-1/4">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Position <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
              {/* Category */}
              <div className="flex flex-col w-1/4">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Category <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
              {/* No. Of Ads  */}
              <div className="flex flex-col w-1/4">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  No. of Ads <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="noOfAds"
                  value={formData.noOfAds}
                  onChange={handleChange}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  disabled={roFormDisabled}
                  required
                />
              </div>
              {/* Order / Reference ID */}
              <div className="flex flex-col w-1/4">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Order / Reference ID <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="orderRefId"
                  value={formData.orderRefId}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
            </div>
            <div className=" flex flex-row gap-6 justify-around">
              {/* Hue */}
              <div className="flex flex-col w-1/4">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  HUI <span className="text-red-600">*</span>
                </label>
                <div className="flex gap-4 justify-evenly items-center">
                  <label>
                    <input
                      type="radio"
                      name="hui"
                      value="B/W"
                      checked={formData.hui === "B/W"}
                      onChange={handleChange}
                      disabled={roFormDisabled}
                      className="h-full "
                      required
                    />
                    <span className="px-4">B/W</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="hui"
                      value="Color"
                      checked={formData.hui === "Color"}
                      onChange={handleChange}
                      disabled={roFormDisabled}
                      className="h-full"
                      required
                    />
                    <span className="px-4">Color</span>
                  </label>
                </div>
              </div>
              {/* Scheme */}
              <div className="flex flex-col w-1/4">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Scheme / Matter Instruction{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="scheme"
                  value={formData.scheme}
                  onChange={handleChange}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  disabled={roFormDisabled}
                  required
                />
              </div>
              {/* Width */}
              <div className="flex flex-col w-1/4">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Width (in cm) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="roWidth"
                  value={formData.roWidth}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  required
                />
              </div>

              {/* Height */}
              <div className="flex flex-col w-1/4">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Height (in cm) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="roHeight"
                  value={formData.roHeight}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  required
                />
              </div>
            </div>
            <div className=" flex flex-row gap-6 justify-around">
              {/* Rate */}
              <div className="flex flex-col w-1/2">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Rate <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="roRate"
                  value={formData.roRate}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
              {/* Multiply By  */}
              <div className="flex flex-col w-1/2">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Multiply By <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="roMultiplyBy"
                  value={formData.roMultiplyBy}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  required
                />
              </div>
              {/*Amount */}
              <div className="flex flex-col w-1/2">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Amount
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="roAmount"
                  value={formData.roAmount}
                  disabled
                  onChange={handleChange}
                  className="border bg-zinc-200 border-purple-700  rounded-md px-2 py-1 w-full"
                />
              </div>
              {/* Agency Commission 1 */}
              <div className="flex flex-col w-1/2">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Agency Commission 1 <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="agencyCommission1"
                  value={formData.agencyCommission1}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
              {/* Agency Commission 2 */}
              <div className="flex flex-col w-1/2">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Agency Commission 2
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="agencyCommission2"
                  value={formData.agencyCommission2}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
            </div>
            <div className=" flex flex-row gap-6 justify-around">
              {/* Agency Commission 3 */}
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Agency Commission 3
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="agencyCommission3"
                  value={formData.agencyCommission3}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
              {/*Total Agency Commissions */}
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Total Commission
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="totalCommission"
                  value={formData.totalCommission}
                  disabled
                  onChange={handleChange}
                  className="border bg-zinc-200 border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
              {/*Total Agency Commissions */}
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Total Amount
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="roTotalAmount"
                  value={formData.roTotalAmount}
                  disabled
                  onChange={handleChange}
                  className="border bg-zinc-200 border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>
              {/*Percentage of GST */}
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  GST (in %) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  name="percentageOfGST"
                  value={formData.percentageOfGST}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  required
                />
              </div>
              {/* GST Amount */}
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  GST Amount
                </label>
                <input
                  type="number"
                  name="gstAmount"
                  value={gstAmount}
                  disabled
                  className="border bg-zinc-200 border-purple-700 rounded-md px-2 py-1 w-full"
                  required
                />
              </div>
            </div>

            <div className=" flex flex-row gap-6 justify-around">
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Net Amount
                </label>
                <input
                  type="number"
                  name="netAmount"
                  value={netAmount}
                  disabled
                  className="border bg-zinc-200 border-purple-700 rounded-md bg-white  px-2 py-1 w-full"
                />
              </div>
              {/* Remark */}
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Remark
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                  disabled={roFormDisabled}
                  required
                />
              </div>
              {/* Code */}
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  disabled={roFormDisabled}
                  className="border border-purple-700 rounded-md px-2 py-1 w-full"
                />
              </div>

              {/* Agency Code */}
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Agency Code
                </label>
                <input
                  type="text"
                  name="agencyCode"
                  value={formData.agencyCode}
                  // onChange={handleChange}
                  disabled
                  className="border bg-zinc-200 border-purple-700 rounded-md bg-white  px-2 py-1 w-full"
                />
              </div>
              {/* Date */}
              <div className="flex flex-col w-1/5">
                <label className="whitespace-nowrap mb-1 font-xl text-left">
                  Date
                </label>
                <input
                  type="date"
                  name="roDate"
                  value={formatDate(formData.roDate)}
                  onChange={handleChange}
                  disabled
                  className="border bg-zinc-200 border-purple-700 rounded-md px-2 py-1 w-full"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Released Order Form and Quotation Form should be conditionally rendered */}

      <div
        className={`flex flex-col justify-center items-center bg-white rounded-b-xl mx-10 `}
      >
        <div className="flex gap-4">
          {oldOrder.releasedOrderDetailsCompleted ||
          formData.releasedOrderDetailsCompleted ? (
            <div className="flex gap-4">
              {roFormEditing || roFormEditing ? (
                <button
                  onClick={() => {
                    handleSaveReleasedOrder();
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2"
                >
                  Save All Details
                </button>
              ) : (
                <button
                  onClick={() => {
                    setRoFormDisabled(false);
                    setRoFormEditing(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2"
                >
                  Edit All Details
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                handleSaveReleasedOrder();
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2"
            >
              Save All Details
            </button>
          )}
        </div>

        {(formData.releasedOrderDetailsCompleted ||
          oldOrder.releasedOrderDetailsCompleted) && (
          <button
            onClick={() => handlePreviewPDF(orderId, formData)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-center my-2"
          >
            Preview R.O.
          </button>
        )}
      </div>
    </div>
  );
};

export default ROAndQFGeneration;
