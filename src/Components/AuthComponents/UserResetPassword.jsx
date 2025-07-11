import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserResetPassword = () => {
  const navigate = useNavigate();

  // State to manage email and password input
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  //   // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create reset password data object
    const resetPasswordData = {
      email,
    };

    try {
      // Make POST request to the reset password API
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resetPasswordData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Redirect to verify account
        alert("Verify your email to reset your password");
        navigate("/verify-account", {
          state: { email: email },
        });
      } else {
        // Handle reset password failure
        setError(
          data.message || "Reset password failed. Please check your email."
        );
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] w-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-semibold text-center text-gray-900 ">
            Reset Password
          </h2>

          {/* <div className="flex items-center justify-center">
            <label htmlFor="isSeller" className="mr-2 text-xs text-gray-600">
              Seller's Account
            </label>
            <input
              id="isSeller"
              name="isSeller"
              type="checkbox"
              className="w-4 h-4 text-xs text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={isSeller}
              onChange={(e) => setIsSeller(e.target.checked)}
            />
          </div> */}
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Password
            </button>
          </div>
          {/* LogIn */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 px-1"
              >
                Log In
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserResetPassword;
