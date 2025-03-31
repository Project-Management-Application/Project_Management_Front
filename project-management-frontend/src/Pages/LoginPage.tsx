/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate, googleAuthenticate } from "../services/api";
import { checkUserWorkspace } from "../services/Workspace-apis";
import { AuthenticationRequest } from "../types/auth";
import loginImage from "../assets/images/login.png";
import { Link } from "react-router-dom";

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
declare const google: any;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const navigate = useNavigate();

  // Check workspace after successful login
  const checkAndRedirect = async () => {
    try {
      const hasWorkspace = await checkUserWorkspace();
      if (hasWorkspace) {
        navigate("/dashboard/projects");
      } else {
        navigate("/setup");
      }
    } catch (err) {
      // Log the error for debugging but still redirect to setup as fallback
      console.error("Error checking workspace:", err);
      navigate("/setup");
    }
  };

  // Load Google Identity Services SDK
  useEffect(() => {
    const scriptId = "google-sdk";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => setIsGoogleLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsGoogleLoaded(true);
    }

    // Cleanup function to remove script if component unmounts
    return () => {
      const script = document.getElementById(scriptId);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle email/password login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const requestData: AuthenticationRequest = { email, password };

    try {
      const response = await authenticate(requestData);
      localStorage.setItem("token", response.token);
      await checkAndRedirect();
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    if (!isGoogleLoaded || !window.google) {
      setError("Google authentication is not ready. Please try again.");
      return;
    }

    google.accounts.id.initialize({
      client_id: GOOGLE_ID,
      callback: async (response: any) => {
        try {
          const authResponse = await googleAuthenticate(response.credential);
          localStorage.setItem("token", authResponse.token);
          await checkAndRedirect();
        } catch (error: any) {
          setError(error.message || "Google authentication failed");
        }
      },
    });

    google.accounts.id.prompt();
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 p-12">
      <div className="flex w-full max-w-7xl rounded-3xl bg-white shadow-2xl">
        {/* Left Section - Login Form */}
        <div className="w-1/2 bg-white p-12">
          <h2 className="mb-6 text-4xl font-bold text-gray-900">Welcome Back</h2>
          
          {/* Error Message */}
          {error && <p className="mb-4 text-red-500">{error}</p>}

          {/* Google Sign-in Button */}
          <div className="mb-4 flex flex-col gap-4">
            <button
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-gray-900 shadow-sm transition hover:bg-gray-200 disabled:opacity-50"
              onClick={handleGoogleLogin}
              disabled={!isGoogleLoaded}
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="size-5" />
              Sign in with Google
            </button>
          </div>

          <div className="my-6 flex items-center">
            <hr className="grow border-gray-300" />
            <span className="mx-4 text-gray-500">or</span>
            <hr className="grow border-gray-300" />
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="size-5 rounded border-gray-300" />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <Link to="/forget-password" className="text-blue-500 hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700">
              Sign in to your account
            </button>

            <p className="text-center text-base text-gray-500">
              Don't have an account? <Link to="/registration" className="text-blue-500 hover:underline">Sign up</Link>
            </p>
          </form>
        </div>

        {/* Right Section - Illustration */}
        <div className="flex w-1/2 items-center justify-center bg-blue-50 p-12">
          <img src={loginImage} alt="Illustration" className="w-full rounded-3xl object-cover" />
        </div>
      </div>
    </section>
  );
}

export default LoginPage;