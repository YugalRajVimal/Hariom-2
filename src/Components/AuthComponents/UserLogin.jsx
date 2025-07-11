import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserLogin = (props) => {
  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = props;

  // State to manage email and password input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    // console.log(email, password);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signin`,
        { email, password }
      );
      // console.log(response);
      if (response.data.error) {
        return setError(response.data.error);
      }
      //Check Status and store token in local storage
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", true);

        navigate("/");
      }
      setError("Something went wrong. Please try again later.");
      return;
    } catch (error) {
      console.error("Error signing in", error);
      localStorage.setItem("isAuthenticated", false);
      setError(
        error.response.data.message ||
          error.message ||
          "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[90vh] w-screen bg-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        {/* Error message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="space-y-6" onSubmit={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-2">
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
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="/reset-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
