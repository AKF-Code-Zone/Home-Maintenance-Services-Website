import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAppContext } from "../context/Appcontext";

// Import validation helpers
import { sanitizeInput } from "../utils/sanitizeInput";
import { regEmailTest } from "../utils/regEmailTest";
import { charLength } from "../utils/charLength";

const Login = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const email = sanitizeInput(inputData.email);
    const password = sanitizeInput(inputData.password);

    let valid = true;
    const newErrors = {};

    // --- CLIENT-SIDE VALIDATION ---
    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (regEmailTest(email) === 0) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (charLength(password, 6, 35) === 0) {
      newErrors.password = "Password must be 6–35 characters long";
      valid = false;
    }

    if (!valid) {
      newErrors.overall = "Please fix the highlighted errors.";
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      // Call context login function
      const data = await login(email, password);

      if (data.success) {
        // Save token to LocalStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Logged in successfully");

        // Redirect to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      setErrors({
        overall: error.response?.data?.message || "Incorrect email and password combination",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-md border border-emerald-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-emerald-800">
          Login
        </h2>

        {errors.overall && (
          <p className="text-red-500 text-center mb-4 font-medium">
            {errors.overall}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-5">
            <label className="block text-emerald-700 mb-2 font-medium">Email*</label>
            <input
              type="email"
              name="email"
              value={inputData.email}
              onChange={handleChange}
              className="login-input w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-emerald-700 mb-2 font-medium">Password*</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={inputData.password}
                onChange={handleChange}
                className="login-input w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="login-btn w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Link to registration */}
          <div className="mt-5 text-center">
            <Link
              to="/registration"
              className="text-emerald-600 hover:text-emerald-800 hover:underline font-medium"
            >
              Don't have an account? <span className="text-amber-600">Sign Up</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
