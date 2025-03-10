import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { verifyOtp } from "../services/api";
import { OtpVerificationRequest } from "../types/auth";

function EmailVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError("No email found. Please sign up again.");
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isComplete = otp.every((digit) => digit !== "");
    if (!isComplete) {
      setError("Please enter all 6 digits.");
      return;
    }
    
    setError("");

    try {
      const otpString = otp.join("");
      const requestData: OtpVerificationRequest = { email, otp: otpString };

      await verifyOtp(requestData);
      setIsVerified(true);
      localStorage.removeItem("userEmail"); // Clear email from storage after successful verification
    } catch (err) {
      setError(err);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <a href="#" className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="mr-2 size-8" src="src/assets/images/taskify-logo.png" alt="logo"/>
          Taskify    
        </a>
        <div className="w-full rounded-lg bg-white p-6 shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md sm:p-8 md:mt-0">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
            Verify Your Email
          </h2>

          {!isVerified ? (
            <form className="mt-4 space-y-4 md:space-y-5 lg:mt-5" onSubmit={handleSubmit}>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A 6-digit verification code has been sent to <strong>{email}</strong>
              </p>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Enter the 6-digit code
                </label>
                <div className="flex space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="block w-12 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-center text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button 
                type="submit" 
                className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700"
              >
                Verify Code
              </button>
            </form>
          ) : (
            <div className="mt-8 rounded-md bg-green-50 p-4 dark:bg-green-900">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="size-5 text-green-400 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Email Verified</h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>
                      Your email has been successfully verified. You can now proceed to log in.
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link
                        to="/login"
                        className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100"
                      >
                        Go to Login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EmailVerification;
