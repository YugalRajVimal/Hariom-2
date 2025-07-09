import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyAccount = () => {
  const location = useLocation();
  const { email, role } = location.state || {};
  const navigate = useNavigate();

  // State for form inputs
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the data object to be sent to the API
    const verifyAccountData = {
      email,
      otp,
      password,
      role,
    };

    try {
      // Make POST request to the API
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/user/verify-account`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verifyAccountData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // If verification is successful, show alert and redirect to login page
        alert("Account verified successfully. Please login to continue");
        navigate("/signin");
      } else {
        // Handle API error response
        setError(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <h3 className="text-xl font-semibold  text-center">
          Verify Your Account
        </h3>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="otp" className="sr-only">
                OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;
