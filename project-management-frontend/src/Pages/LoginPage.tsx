import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-8 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg md:p-8 dark:bg-gray-800">
        <div className="mb-6 flex flex-col items-center">
          <img className="mb-2 size-10" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Flowbite</h1>
        </div>
        <h2 className="text-center text-xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your email</label>
            <input type="email" id="email" className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="name@company.com" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input type="password" id="password" className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" placeholder="••••••••" required />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Remember me</span>
            </label>
            <Link to="/forget-password" className="text-blue-600 hover:underline dark:text-blue-400">Forgot password?</Link>
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Sign in</button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account? <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">Sign up</a>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;