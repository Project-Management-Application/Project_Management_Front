import { useState } from "react";
import registerImage from "../assets/images/register.png";
function Register() {
  
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Form Submitted:", formData);
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
          <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
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
                placeholder="XXX-XX-XXXX-XXX"
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
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-5 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
              />
            </div>
            <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
