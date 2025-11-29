
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAppContext } from "../context/Appcontext";

// Import validation helpers
import { sanitizeInput } from "../utils/sanitizeInput";
import { regNameTest } from "../utils/regNameTest";
import { regEmailTest } from "../utils/regEmailTest";
import { charLength } from "../utils/charLength";

const Registration = () => {
  const { register } = useAppContext();
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // reset errors

    const name = sanitizeInput(inputData.name);
    const email = sanitizeInput(inputData.email);
    const password = sanitizeInput(inputData.password);
    const confirmPassword = sanitizeInput(inputData.confirmPassword);

    let valid = true;
    const newErrors = {};

    // Name validation
    if (!name) {
      newErrors.name = "Name is required";
      valid = false;
    } else if (regNameTest(name) === 0) {
      newErrors.name = "Only alphabets allowed in name";
      valid = false;
    } else if (charLength(name, 3, 35) === 0) {
      newErrors.name = "Name must be 3–35 characters";
      valid = false;
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (regEmailTest(email) === 0) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (charLength(password, 6, 35) === 0) {
      newErrors.password = "Password must be 6–35 characters long";
      valid = false;
    }

    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    if (!valid) {
      newErrors.overall = "Please fix the highlighted errors.";
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
      toast.success("Account created successfully!");
      navigate("/login"); // redirect to login page
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="registration-page min-h-screen flex items-center justify-center bg-emerald-50">
  <div className="bg-white p-12 rounded-xl shadow-lg w-full max-w-md border border-emerald-100">
    <h2 className="text-3xl font-bold mb-6 text-center text-emerald-800">
      Create Account
    </h2>

    {errors.overall && (
      <p className="text-red-500 text-center mb-4 font-medium">
        {errors.overall}
      </p>
    )}

    <form onSubmit={handleSubmit}>
      {/* Full Name */}
      <div className="mb-5">
        <label className="block text-emerald-700 mb-2 font-medium">
          Full Name*
        </label>
        <input
          type="text"
          name="name"
          value={inputData.name}
          onChange={handleChange}
          className="registration-input w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          placeholder="Enter your full name"
          minLength={3}
          required
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="block text-emerald-700 mb-2 font-medium">
          Email*
        </label>
        <input
          type="email"
          name="email"
          value={inputData.email}
          onChange={handleChange}
          className="registration-input w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          placeholder="Enter your email"
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="mb-6 ">
        <label className="block text-emerald-700 mb-2 font-medium">
          Password*
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={inputData.password}
            onChange={handleChange}
            className="registration-input w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
            placeholder="Enter password"
            minLength={6}
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
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-6 ">
        <label className="block text-emerald-700 mb-2 font-medium">
          Confirm Password*
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={inputData.confirmPassword}
            onChange={handleChange}
            className="registration-input w-full px-4 py-3 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
            placeholder="Re-enter password"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="registration-btn w-full bg-amber-500 text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition duration-300 font-medium shadow-md hover:shadow-lg disabled:opacity-70 cursor-pointer"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <div className="mt-5 text-center">
        <Link
          to="/login"
          className="text-emerald-600 hover:text-emerald-800 hover:underline font-medium"
        >
          Already have an account?{" "}
          <span className="text-amber-600">Login</span>
        </Link>
      </div>
    </form>
  </div>
</div>

  );
};

export default Registration;