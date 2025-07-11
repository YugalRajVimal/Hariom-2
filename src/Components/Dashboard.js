import React, { useState } from "react";
import { Link } from "react-router-dom";
import InvoicePDF from "./TaxInvoiceView/TaxInvoiceView";

const Dashboard = (props) => {
  const { setIsAuthenticated } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [publicationName, setPublicationName] = useState("");
  const [gmail, setGmail] = useState("");
  const [selectedLink, setSelectedLink] = useState(0);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Publication:", publicationName);
    console.log("Gmail:", gmail);
    setIsOpen(false); // Close modal after submission
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Handle password change logic here
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);
    console.log("Confirm Password:", confirmPassword);
    setChangePasswordModal(false); // Close modal after submission
  };

  const handleLogout = () => {
    // Handle logout logic here
    // console.log("Logging out...");
    localStorage.setItem("isAuthenticated", false);
    localStorage.setItem("token", "");
    localStorage.setItem("userId", "");

    setIsAuthenticated(false);
    setLogoutModal(false); // Close modal after logout
  };

  return (
    <nav className="w-[20%]  pb-6 flex flex-col h-[90vh] overflow-x-hidden hide-scrollbar overflow-y-auto sticky top-0 justify-between items-center border-slate-300 border-r-2">
      <div className="w-full">
        <a href="/">
          <h2 className="text-3xl font-serif tracking-wide font-light font-semibold mb-6 py-4  text-black  border-slate-300 border-b-2 ml-4">
            Side Panel
          </h2>
        </a>

        <ul className="flex flex-col items-end gap-4 list-none text-base ml-4">
          <li
            className={`transition ease-in-out duration-200  h-[50px] w-[90%] bg-purple-100 rounded-l-md flex items-center justify-between p-4 shadow-sm border-r-2 border-purple-500 translate-x-[2px]  ${
              selectedLink == 1 && "bg-purple-300 h-[65px] w-[92%]"
            }
          `}
          >
            <div
              className={`h-5 aspect-[1/1] border-purple-500 border-2 rounded-full ${
                selectedLink == 1 && "bg-purple-500 border-purple-600"
              }`}
            ></div>
            <Link
              to="/quotation-form"
              onClick={() => setSelectedLink(1)}
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors"
            >
              Quotation Form
            </Link>
          </li>
          <li
            className={`transition ease-in-out duration-200  h-[50px] w-[90%] bg-purple-100 rounded-l-md flex items-center justify-between p-4 shadow-sm border-r-2 border-purple-500 translate-x-[2px]
          ${selectedLink == 2 && "bg-purple-300 h-[65px] w-[92%]"}
          `}
          >
            <div
              className={`h-5 aspect-[1/1] border-purple-500 border-2 rounded-full ${
                selectedLink == 2 && "bg-purple-500 border-purple-600"
              }`}
            ></div>
            <Link
              to="/all-quotations"
              onClick={() => setSelectedLink(2)}
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors"
            >
              All Quotations
            </Link>
          </li>

          <li
            className={`transition ease-in-out duration-200  h-[50px] w-[90%] bg-purple-100 rounded-l-md flex items-center justify-between p-4 shadow-sm border-r-2 border-purple-500 translate-x-[2px]
          ${selectedLink == 8 && "bg-purple-300 h-[65px] w-[92%]"}
          `}
          >
            <div
              className={`h-5 aspect-[1/1] border-purple-500 border-2 rounded-full ${
                selectedLink == 8 && "bg-purple-500 border-purple-600"
              }`}
            ></div>
            <Link
              to="/ro-generation"
              onClick={() => setSelectedLink(8)}
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors"
            >
              RO Generation
            </Link>
          </li>
          <li
            className={`transition ease-in-out duration-200  h-[50px] w-[90%] bg-purple-100 rounded-l-md flex items-center justify-between p-4 shadow-sm border-r-2 border-purple-500 translate-x-[2px]
          ${selectedLink == 7 && "bg-purple-300 h-[65px] w-[92%]"}
          `}
          >
            <div
              className={`h-5 aspect-[1/1] border-purple-500 border-2 rounded-full ${
                selectedLink == 7 && "bg-purple-500 border-purple-600"
              }`}
            ></div>
            <Link
              to="/all-ro"
              onClick={() => setSelectedLink(7)}
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors"
            >
              All Released Orders
            </Link>
          </li>
          {/* <li
            className={`transition ease-in-out duration-200  h-[50px] w-[90%] bg-purple-100 rounded-l-md flex items-center justify-between p-4 shadow-sm border-r-2 border-purple-500 translate-x-[2px]
          ${selectedLink == 6 && "bg-purple-300 h-[65px] w-[92%]"}
          `}
          >
            <div
              className={`h-5 aspect-[1/1] border-purple-500 border-2 rounded-full ${
                selectedLink == 6 && "bg-purple-500 border-purple-600"
              }`}
            ></div>
            <Link
              to="/all-quotations"
              onClick={() => setSelectedLink(6)}
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors"
            >
              All Quotations
            </Link>
          </li> */}
          <li
            className={`transition ease-in-out duration-200  h-[50px] w-[90%] bg-purple-100 rounded-l-md flex items-center justify-between p-4 shadow-sm border-r-2 border-purple-500 translate-x-[2px]
          ${selectedLink == 4 && "bg-purple-300 h-[65px] w-[92%]"}
          `}
          >
            <div
              className={`h-5 aspect-[1/1] border-purple-500 border-2 rounded-full ${
                selectedLink == 4 && "bg-purple-500 border-purple-600"
              }`}
            ></div>
            <Link
              to="/all-bills"
              onClick={() => setSelectedLink(4)}
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors"
            >
              All Bills
            </Link>
          </li>
          <li
            className={`transition ease-in-out duration-200  h-[50px] w-[90%] bg-purple-100 rounded-l-md flex items-center justify-between p-4 shadow-sm border-r-2 border-purple-500 translate-x-[2px]
          ${selectedLink == 5 && "bg-purple-300 h-[65px] w-[92%]"}
          `}
          >
            <div
              className={`h-5 aspect-[1/1] border-purple-500 border-2 rounded-full ${
                selectedLink == 5 && "bg-purple-500 border-purple-600"
              }`}
            ></div>
            <Link
              to="/bill-generation"
              onClick={() => setSelectedLink(5)}
              className="text-gray-800 hover:text-purple-600 font-semibold transition-colors"
            >
              Bill Generation
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex flex-col justify-center items-center gap-4">
        {/* <button
          onClick={() => setIsOpen(true)}
          className="px-4 w-fit py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Add New Publication
        </button> */}
        <div className="flex gap-2">
          {/* <button
            onClick={() => setChangePasswordModal(true)}
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Change Password
          </button> */}
          <button
            onClick={() => setLogoutModal(true)}
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 mt-6"
          >
            Log Out
          </button>
        </div>
      </div>
      {isOpen && (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              Register New Publication
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex gap-4 items-center justify-between">
                <label className="block mb-1 font-medium">
                  Publication Name
                </label>
                <input
                  type="text"
                  required
                  value={publicationName}
                  onChange={(e) => setPublicationName(e.target.value)}
                  placeholder="Enter Publication Name"
                  className="w-[70%] border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex gap-4 items-center justify-between">
                <label className="block mb-1 font-medium">Gmail ID</label>
                <input
                  type="email"
                  required
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  placeholder="Enter Gmail ID"
                  className="w-[70%] border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {changePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="flex gap-4 items-center justify-between">
                <label className="block mb-1 font-medium">Old Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter Old Password"
                  className="w-[70%] border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex gap-4 items-center justify-between">
                <label className="block mb-1 font-medium">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                  className="w-[70%] border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex gap-4 items-center justify-between">
                <label className="block mb-1 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-[70%] border px-3 py-2 rounded outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setChangePasswordModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Change Password
                </button>
              </div>
            </form>
            <div className="mt-4">
              <p className="text-blue-500 hover:underline">Forgot Password</p>
            </div>
          </div>
        </div>
      )}
      {logoutModal && (
        <div className="fixed z-60 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white z-70 rounded-lg shadow-lg w-full max-w-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Dashboard;
