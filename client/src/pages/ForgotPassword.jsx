import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { forgotPassword } from "../redux/slice/authSlice";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { forgotPasswordLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      const result = await dispatch(forgotPassword(email)).unwrap();

      setSuccessMessage(
        result.message ||
          "If an account exists for this email, a reset link will be sent.",
      );

      toast.success("Request submitted successfully");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Unable to process your request",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your registered email address to receive a password reset
            link.
          </p>
        </div>

        {successMessage ? (
          <div
            className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-300"
            role="status"
          >
            {successMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="forgot-email"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>

              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full rounded-xl border border-gray-300 bg-transparent px-4 py-3 text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={forgotPasswordLoading}
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-white hover:text-gray-700   transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {forgotPasswordLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
