/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authenticate, googleAuthenticate } from "../services/authApi";
import { checkUserWorkspace } from "../services/Workspace-apis";
import { AuthenticationRequest } from "../types/auth";
import loginImage from "../assets/images/login.png";
import { Link } from "react-router-dom";
import { Spinner } from "flowbite-react";

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
declare const google: any;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || null;

  const checkAndRedirect = async () => {
    try {
      const hasWorkspace = await checkUserWorkspace();
      console.log("Workspace check result:", hasWorkspace);
      if (hasWorkspace) {
        // If there's a 'from' path (e.g., invitation), go there; otherwise, default to dashboard
        navigate(from || "/dashboard/projects");
      } else {
        // Pass the 'from' state to setup so it can redirect back after completion
        navigate("/setup", { state: { from } });
      }
    } catch (err) {
      console.error("Error checking workspace:", err);
      navigate("/setup", { state: { from } });
    }
  };

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

    return () => {
      const script = document.getElementById(scriptId);
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const requestData: AuthenticationRequest = { email, password };

    try {
      const response = await authenticate(requestData);
      localStorage.setItem("token", response.token);
      await checkAndRedirect();
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!isGoogleLoaded || !window.google) {
      setError("Google authentication is not ready. Please try again.");
      return;
    }

    google.accounts.id.initialize({
      client_id: GOOGLE_ID,
      callback: async (response: any) => {
        setLoading(true);
        try {
          const authResponse = await googleAuthenticate(response.credential);
          localStorage.setItem("token", authResponse.token);
          await checkAndRedirect();
        } catch (error: any) {
          setError(error.message || "Google authentication failed");
        } finally {
          setLoading(false);
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

          {error && <p className="mb-4 text-red-500">{error}</p>}

          <div className="mb-4 flex flex-col gap-4">
            <button
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 text-gray-900 shadow-sm transition hover:bg-gray-200 disabled:opacity-50"
              onClick={handleGoogleLogin}
              disabled={!isGoogleLoaded || loading}
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

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  className="mt-2 block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:ring focus:ring-blue-300"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="size-5 rounded border-gray-300" />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <Link to="/forget-password" className="text-blue-500 hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Loading...
                </>
              ) : (
                "Sign in to your account"
              )}
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