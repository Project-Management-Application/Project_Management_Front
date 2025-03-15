import React, { useState } from "react";
import { Link} from "react-router-dom";
import { forgotPassword } from "../services/api";
import { ForgotPassRequest, ForgotPassResponse } from "../types/auth";
import { Spinner } from "flowbite-react"; // Import Flowbite spinner

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const request: ForgotPassRequest = { email };
      const response: ForgotPassResponse = await forgotPassword(request);

      // Store token and userId in local storage
      localStorage.setItem("resetToken", response.token);
      localStorage.setItem("resetUserId", response.userId.toString());

      setIsSubmitted(true);
      setError("");

    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-600">
            <svg className="size-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Forgot your password?</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {!isSubmitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-lg border border-gray-300 p-3 text-gray-900 placeholder:text-gray-500 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 dark:bg-red-900">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="mr-2" /> : "Reset Password"}
                {loading && "Loading..."}
              </button>
            </div>

            <div className="flex items-center justify-center text-sm">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 rounded-md bg-green-50 p-4 dark:bg-green-900">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Email sent</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              We've sent a password reset link to <span className="font-medium">{email}</span>.
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <div className="mt-4">
              <Link
                to="/login"
                className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
              >
                Return to login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
