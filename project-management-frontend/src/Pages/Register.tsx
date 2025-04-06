import { useState, useEffect } from "react";
import { registerUser } from "../services/authApi";
import { RegisterRequest, AuthenticationResponse } from "../types/auth";
import registerImage from "../assets/images/register.png";
import { Spinner } from "flowbite-react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    role: "USER",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Password validation states
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [, setPasswordChecks] = useState({
    hasLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  // State for password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "password") {
      checkPasswordStrength(value);
      if (formData.confirmPassword) {
        setPasswordsMatch(value === formData.confirmPassword);
      }
    }
    
    if (name === "confirmPassword") {
      setPasswordsMatch(value === formData.password);
    }
  };

  const checkPasswordStrength = (password: string) => {
    const checks = {
      hasLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    setPasswordChecks(checks);
    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength(strength);
  };

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response: AuthenticationResponse = await registerUser(formData);
      console.log("Registration successful:", response);
      localStorage.setItem("userEmail", formData.email);
      navigate("/email-verification");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-12">
      <div className="flex w-full max-w-7xl rounded-3xl bg-white shadow-2xl">
        {/* Left Section - Illustration */}
        <div className="hidden items-center justify-center bg-blue-100 p-8 lg:flex lg:w-1/2">
          <img src={registerImage} alt="Illustration" className="w-3/4" />
        </div>

        {/* Right Section - Form */}
        <div className="w-full bg-white p-8 lg:w-1/2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-2xl">
            Create an account
          </h1>
          {error && <div className="text-red-500">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="XX-XXX-XXX"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                />
              </div>
              
              {/* Password Field */}
              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-gray-900">Password</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? (
                      <svg
                        className="size-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="size-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 4.477 0 8.268 2.943 9.542 7"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3l18 18"
                        />
                      </svg>
                    )}
                  </span>
                </div>

                {/* Password Strength Bar */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ease-in-out ${
                          passwordStrength === 0 ? 'w-0' : 
                          passwordStrength === 1 ? 'w-1/5 bg-red-500' : 
                          passwordStrength === 2 ? 'w-2/5 bg-orange-500' : 
                          passwordStrength === 3 ? 'w-3/5 bg-yellow-500' : 
                          passwordStrength === 4 ? 'w-4/5 bg-blue-500' : 
                          'w-full bg-green-500'
                        }`}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Password strength: {
                        passwordStrength === 0 ? 'Very Weak' : 
                        passwordStrength === 1 ? 'Weak' : 
                        passwordStrength === 2 ? 'Fair' : 
                        passwordStrength === 3 ? 'Good' : 
                        passwordStrength === 4 ? 'Strong' : 
                        'Very Strong'
                      }
                    </p>
                  </div>
                )}
              </div>
              
              {/* Confirm Password Field */}
              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-gray-900">Confirm Password</label>
                <div className="relative">
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  >
                    {confirmPasswordVisible ? (
                      <svg
                        className="size-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="size-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 4.477 0 8.268 2.943 9.542 7"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 3l18 18"
                        />
                      </svg>
                    )}
                  </span>
                </div>
                
                {/* Password Match Status */}
                {formData.confirmPassword && (
                  <div 
                    className={`mt-2 flex items-center transition-opacity duration-300 ${passwordsMatch === null ? 'opacity-0' : 'opacity-100'}`}
                  >
                    {passwordsMatch ? (
                      <>
                        <svg className="mr-1 size-4 animate-pulse text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-xs text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <svg className="mr-1 size-4 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-xs text-red-600">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="mr-2" /> : "Sign Up"}
                {loading ? "Loading..." : ""}
              </button>
              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
              </p>
            </div>
          </form>    
        </div>
      </div>
    </div>
  );
}

export default Register;