import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Star, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // Validation
    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) return "Email is required";
        if (!re.test(email)) return "Please enter a valid email address";
        return "";
    };
    const validatePassword = (password) => {
        if (!password) return "Password is required";
        if (password.length < 8) return "Password must be at least 8 characters";
        return "";
    };

    useEffect(() => {
        const newErrors = {};
        if (touched.email) { const e = validateEmail(formData.email); if (e) newErrors.email = e; }
        if (touched.password) { const e = validatePassword(formData.password); if (e) newErrors.password = e; }
        setErrors(newErrors);
    }, [formData, touched]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleBlur  = (e) => setTouched({ ...touched, [e.target.name]: true });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        setTouched({ email: true, password: true });
        const emailError    = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        if (emailError || passwordError) { setErrors({ email: emailError, password: passwordError }); return; }

        setIsLoading(true);
        try {
            const result = await login({ email: formData.email, password: formData.password });
            if (result.role === "admin" || result.role === "superadmin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setApiError(error.response?.data?.message || "Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 font-['Satoshi',sans-serif] bg-gradient-to-br from-gray-50 via-white to-emerald-50/30">
            {/* Decorative blobs */}
            <div className="fixed -left-64 -top-64 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[120px]" />
            <div className="fixed -right-64 -bottom-64 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[120px]" />

            <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden flex">
                {/* Left Panel */}
                <div className="hidden md:flex md:w-[45%] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
                    <div className="absolute -left-20 top-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />
                    <div className="absolute -right-20 bottom-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px]" />
                    <div className="relative z-10 flex flex-col justify-center p-8 lg:p-10">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                                    <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                                </svg>
                            </div>
                            <span className="text-lg font-bold text-white">Clipperz</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">Welcome back</h1>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs">Sign in to continue creating viral clips with AI</p>
                        <div className="w-12 h-0.5 bg-gray-700 mb-6" />
                        <div className="flex items-center gap-6">
                            <div className="pr-6 border-r border-gray-700">
                                <p className="text-xl font-bold text-emerald-400">10K+</p>
                                <p className="text-xs text-gray-500">Creators</p>
                            </div>
                            <div className="pr-6 border-r border-gray-700">
                                <p className="text-xl font-bold text-emerald-400">1M+</p>
                                <p className="text-xs text-gray-500">Clips Made</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="text-xl font-bold text-emerald-400">4.9</p>
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <p className="text-xs text-gray-500 ml-0.5">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 flex items-center justify-center p-6 lg:p-10">
                    <div className="w-full max-w-sm">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Log in to your account</h2>
                            <p className="text-sm text-gray-500">Enter your credentials to continue</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="you@example.com"
                                    className={`w-full h-11 px-4 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.email
                                            ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    }`}
                                />
                                {errors.email && (
                                    <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs">{errors.email}</span>
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <Link to="/forgot-password" className="text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter your password"
                                        className={`w-full h-11 px-4 pr-11 text-sm bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            errors.password
                                                ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                                                : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        <span className="text-xs">{errors.password}</span>
                                    </div>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                                    Remember me for 30 days
                                </label>
                            </div>

                            {/* API Error */}
                            {apiError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{apiError}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 mt-4"
                            >
                                {isLoading ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 animate-spin" />
                                        Logging In...
                                    </>
                                ) : (
                                    <>
                                        Log In
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-5">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                                Sign up
                            </Link>
                        </p>

                        <p className="text-center text-xs text-gray-400 mt-3">
                            By continuing, you agree to our{" "}
                            <Link to="/terms" className="text-orange-500 hover:text-orange-600 transition-colors">Terms of Service</Link>
                            {" "}and{" "}
                            <Link to="/privacy" className="text-orange-500 hover:text-orange-600 transition-colors">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
