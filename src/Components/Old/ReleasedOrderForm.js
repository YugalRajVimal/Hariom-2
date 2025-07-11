import axios from "axios";
import React, { useState, useEffect } from "react";

const ROForm = () => {
  const [formData, setFormData] = useState({
    roNo: `RO-${Date.now()}`,
    clientName: "",
    publicationName: "",
    insertionDate: "",
    position: "",
    category: "",
    noOfAds: 1,
    referenceNo: "",
    hui: "B/W",
    schemaMaterial: "",
    width: "",
    height: "",
    rate: "",
    amount: 0,
    agency1: "",
    agency2: "",
    agency3: "",
    totalCommission: 0,
    totalAmount: 0,
    remark: "",
    quotationFormNo: "", // Added Quotation Form Number
  });

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

  useEffect(() => {
    const { width, height, rate, noOfAds, agency1, agency2, agency3 } =
      formData;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const r = parseFloat(rate) || 0;
    const ads = parseInt(noOfAds) || 1;

    const area = w * h;
    const amount = area * r * ads;

    const a1 = parseFloat(agency1) || 0;
    const a2 = parseFloat(agency2) || 0;
    const a3 = parseFloat(agency3) || 0;
    const totalCommission = ((a1 + a2 + a3) / 100) * amount;
    const totalAmount = amount - totalCommission;

    setFormData((prev) => ({
      ...prev,
      amount,
      totalCommission,
      totalAmount,
    }));
  }, [
    formData.width,
    formData.height,
    formData.rate,
    formData.noOfAds,
    formData.agency1,
    formData.agency2,
    formData.agency3,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClientIdName = (e) => {
    const { name, value } = e.target;
    const selectedClient = clients.find(
      (client) => client.clientName === value
    );
    if (selectedClient) {
      setFormData((prev) => ({ ...prev, [`${name}Id`]: selectedClient._id }));
      setFormData((prev) => ({
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
      setFormData((prev) => ({
        ...prev,
        [`${name}Id`]: selectedPublisher._id,
      }));
      setFormData((prev) => ({
        ...prev,
        [`${name}Name`]: selectedPublisher.publisherName,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/create-released-order`,
        formData,
        { headers: { Authorization: `${token}` } }
      );
      console.log("Form Data Submitted:", response.data);
      alert("RO Saved Successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save data.");
    }
  };

  return (
    <div className="w-[80vw] h-[90vh]">
      <h4 className=" transition ease-in-out duration-200  mt-6 mx-12 mb-2 text-xl text-left font-semibold">
        Released Order Form
      </h4>
      <div className="flex flex-col justify-center items-center bg-white rounded-xl mx-10 mb-10 py-6">
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-[90%] flex flex-col gap-6 pb-6"
        >
          {/* RO No. */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">RO No.</label>
            <input
              type="text"
              value={formData.roNo}
              readOnly
              className="border border-purple-700 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Quotation Form Number */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">
              Quotation Form Number
            </label>
            <input
              type="text"
              name="quotationFormNo"
              value={formData.quotationFormNo}
              onChange={handleChange}
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Client Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">
              Client Name <span className="text-red-600">*</span>
            </label>
            <select
              name="client"
              value={formData.clientName}
              onChange={handleClientIdName}
              required
              className="border border-purple-700 rounded-md px-3 py-2 "
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client.clientName}>
                  {client.clientName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Position */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">
                Position <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. Front Page"
                required
                className="border border-purple-700 rounded-md px-3 py-2"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">
                Category <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Business"
                required
                className="border border-purple-700 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Reference No. */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">
                Reference No. <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="referenceNo"
                value={formData.referenceNo}
                onChange={handleChange}
                placeholder="e.g. 12345"
                required
                className="border border-purple-700 rounded-md px-3 py-2"
              />
            </div>

            {/* Schema Material */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">
                Schema Material <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="schemaMaterial"
                value={formData.schemaMaterial}
                onChange={handleChange}
                placeholder="e.g. PDF"
                required
                className="border border-purple-700 rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* Remark / Code / QRN */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">
              Remark / Code / QRN <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              placeholder="e.g. Important"
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Publication Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">
              Publication Name <span className="text-red-600">*</span>
            </label>
            <select
              name="publication"
              value={formData.publication}
              onChange={handlePublisherIdName}
              required
              className="border border-purple-700 rounded-md px-3 py-2 "
            >
              <option value="">Select Publication</option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.publisherName}>
                  {publisher.publisherName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Insertion Date */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">
                Date of Insertion <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                name="insertionDate"
                value={formData.insertionDate}
                onChange={handleChange}
                required
                className="border border-purple-700 rounded-md px-3 py-2"
              />
            </div>

            {/* HUI */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-left">
                HUI (Color / B/W) <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-6 justify-evenly items-center pt-2">
                {["B/W", "Color"].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="hui"
                      value={option}
                      checked={formData.hui === option}
                      onChange={handleChange}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Numbers Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "No. of Ads", name: "noOfAds", required: true },
              { label: "Width (cm)", name: "width", required: true },
              { label: "Height (cm)", name: "height", required: true },
              { label: "Rate", name: "rate", required: true },
            ].map((field) => (
              <div className="flex flex-col" key={field.name}>
                <label className="mb-1 font-medium text-left">
                  {field.label}{" "}
                  {field.required && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="border border-purple-700 rounded-md px-3 py-2"
                />
              </div>
            ))}
          </div>

          {/* Non-editable Amount Field */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-left">Amount</label>
            <input
              type="number"
              value={formData.amount.toFixed(2)}
              readOnly
              className="border border-purple-700 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Agency Commissions */}
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((num) => (
              <div className="flex flex-col" key={`agency${num}`}>
                <label className="mb-1 font-medium text-left">
                  Agency Commission {num} (%){" "}
                  <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="number"
                  name={`agency${num}`}
                  value={formData[`agency${num}`]}
                  onChange={handleChange}
                  className="border border-purple-700 rounded-md px-3 py-2"
                />
              </div>
            ))}
          </div>

          {/* Total Commission & Total Amount (read-only) */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Total Commission", name: "totalCommission" },
              { label: "Total Amount", name: "totalAmount" },
            ].map((field) => (
              <div className="flex flex-col" key={field.name}>
                <label className="mb-1 font-medium text-left">
                  {field.label}
                </label>
                <input
                  type="number"
                  value={formData[field.name].toFixed(2)}
                  readOnly
                  className="border border-purple-700 rounded-md px-3 py-2 bg-gray-100"
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-purple-800 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ROForm;
