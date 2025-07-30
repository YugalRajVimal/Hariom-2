import React, { useState, useEffect } from "react";
import axios from "axios";

const QuotationForm = () => {
  const [formData, setFormData] = useState({
    quotationFormNumber: "",
    clientName: "",
    publication: "",
    address: "",
    pincode: "",
    contactNo: "",
    refNo: "",
    paymentTerms: "",
    date: "",
    invoice: "",
    customerId: "",
    dueDate: "",
    dateOfInsertion: "",
    position: "",
    noOfAds: 0, // Added noOfAds field
    rate: 0,
    width: 0,
    height: 0,
    scheme: "",
    remark: "",
    discount: 0,
    amount: 0, // Added amount field
    totalAmount: 0, // Added totalAmount field
    percentageOfGST: 0, // Added percentageOfGST field
  });

  // Client & Publisher States
  const [clients, setClients] = useState([]);
  const [publishers, setPublishers] = useState([]);

  // Miscellaneous States
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const generateQuotationFormNumber = () => {
      const randomNumber = Math.floor(Math.random() * 1000000000);
      return `QF-${randomNumber}`;
    };
    setFormData((prev) => ({
      ...prev,
      date: today,
      quotationFormNumber: generateQuotationFormNumber(),
    }));
  }, []);

  useEffect(() => {
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/create-quotation`,
        {
          ...formData,
        },
        { headers: { Authorization: `${token}` } }
      );
      if (response.status === 201) {
        alert("Form submitted successfully");
      }
    } catch (error) {
      console.error("Error creating quotation", error);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      amount: prev.rate * prev.width * prev.height * prev.noOfAds,
      totalAmount: prev.amount - prev.discount,
    }));
  }, [
    formData.rate,
    formData.width,
    formData.height,
    formData.noOfAds,
    formData.discount,
  ]);

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
    setFormData((prev) => ({ ...prev, publication: value }));

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

  return (
    <div className="w-[80vw] h-[90vh] mx-auto py-8 px-8">
      <h2 className="text-2xl font-bold mb-6">Quotation Form</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-left">
        <div className="flex justify-around w-full gap-4">
          {/* Quotation Form Number (disabled) */}

          <div className="flex flex-col w-1/4">
            <label className="mb-1 text-left font-medium">
              Quotation Form Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="quotationFormNumber"
              value={formData.quotationFormNumber}
              disabled
              className="border border-purple-700 bg-slate-100 rounded-md px-3 py-2"
            />
          </div>
          {/* Client Name  */}
          <div className="flex flex-col h-20 relative w-3/4">
            <label className="mb-1 font-medium text-left">
              Client Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleClientSearch}
              className="border border-purple-700 rounded-md px-3 py-2 "
              autoComplete="off"
              required
            />

            {/* Dropdown list */}
            {searchResult.length > 0 && (
              <ul className="absolute top-full left-0 w-full max-h-40 overflow-y-auto mt-1 border border-purple-400 bg-white shadow-md rounded-md z-10">
                {searchResult.map((client, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-sm"
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

        <div className="flex justify-around w-full gap-4">
          {/* Publication Name  */}
          <div className="flex flex-col h-20 relative w-3/4">
            <label className="mb-1 font-medium text-left">
              Publication Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="publication"
              value={formData.publication}
              onChange={handlePublicationSearch}
              className="border border-purple-700 rounded-md px-3 py-2 "
              autoComplete="off"
              required
            />

            {/* Dropdown list */}
            {searchResultPublication.length > 0 && (
              <ul className="absolute top-full left-0 w-full max-h-40 overflow-y-auto mt-1 border border-purple-400 bg-white shadow-md rounded-md z-10">
                {searchResultPublication.map((publication, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer text-sm"
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
          {/* Date Of Insertion  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Date of Insertion <span className="text-red-600">*</span>
            </label>
            <textarea
              name="dateOfInsertion"
              value={formData.dateOfInsertion}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-around w-full gap-4">
          {/* Position  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Position <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Contact Number  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Contact Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Payment Terms  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Payment Terms <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Cust. Id  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">Customer ID</label>
            <input
              type="text"
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-around w-full gap-4">
          {/* No. of Ads  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Multiply By <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="noOfAds"
              value={formData.noOfAds}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Width  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Width <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="width"
              value={formData.width}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Height  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Height <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Rate  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Rate <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="rate"
              value={formData.rate}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-around w-full gap-4">
          {/* Amount  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Amount <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="amount"
              value={formData.amount}
              disabled
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Discount  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Discount <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Total Amount  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Total Amount <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="totalAmount"
              value={formData.totalAmount}
              disabled
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* % of GST  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Percentage of GST <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              onWheel={(e) => e.target.blur()}
              name="percentageOfGST"
              value={formData.percentageOfGST}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-around w-full gap-4">
          {/* Scheme  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Scheme <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="scheme"
              value={formData.scheme}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* PinCode  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Pincode <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Date  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Ref No.  */}
          <div className="flex flex-col w-1/4">
            <label className="mb-1 font-medium">
              Reference No. <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="refNo"
              value={formData.refNo}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-around w-full gap-4">
          {/* Invoice  */}
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-medium">
              Invoice <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="invoice"
              value={formData.invoice}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Due Date  */}
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-medium">
              Due Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="flex gap-4">
          {/* Address  */}
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-medium">
              Address <span className="text-red-600">*</span>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>

          {/* Remark  */}
          <div className="flex flex-col w-1/2">
            <label className="mb-1 font-medium">
              Remark <span className="text-red-600">*</span>
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              required
              className="border border-purple-700 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 rounded-md transition mb-6"
          >
            Submit Quotation
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuotationForm;
